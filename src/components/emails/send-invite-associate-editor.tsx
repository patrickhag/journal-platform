import type * as React from 'react';
import {
  Tailwind,
  Text,
  Container,
  Section,
  Row,
  Column,
  Button,
} from '@react-email/components';

export const SendAssociateEditorInvitation: React.FC<{
  editorName: string;
  articleTitle: string;
  dueDate?: string;
  articleId: string;
}> = ({ editorName, articleTitle, dueDate, articleId }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 max-w-xl mx-auto my-8 p-6 text-center">
        {/* Header */}
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        {/* Content */}
        <Section className="px-6 py-4 text-left">
          <Text className="text-lg font-medium text-gray-800">
            Dear {editorName},
          </Text>

          <Text className="text-gray-700 my-4">
            You are receiving this email because we're proposing to come and
            edit the manuscript that's titled{' '}
            <span className="font-semibold">“{articleTitle}”</span>.
          </Text>

          {dueDate && (
            <Text className="text-gray-700 my-4">
              <strong>Note:</strong> The suggested due date to begin handling
              this manuscript is {dueDate}.
            </Text>
          )}

          <Text className="text-gray-700 my-4">
            Kindly respond to this invitation by accepting or declining, so we
            can proceed with the editorial workflow accordingly.
          </Text>

          {/* Buttons */}
          <Row className="my-5">
            <Column align="center">
              <Row>
                <td align="center" className="w-1/2 pr-[8px]">
                  <Button
                    className="box-border w-full rounded-md border border-gray-300 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
                    href={`${process.env.NEXT_PUBLIC_URL}/associate-editor/invitation?articleId=${articleId}&accept_invite=1`}
                  >
                    Accept Invitation
                  </Button>
                </td>
                <td align="center" className="w-1/2 pl-[8px]">
                  <Button
                    className="box-border w-full rounded-md border border-gray-300 bg-white text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
                    href={`${process.env.NEXT_PUBLIC_URL}/associate-editor/invitation?articleId=${articleId}&accept_invite=0`}
                  >
                    Decline Invitation
                  </Button>
                </td>
              </Row>
            </Column>
          </Row>

          <Text className="text-gray-700 mt-4">
            Thank you for considering this request. Your contribution as an
            associate editor plays a vital role in ensuring the quality and
            integrity of JAEPH.
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
