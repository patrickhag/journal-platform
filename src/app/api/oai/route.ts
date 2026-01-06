import { NextRequest } from 'next/server';
import {
  getRecordResponse,
  identifyResponse,
  listIdentifiersResponse,
  listMetadataFormats,
  listRecordsResponse,
  listSetsResponse,
} from './verbs';
import { errorResponse } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const verb = searchParams.get('verb');

  let xml = '';

  switch (verb) {
    case 'Identify':
      xml = identifyResponse();
      break;
    case 'ListMetadataFormats':
      xml = listMetadataFormats();
      break;
    case 'ListIdentifiers':
      xml = await listIdentifiersResponse(req);
      break;
    case 'ListRecords':
      xml = await listRecordsResponse(req);
      break;
    case 'GetRecord':
      xml = await getRecordResponse(req);
      break;
    case 'ListSets':
      xml = listSetsResponse();
      break;

    default:
      xml = errorResponse('badVerb', 'Unsupported or missing OAI-PMH verb');
  }

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
