import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const StaffEditorEmailTemplate: React.FC<{
  editorName: string;
  articleTitle: string;
  authorName: string;
}> = ({ editorName, articleTitle, authorName }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        <Section className="px-6 py-4">
          <Text className="text-lg font-medium text-gray-800">
            Dear {editorName},
          </Text>

          <Text className="text-gray-700 my-4">
            We are pleased to inform you that you have been assigned as the
            handling editor for the manuscript titled&nbsp;
            <span className="font-semibold">
              &quot;{articleTitle}&quot;
            </span>{' '}
            submitted by <strong>{authorName}</strong> to the&nbsp;
            <strong>
              Journal of African Epidemiology and Public Health (JAEPH)
            </strong>
            .
          </Text>

          <Text className="text-gray-700 my-4">
            Your role will be to oversee the editorial workflow for this
            manuscript, including coordinating the peer review process and
            making a recommendation based on reviewers’ feedback.
          </Text>

          <Text className="text-gray-700 my-4">
            You can access the submission and take necessary editorial actions
            by follwoing with this{' '}
            <a href={`${process.env.NEXT_PUBLIC_URL}/staff-editor/assigned`}>
              link
            </a>
            . If you have any questions or need assistance, feel free to reach
            out to us at{' '}
            <a href="mailto:editorial@jaeph.org">editorial@jaeph.org</a>.
          </Text>

          <Text className="text-gray-700 mt-6">
            We appreciate your continued contribution to JAEPH.
          </Text>
        </Section>

        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
