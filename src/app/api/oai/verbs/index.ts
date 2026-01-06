import { db } from '@/db/db';
import { publishedArticles } from '@/db/schema';
import {
  decodeResumptionToken,
  encodeResumptionToken,
  errorResponse,
  escapeXml,
  formatDateForXML,
  stripHtml,
} from '@/lib/utils';
import { asc, eq, sql } from 'drizzle-orm';
import { NextRequest } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_URL!;

const oaiDate = new Date().toISOString();

export function identifyResponse() {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
      <responseDate>${oaiDate}</responseDate>
      <request verb="Identify">/api/oai</request>
      <Identify>
        <repositoryName>Journal of African Epidemiology and Public Health</repositoryName>
        <baseURL>${new URL(BASE_URL).origin}/api/oai</baseURL>
        <protocolVersion>2.0</protocolVersion>
        <adminEmail>patrickhag09@gmail.com</adminEmail>
        <earliestDatestamp>2025-01-01</earliestDatestamp>
        <deletedRecord>no</deletedRecord>
        <granularity>YYYY-MM-DD</granularity>
      </Identify>
    </OAI-PMH>`;
}

export function listMetadataFormats() {
  return `<OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
  <responseDate>${oaiDate}</responseDate>
  <request verb="ListMetadataFormats">/api/oai</request>
  <ListMetadataFormats>
    <metadataFormat>
      <metadataPrefix>oai_dc</metadataPrefix>
      <schema>http://www.openarchives.org/OAI/2.0/oai_dc.xsd</schema>
      <metadataNamespace>http://www.openarchives.org/OAI/2.0/oai_dc/</metadataNamespace>
    </metadataFormat>
  </ListMetadataFormats>
</OAI-PMH>

  `;
}

export async function listIdentifiersResponse(req: NextRequest) {
  const url = new URL(req.url);
  const REPO_HOST = new URL(BASE_URL).host;

  const metadataPrefix = url.searchParams.get('metadataPrefix');

  if (!metadataPrefix) {
    return errorResponse('badArgument', 'metadataPrefix is required');
  }
  if (metadataPrefix !== 'oai_dc') {
    return errorResponse(
      'cannotDisseminateFormat',
      'Unsupported metadata format'
    );
  }

  const articles = await db.query.publishedArticles.findMany({
    where: eq(publishedArticles.status, 'PUBLISHED'),
    columns: {
      id: true,
      publishedAt: true,
      status: true,
      updatedAt: true,
    },
    with: {
      article: {
        columns: {
          paperId: true,
        },
      },
    },
  });

  const headersXml = articles
    .map((item) => {
      const datestamp = formatDateForXML(item.publishedAt);
      const identifier = `oai:${REPO_HOST}:article-${item.id}`;

      if (item.status === 'WITHDRAWN') {
        return `
          <header status="deleted">
            <identifier>${identifier}</identifier>
            <datestamp>${formatDateForXML(item.updatedAt)}</datestamp>
          </header>
        `;
      }

      return `<header>
          <identifier>${identifier}</identifier>
          <datestamp>${datestamp}</datestamp>
        </header>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
    <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
      <responseDate>${oaiDate}</responseDate>
      <request verb="ListIdentifiers" metadataPrefix="oai_dc">
        ${url.pathname}
      </request>
      <ListIdentifiers>
    ${headersXml}
      </ListIdentifiers>
    </OAI-PMH>`;
}

export async function listRecordsResponse(req: NextRequest) {
  try {
    const REPO_HOST = new URL(BASE_URL).host;

    const url = new URL(req.url);

    let offset = 0;
    const limit = 50;

    const token = url.searchParams.get('resumptionToken');

    if (token) {
      const decoded = decodeResumptionToken(token);
      if (!decoded) {
        return errorResponse('badResumptionToken', 'Invalid resumptionToken');
      }
      offset = decoded.offset;
    }

    // Fetch all published articles with related data
    const articles = await db.query.publishedArticles.findMany({
      where: eq(publishedArticles.status, 'PUBLISHED'),
      limit,
      offset,
      orderBy: asc(publishedArticles.publishedAt),
      columns: {
        id: true,
        doi: true,
        publishedAt: true,
        slug: true,
      },
      with: {
        article: {
          columns: {
            id: true,
            paperId: true,
          },
          with: {
            metadata: {
              columns: {
                title: true,
                abstract: true,
                topics: true,
              },
            },
            contributors: {
              columns: {
                name: true,
                affiliation: true,
              },
            },
          },
        },
        issue: {
          columns: {
            publicationDate: true,
          },
        },
      },
    });

    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(publishedArticles)
      .where(eq(publishedArticles.status, 'PUBLISHED'));

    let resumptionTokenXml = '';

    const nextOffset = offset + limit;

    if (nextOffset < totalCount[0].count) {
      const nextToken = encodeResumptionToken({
        offset: nextOffset,
        limit,
        metadataPrefix: 'oai_dc',
      });

      resumptionTokenXml = `
          <resumptionToken>${nextToken}</resumptionToken>
        `;
    }

    // Build records XML
    const recordsXml = articles
      .map((article) => {
        const metadata = article.article?.metadata;
        const contributors = article.article?.contributors || [];
        const publishedDate =
          article.publishedAt || article.issue?.publicationDate;
        const datestamp = formatDateForXML(publishedDate);
        const identifier = `oai:${REPO_HOST}:article-${article.id}`;
        const articleUrl = `${BASE_URL}/articles/article/${article.slug}`;

        // Build creators (authors) XML
        const creatorsXml = contributors
          .map(
            (contributor) =>
              `<dc:creator>${escapeXml(contributor.name)}</dc:creator>`
          )
          .join('\n            ');

        // Build affiliations XML (using contributor affiliation)
        const affiliationsXml = contributors
          .filter((contributor) => contributor.affiliation)
          .map(
            (contributor) =>
              `<dc:contributor>${escapeXml(`Affiliation: ${contributor.affiliation}`)}</dc:contributor>`
          )
          .join('\n            ');

        // Build keywords/subjects XML
        const subjectsXml = (metadata?.topics || [])
          .map((topic) => `<dc:subject>${escapeXml(topic)}</dc:subject>`)
          .join('\n            ');

        // Build identifier XML (article URL)
        const identifiersXml = `<dc:identifier>${escapeXml(articleUrl)}</dc:identifier>`;

        // Build relation XML (DOI if available)
        const relationXml = article.doi
          ? `<dc:relation>${escapeXml(article.doi)}</dc:relation>`
          : '';

        // Strip HTML from abstract and convert to plain text
        const plainTextAbstract = stripHtml(metadata?.abstract || '');

        // Build the metadata content with proper formatting
        const metadataContent = [
          `<dc:title>${escapeXml(metadata?.title || 'Untitled')}</dc:title>`,
          creatorsXml,
          affiliationsXml,
          `<dc:description>${escapeXml(plainTextAbstract)}</dc:description>`,
          subjectsXml,
          '<dc:publisher>Journal of African Epidemiology and Public Health</dc:publisher>',
          `<dc:date>${datestamp}</dc:date>`,
          '<dc:type>Text</dc:type>',
          identifiersXml,
          relationXml,
          '<dc:language>en</dc:language>',
        ]
          .filter(Boolean)
          .join('\n            ');

        return `      <record>
          <header>
            <identifier>${identifier}</identifier>
            <datestamp>${datestamp}</datestamp>
          </header>
          <metadata>
            <oai_dc:dc>
              ${metadataContent}
            </oai_dc:dc>
          </metadata>
        </record>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
    <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
             xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
             xmlns:dc="http://purl.org/dc/elements/1.1/"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="
               http://www.openarchives.org/OAI/2.0/
               http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd
               http://www.openarchives.org/OAI/2.0/oai_dc/
               http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
    
      <responseDate>${new Date().toISOString()}</responseDate>
      <request verb="ListRecords" metadataPrefix="oai_dc">${url.pathname}</request>
    
      <ListRecords>
        ${recordsXml}
        ${resumptionTokenXml}
      </ListRecords>
    
    </OAI-PMH>`;
  } catch (error) {
    console.error('Error fetching published articles:', error);
    return errorResponse('idDoesNotExist', 'Error fetching published articles');
  }
}

export async function getRecordResponse(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const identifier = url.searchParams.get('identifier');
    const metadataPrefix = url.searchParams.get('metadataPrefix');

    if (!identifier || !metadataPrefix) {
      return errorResponse(
        'badArgument',
        'Missing identifier or metadataPrefix'
      );
    }

    if (metadataPrefix !== 'oai_dc') {
      return errorResponse(
        'cannotDisseminateFormat',
        'Only oai_dc is supported'
      );
    }

    // Extract local paperId
    // oai:host:article-PAPER_ID
    const paperId = identifier.split(':').pop()?.replace('article-', '');

    if (!paperId) {
      return errorResponse('idDoesNotExist', 'Invalid identifier');
    }

    // Fetch ONE published article
    const article = await db.query.publishedArticles.findFirst({
      where: eq(publishedArticles.id, paperId),
      columns: {
        id: true,
        doi: true,
        publishedAt: true,
        slug: true,
        status: true,
        updatedAt: true,
      },
      with: {
        article: {
          columns: {
            id: true,
            paperId: true,
          },
          with: {
            metadata: {
              columns: {
                title: true,
                abstract: true,
                topics: true,
              },
            },
            contributors: {
              columns: {
                name: true,
                affiliation: true,
              },
            },
          },
        },
        issue: {
          columns: {
            publicationDate: true,
          },
        },
      },
    });

    if (!article) {
      return errorResponse('idDoesNotExist', 'Record not found');
    }

    if (article.status === 'WITHDRAWN') {
      return `<?xml version="1.0" encoding="UTF-8"?>
              <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
                <responseDate>${new Date().toISOString()}</responseDate>
                <GetRecord>
                  <record>
                    <header status="deleted">
                      <identifier>${identifier}</identifier>
                      <datestamp>${formatDateForXML(article.updatedAt)}</datestamp>
                    </header>
                  </record>
                </GetRecord>
              </OAI-PMH>`;
    }

    // 🔁 REUSE record-building logic
    const publishedDate = article.publishedAt;

    const datestamp = formatDateForXML(publishedDate);
    const articleUrl = `${BASE_URL}/articles/article/${article.slug}`;

    const creatorsXml = (article.article?.contributors || [])
      .map((c) => `<dc:creator>${escapeXml(c.name)}</dc:creator>`)
      .join('');

    const affiliationsXml = (article.article?.contributors || [])
      .filter((c) => c.affiliation)
      .map(
        (c) =>
          `<dc:contributor>${escapeXml(`Affiliation: ${c.affiliation}`)}</dc:contributor>`
      )
      .join('');

    const subjectsXml = (article.article?.metadata?.topics || [])
      .map((t) => `<dc:subject>${escapeXml(t)}</dc:subject>`)
      .join('');

    const plainTextAbstract = stripHtml(
      article.article?.metadata?.abstract || ''
    );

    const recordXml = `
      <record>
        <header>
          <identifier>${identifier}</identifier>
          <datestamp>${datestamp}</datestamp>
        </header>
        <metadata>
          <oai_dc:dc>
            <dc:title>${escapeXml(article.article?.metadata?.title)}</dc:title>
            ${creatorsXml}
            ${affiliationsXml}
            <dc:description>${escapeXml(plainTextAbstract)}</dc:description>
            ${subjectsXml}
            <dc:publisher>Journal of African Epidemiology and Public Health</dc:publisher>
            <dc:date>${datestamp}</dc:date>
            <dc:type>Text</dc:type>
            <dc:identifier>${escapeXml(articleUrl)}</dc:identifier>
            ${
              article.doi
                ? `<dc:relation>${escapeXml(article.doi)}</dc:relation>`
                : ''
            }
            <dc:language>en</dc:language>
          </oai_dc:dc>
        </metadata>
      </record>`;

    return `<?xml version="1.0" encoding="UTF-8"?>
              <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/"
                      xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/"
                      xmlns:dc="http://purl.org/dc/elements/1.1/"
                      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                      xsi:schemaLocation="
                        http://www.openarchives.org/OAI/2.0/
                        http://www.openarchives.org/OAI/2.0/OAI-PMH.xsd
                        http://www.openarchives.org/OAI/2.0/oai_dc/
                        http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
              
                <responseDate>${new Date().toISOString()}</responseDate>
              
                <request verb="GetRecord"
                        identifier="${identifier}"
                        metadataPrefix="oai_dc">
                  ${url.pathname}
                </request>
              
                <GetRecord>
                  ${recordXml}
                </GetRecord>
              
              </OAI-PMH>`;
  } catch (err) {
    console.error(err);
    return errorResponse('idDoesNotExist', 'Error fetching record');
  }
}

export function listSetsResponse() {
  return `
    <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
      <responseDate>${oaiDate}</responseDate>
      <request verb="ListSets">/api/oai</request>

      <error code="noSetHierarchy">
        This repository does not support sets.
      </error>
    </OAI-PMH>
  `;
}
