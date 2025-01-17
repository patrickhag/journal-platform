import type * as React from 'react';
import {
  Tailwind,
  Text,
  Button,
  Container,
  Section,
} from '@react-email/components';

export const NotifiyContributor: React.FC<{
  originalAuthor: string;
  contributor: string;
  article: string;
}> = ({ contributor, article, originalAuthor }) => {
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
            Hi, {contributor}
          </Text>
          <Text className="text-gray-700 my-4">
            You are receiving this email because you contributed to the
            manuscript titled{' '}
            <span className="font-semibold">&quot;{article}&quot;</span>, which
            was written by{' '}
            <span className="font-semibold">{originalAuthor}</span>.
          </Text>
          <Text className="text-gray-700 my-4">
            Wanna submit your own manuscript on our platform?
          </Text>
          <Button
            href={process.env.NEXT_PUBLIC_URL}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-md font-medium my-4 cursor-pointer"
          >
            Join here
          </Button>
        </Section>
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
