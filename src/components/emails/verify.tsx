import type * as React from 'react';
import {
  Tailwind,
  Text,
  Button,
  Container,
  Section,
} from '@react-email/components';

export const SendVerifyEmail: React.FC<{
  link: string;
  name?: string;
}> = ({ link, name }) => {
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
            {name ? (
              <>
                Hi, <span className="font-semibold">{name}</span>
              </>
            ) : (
              'Hello,'
            )}
          </Text>
          <Text className="text-gray-700 my-4">
            Thank you for registering with the Journal of African Epidemiology
            and Public Health. To complete your registration and activate your
            account, please verify your email address by clicking the button
            below.
          </Text>
          <Button
            href={link}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md font-semibold my-4"
          >
            Verify Email Address
          </Button>
          <Text className="text-gray-700 mt-6 text-sm">
            If you did not create an account with us, please ignore this email.
            This verification link will expire in 2 days.
          </Text>
          <Text className="text-gray-700 my-4">
            If you have any questions, please contact us at{' '}
            <a
              href="mailto:info@jaeph.org"
              className="text-indigo-600 hover:underline"
            >
              info@jaeph.org
            </a>
            .
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
