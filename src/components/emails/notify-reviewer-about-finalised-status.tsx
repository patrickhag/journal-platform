import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const NotifyReviewerAboutFinalizedAssignment: React.FC<{
  articleTitle: string;
  authorName: string;
  isAccepted: boolean;
}> = ({ articleTitle, authorName, isAccepted }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
        {/* Header */}
        <Section className="text-center py-4 border-b bg-gray-100">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        {/* Body */}
        <Section className="px-6 py-4 text-left">
          <Text className="text-lg font-medium text-gray-800">
            Dear Reviewer,
          </Text>

          <Text className="text-gray-700 my-4">
            The editorial process for the manuscript titled{' '}
            <strong>"{articleTitle}"</strong> submitted by{' '}
            <strong>{authorName}</strong> has been finalized. The final decision
            was <strong>{isAccepted ? 'ACCEPTED' : 'REJECTED'}</strong>.
          </Text>

          <Text className="text-gray-700 my-4">
            No further action is required from your side. Thank you for your
            time, effort, and valuable contribution to the review process.
          </Text>

          <Text className="text-gray-700 my-4">
            You can view your past review assignments below:
          </Text>

          <Text className="text-blue-600 underline my-2">
            <a href={`${process.env.NEXT_PUBLIC_URL}/reviewer/assignments`}>
              View Finalized Assignments
            </a>
          </Text>
        </Section>

        {/* Footer */}
        <Section className="bg-gray-100 text-center py-4 text-sm text-gray-600">
          <Text>© 2025 JAEPH. Thank you for supporting peer review.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
