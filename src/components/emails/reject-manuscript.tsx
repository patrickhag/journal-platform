import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const RejectManuscript: React.FC<{
  article: string;
  names: string;
}> = ({ article, names }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>
        <Section className="px-6 py-4">
          <Text className="text-lg font-medium text-gray-800">Hi, {names}</Text>
          <Text className="text-gray-700 my-4">
            You are receiving this email because your manuscript titled{' '}
            <span className="font-semibold">&quot;{article}&quot;</span> it was
            rejected maybe due to some factors below out of scope, poor
            formatting, plagiarism, lack of novelty, or weak writing quality.
          </Text>
          <Text className="text-gray-700 my-4">
            We appreciate your contribution and hope to see your manuscript in
            the future.
          </Text>
          <Text className="text-gray-700 my-4">
            If you have any questions, please contact us at{' '}
            <a href="mailto:info@jaeph.org">info@jaeph.org</a>.
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
