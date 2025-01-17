import type * as React from 'react';
import {
  Tailwind,
  Text,
  Button,
  Container,
  Section,
} from '@react-email/components';

export const EmailPasswordReset: React.FC<{ url: string; name: string }> = (
  props
) => {
  const { url, name } = props;

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
            Hi, <span className="font-semibold">{name}</span>
          </Text>
          <Text className="text-gray-700 my-4">
            You have received this email because a password reset request for
            your account was received.
          </Text>
          <Text className="text-gray-700 my-4">
            Click below to reset your password.
          </Text>
          <Button
            href={url}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium my-4"
          >
            Reset your password
          </Button>
          <Text className="text-gray-700 mt-6 text-sm">
            If you did not require a password, no further action is required on
            your part.
          </Text>
        </Section>
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
