import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const NotifyStaffEditorAboutReviewerAcceptance: React.FC<{
  articleTitle: string;
  authorName: string;
  articleId: string;
  isAccepted: boolean;
}> = ({ articleTitle, authorName, articleId, isAccepted }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        <Section className="px-6 py-4 text-left">
          <Text className="text-lg font-medium text-gray-800">
            Hello Staff Editor,
          </Text>

          <Text className="text-gray-700 my-4">
            The reviewer has {isAccepted ? 'accepted' : 'declined'} the
            manuscript titled&nbsp;
            <strong>"{articleTitle}"</strong> submitted by{' '}
            <strong>{authorName}</strong>.
          </Text>

          <Text className="text-gray-700 my-4">
            You can view the submission and update the review assignment using
            the link below:
          </Text>

          <Text className="text-blue-600 underline my-2">
            <a
              href={`${process.env.NEXT_PUBLIC_URL}/articles/reviews/${articleId}`}
            >
              View Decision
            </a>
          </Text>
        </Section>

        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
