import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const AssociateEditorStatusEmail: React.FC<{
  associateEditorName: string;
  articleTitle: string;
  articleId: string;
  status: 'APPROVED' | 'RE_CORRECTION_REQUESTED';
  message?: string;
}> = ({ associateEditorName, articleTitle, articleId, status, message }) => {
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
            Dear {associateEditorName},
          </Text>

          {status === 'APPROVED' ? (
            <Text className="text-gray-700 my-4">
              The corrections/review you submitted for the article titled{' '}
              <a
                href={`${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                “{articleTitle}”
              </a>{' '}
              have been approved by the staff editor. No further action is
              required.
            </Text>
          ) : (
            <Text className="text-gray-700 my-4">
              The corrections/review you submitted for the article titled{' '}
              <a
                href={`${process.env.NEXT_PUBLIC_URL}/articles/${articleId}`}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                “{articleTitle}”
              </a>{' '}
              require additional changes. Please review the staff editor’s
              comments below and resubmit accordingly.
            </Text>
          )}

          {message && (
            <Section className="bg-gray-50 border border-gray-200 p-4 rounded-md my-4">
              <Text className="text-gray-800 whitespace-pre-wrap">
                {message}
              </Text>
            </Section>
          )}

          <Text className="text-gray-700 mt-6">
            Thank you for your valuable contribution to JAEPH.
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
