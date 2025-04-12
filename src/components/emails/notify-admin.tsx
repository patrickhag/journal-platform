import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { Link } from '@react-email/components';

interface NotifyAdminEmailProps {
  article: string;
  authorName: string;
  articleId: string;
  participant: 'REVIEWER' | 'AUTHOR';
  title: string;
}

export const NotifyAdminEmail = ({
  article,
  authorName,
  articleId,
  participant,
  title,
}: NotifyAdminEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New Article Submission</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>
            {participant === 'REVIEWER'
              ? 'A new review has been submitted for article to the journal platform.'
              : 'A new article has been submitted to the journal platform.'}
          </Text>
          <Section style={section}>
            <Text style={text}>
              <strong>Article Title:</strong>{' '}
              <Link
                href={`${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`}
              >
                {article}
              </Link>
            </Text>
            <Text style={text}>
              <strong>
                {participant === 'REVIEWER' ? 'Reviewer' : 'Author'}:
              </strong>{' '}
              {authorName}
            </Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>JAEP Admin Notification</Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const section = {
  padding: '24px',
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
