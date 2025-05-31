import * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

type ReviewSubmittedEmailTemplateProps = {
  authorName: string;
  articleTitle: string;
  articleLink: string;
};

const ReviewSubmittedEmailTemplate = ({
  authorName,
  articleTitle,
  articleLink,
}: ReviewSubmittedEmailTemplateProps) => {
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
            Hi {authorName},
          </Text>

          <Text className="text-gray-700 my-4">
            A review has been submitted for your manuscript titled:
          </Text>

          <Text className="italic font-semibold text-gray-900 mb-2">
            &quot;{articleTitle}&quot;
          </Text>

          <Text className="text-gray-700 my-4">
            You can log into your dashboard or use the link below to view the
            review details, annotated files, or respond to the reviewer.
          </Text>

          <a
            href={`${process.env.NEXT_PUBLIC_URL}/articles/${articleLink}`}
            className="inline-block my-4 bg-blue-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-700 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Article Review
          </a>

          <Text className="text-gray-700 mt-6">
            For any questions, contact us at{' '}
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

export default ReviewSubmittedEmailTemplate;
