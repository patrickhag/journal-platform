import {
  Button,
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Link,
  Hr,
} from '@react-email/components';
import type * as React from 'react';

export const NotifiyContributor: React.FC<{
  originalAuthor: string;
  contributor: string;
  article: string;
  rejectUrl?: string;
}> = ({ contributor, article, originalAuthor, rejectUrl }) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>You have been added as a contributor</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={title}>Contribution Notice</Text>

          <Text style={greeting}>Hi {contributor},</Text>

          <Text style={paragraph}>
            You have been added as a contributor to &quot;{article}&quot; by{' '}
            {originalAuthor}. We&apos;re excited to have you as part of this
            collaboration.
          </Text>

          <Button href={rejectUrl} style={button}>
            Reject contribution
          </Button>

          <Text style={paragraph}>
            Need help, or have questions? Just reply to this email, we&apos;d
            love to help.
          </Text>

          <Text style={paragraph}>
            Cheers,
            <br />
            The Team
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you&apos;re having trouble clicking the button, copy and paste
            this URL into your web browser:{' '}
            <Link href={rejectUrl} style={link}>
              {rejectUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const title = {
  fontSize: '24px',
  fontWeight: '600',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const greeting = {
  margin: '0 0 24px',
  fontSize: '18px',
  fontWeight: '500',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#50b7b2',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const link = {
  color: '#556cd6',
  textDecoration: 'underline',
};
