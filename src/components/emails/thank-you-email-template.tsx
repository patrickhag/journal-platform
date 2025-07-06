import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const ThankAuthorEmailTemplate: React.FC<{
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
          <Text className="text-lg font-medium text-gray-800">
            Dear {names},
          </Text>
          <Text className="text-gray-700 my-4">
            Thank you for submitting your manuscript titled{' '}
            <span className="font-semibold">&quot;{article}&quot;</span> to the{' '}
            <strong>
              Journal of African Epidemiology and Public Health (JAEPH)
            </strong>
            .
          </Text>
          <Text className="text-gray-700 my-4">
            We acknowledge receipt of your article and appreciate your interest
            in contributing to our journal. Our editorial team will now begin
            the initial screening process before sending it for peer review. You
            will be notified as soon as there are updates regarding the progress
            of your submission.
          </Text>
          <Text className="text-gray-700 my-4">
            If you have any questions or would like to get in touch, please feel
            free to reach us at{' '}
            <a href="mailto:info@jaeph.org">info@jaeph.org</a>.
          </Text>
        </Section>
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
