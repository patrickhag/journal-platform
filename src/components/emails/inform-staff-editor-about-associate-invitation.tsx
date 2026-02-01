import type * as React from 'react';
import { Tailwind, Container, Section, Text } from '@react-email/components';

export const InformStaffEditorAboutAssociateInvitation: React.FC<{
  staffEditorName: string;
  associateEditorName: string;
  articleTitle: string;
  status: 'accepted' | 'rejected';
}> = ({ staffEditorName, associateEditorName, articleTitle, status }) => {
  const decisionText =
    status === 'accepted'
      ? 'has accepted the edit invitation'
      : 'has declined the edit invitation';

  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 max-w-xl mx-auto my-8 p-6 text-left">
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        <Section className="px-6 py-4">
          <Text className="text-gray-800 text-base mb-4">
            Dear {staffEditorName},
          </Text>

          <Text className="text-gray-700 mb-4">
            This is to inform you that <strong>{associateEditorName}</strong>{' '}
            {decisionText} for the manuscript titled:
            <br />
            <em>“{articleTitle}”</em>.
          </Text>

          <Text className="text-gray-700 mb-2">
            You can proceed accordingly within the editorial dashboard.
          </Text>

          <Text className="text-gray-700 mt-6">
            Thank you,
            <br />
            JAEPH Editorial System
          </Text>
        </Section>

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
