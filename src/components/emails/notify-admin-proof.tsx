import * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

type ProofSubmittedAdminEmailProps = {
  authorName: string;
  articleTitle: string;
};

const ProofSubmittedAdminEmailTemplate = ({
  authorName,
  articleTitle,
}: ProofSubmittedAdminEmailProps) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
        {/* Header */}
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        {/* Body */}
        <Section className="px-6 py-4">
          <Text className="text-lg font-medium text-gray-800">
            Hello editor,
          </Text>

          <Text className="text-gray-700 my-4">
            The author <span className="font-semibold">{authorName}</span> has
            uploaded a proofed file for their manuscript titled:
          </Text>

          <Text className="italic font-semibold text-gray-900 mb-2">
            &quot;{articleTitle}&quot;
          </Text>

          <Text className="text-gray-700 my-4">
            You can review the updated proof document on the link below.
          </Text>

          <a
            href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/editor/proof`}
            className="inline-block my-4 bg-blue-600 text-white font-semibold px-5 py-2 rounded-md hover:bg-blue-700 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Review Updated Proof
          </a>

          <Text className="text-gray-700 mt-6">
            For any questions or additional actions, please check the editorial
            dashboard.
          </Text>
        </Section>

        {/* Footer */}
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};

export default ProofSubmittedAdminEmailTemplate;
