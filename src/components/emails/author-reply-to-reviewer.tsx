import * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const AuthorReplyToReviewerEmail: React.FC<{
  reviewerName: string;
  authorName: string;
  articleTitle: string;
  articleLink: string;
  message?: string;
}> = ({ reviewerName, authorName, articleTitle, articleLink, message }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 max-w-xl mx-auto my-8 p-6 text-left">
        {/* Header */}
        <Section className="text-center py-4 border-b bg-gray-100">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        {/* Body */}
        <Section className="px-6 py-4">
          <Text className="text-lg font-medium text-gray-800">
            Dear {reviewerName},
          </Text>

          <Text className="text-gray-700 my-4">
            The author <strong>{authorName}</strong> has submitted a reply to
            your review for the manuscript titled{' '}
            <a
              href={`${process.env.NEXT_PUBLIC_URL}/articles/${articleLink}`}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              "{articleTitle}"
            </a>
            .
          </Text>

          {message && (
            <>
              <Text className="text-gray-700 my-4">
                Here's the author's message:
              </Text>
              <Section className="bg-gray-50 border border-gray-200 p-4 rounded-md my-4">
                <Text className="text-gray-800 whitespace-pre-wrap">
                  {message}
                </Text>
              </Section>
            </>
          )}

          <Text className="text-gray-700 mt-6">
            You can view the author's response and revised files in your
            assignment page. Please review the author's corrections and provide
            any additional feedback if needed.
          </Text>

          <Text className="text-gray-700 mt-6">
            Thank you for your continued contribution to the peer review process
            at JAEPH.
          </Text>
        </Section>

        {/* Footer */}
        <Section className="bg-gray-100 text-center py-4 text-sm text-gray-600 font-medium">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
