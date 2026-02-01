import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

interface InformChiefEditorAboutOngoingPublicationProps {
  articleTitle: string;
  authorNames: string;
  issueNumber: string | number;
  volumeYear: string | number;
}

export const InformChiefEditorAboutOngoingPublication: React.FC<
  InformChiefEditorAboutOngoingPublicationProps
> = ({ articleTitle, authorNames, issueNumber, volumeYear }) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6">
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>
        <Section className="px-6 py-6 text-left">
          <Text className="text-lg font-semibold mb-2 text-gray-700">
            Action Required: Ongoing Publication Awaits Your Acceptance
          </Text>
          <Text className="mb-3 text-gray-700">Dear Chief Editor,</Text>
          <Text className="mb-3 text-gray-700">
            There is an ongoing publication that requires your review and
            acceptance before proceeding to the final publication stage.
          </Text>
          <Text className="mb-2">
            <span className="font-semibold">Article Title:</span> {articleTitle}
          </Text>
          <Text className="mb-2">
            <span className="font-semibold">Authors:</span> {authorNames}
          </Text>
          <Text className="mb-2">
            <span className="font-semibold">Issue:</span> {issueNumber}{' '}
            &nbsp;&nbsp;
            <span className="font-semibold">Volume:</span> {volumeYear}
          </Text>
          <Text className="mt-4 mb-2 text-gray-700">
            Please log in to the admin dashboard to review and accept this
            publication.
          </Text>
          <Text>Thank you for your attention.</Text>
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
