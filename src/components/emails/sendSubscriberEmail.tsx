import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

export const SubscriberEmail: React.FC<{ email: string }> = (props) => {
  const { email } = props;

  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>
        <Section className="px-6 py-4">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: email,
            }}
          />
        </Section>
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
