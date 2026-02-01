import type * as React from 'react';
import { Tailwind, Container, Section, Text } from '@react-email/components';

export const ReviewerSubmittedEmail: React.FC<{
  participantName: string;
  articleTitle: string;
  userType: string;
}> = ({ participantName, articleTitle, userType }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 max-w-xl mx-auto my-8 p-6 text-left">
        {/* Header */}
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        {/* Content */}
        <Section className="px-6 py-4">
          <Text className="text-base text-gray-800 mb-4">
            Dear {participantName},
          </Text>

          <Text className="text-gray-700 mb-4">
            {userType === 'reviewer'
              ? 'A reviewer has submitted their review for your manuscript titled:'
              : 'An author has submitted their revised manuscript'}
            <br />
            <em>“{articleTitle}”</em>.
          </Text>

          <Text className="text-gray-700 mb-4">
            Check your dashboard to see those{' '}
            {userType === 'reviewer' ? 'reviews' : 'revisions'}
          </Text>

          <Text className="text-gray-700 mt-6">
            Thank you for your contribution to JAEPH platform.
          </Text>
        </Section>

        {/* Footer */}
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>
            © {new Date().getFullYear()} JAEP Health Sciences. All rights
            reserved.
          </Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
