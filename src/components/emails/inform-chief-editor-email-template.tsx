import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const ArticleReadyForEICApprovalEmailTemplate = ({
  editorInChiefName,
  associateEditorName,
  authorName,
  articleTitle,
  articleLink,
}: {
  editorInChiefName: string;
  associateEditorName: string;
  authorName: string;
  articleTitle: string;
  articleLink: string;
}) => (
  <Tailwind>
    <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6">
      {/* Header */}
      <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
        <Text className="text-xl font-semibold text-gray-800">
          Journal of African Epidemiology and Public Health
        </Text>
      </Section>

      {/* Main Content */}
      <Section className="px-6 py-4">
        <Text className="text-lg font-medium text-gray-800">
          Dear {editorInChiefName},
        </Text>
        <Text className="text-gray-700 my-4">
          The manuscript titled <em>&quot;{articleTitle}&quot;</em> submitted by{' '}
          <strong>{authorName}</strong> has been reviewed and accepted by
          Associate Editor <strong>{associateEditorName}</strong>.
        </Text>
        <Text className="text-gray-700 my-4">
          It is now awaiting your final approval as Editor-in-Chief.
        </Text>
        <Text className="text-gray-700 mt-6">
          Thank you for your leadership and time.
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
