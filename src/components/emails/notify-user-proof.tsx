import * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

type ArticleNotificationEmailProps = {
  authorName: string;
  articleTitle: string;
  articleLink: string;
  type: 'proof' | 'published';
};

const ArticleNotificationEmail = ({
  authorName,
  articleTitle,
  articleLink,
  type,
}: ArticleNotificationEmailProps) => {
  const isProof = type === 'proof';
  const actionText = isProof ? 'Review Proof' : 'View Published Article';

  const message = isProof
    ? `The proof for your manuscript titled:`
    : `We’re excited to inform you that your manuscript has been published in our latest issue:`;

  const footerNote = isProof
    ? `If you find any errors or changes you'd like to make, you can update the attached file and resend it through your dashboard.`
    : `Thank you for choosing JAEPH. Your contribution is now live and accessible to readers worldwide.`;

  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
        {/* Header */}
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        {/* Body */}
        <Section className="px-6 py-4">
          <Text className="text-lg font-medium text-gray-800">
            Hello {authorName},
          </Text>

          <Text className="text-gray-700 my-4">{message}</Text>

          <Text className="italic font-semibold text-gray-900 mb-2">
            &quot;{articleTitle}&quot;
          </Text>

          <Text className="text-gray-700 my-4">{footerNote}</Text>

          <a
            href={articleLink}
            className={`inline-block my-4 ${
              isProof
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-semibold px-5 py-2 rounded-md transition`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {actionText}
          </a>

          <Text className="text-gray-700 mt-6">
            For any questions or support, contact us at{' '}
            <a href="mailto:info@jaeph.org" className="text-blue-600 underline">
              info@jaeph.org
            </a>
            .
          </Text>
        </Section>

        {/* Footer */}
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};

export default ArticleNotificationEmail;
