import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const RemindEditor: React.FC<{
  editorName: string;
  articleTitle: string;
  dueDate?: string;
}> = ({ editorName, articleTitle, dueDate }) => {
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
            This is a kind reminder regarding your assignment to format the
            manuscript titled{' '}
            <span className="font-semibold">"{articleTitle}"</span>. We highly
            value your expertise and your contribution to maintaining the
            quality of JAEPH publications.
          </Text>

          {dueDate && (
            <Text className="text-gray-700 my-4">
              <strong>Remember:</strong> The deadline for this assignment is on{' '}
              {dueDate}.
            </Text>
          )}

          <Text className="text-gray-700 my-4">
            We kindly ask you to log in to your associate editor dashboard on
            the platform to complete your assignment at your earliest
            convenience. If you are unable to complete it, please let us know so
            we can make alternative arrangements.
          </Text>

          <Text className="text-gray-700 mt-4">
            Thank you again for your valuable time and commitment to supporting
            the integrity of JAEPH.
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
