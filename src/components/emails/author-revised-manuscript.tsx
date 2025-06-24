import type * as React from 'react';
import {
  Tailwind,
  Text,
  Container,
  Section,
  Button,
} from '@react-email/components';

export const AuthorRevisedManuscriptEmailTemplate = ({
  editorName,
  authorName,
  articleTitle,
  articleLink,
}: {
  editorName: string;
  authorName: string;
  articleTitle: string;
  articleLink: string;
}) => (
  <Tailwind>
    <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6">
      {/* Header */}
      <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
        <Text className="text-xl font-semibold text-gray-800">
          Journal of African Epidemiology and Public Health
        </Text>
      </Section>

      {/* Main Content */}
      <Section className="px-6 py-4">
        <Text className="text-lg font-medium text-gray-800">
          Hi {editorName},
        </Text>
        <Text className="text-gray-700 my-4">
          <strong>{authorName}</strong> has submitted a revised manuscript:
          &quot;<em>{articleTitle}</em>&quot;
        </Text>
        <Text className="text-gray-700 my-4">
          The author has addressed all review comments. The manuscript is ready
          for re-evaluation.
        </Text>
        <Button
          href={`${process.env.NEXT_PUBLIC_URL}/editor/articles/${articleLink}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium my-4"
        >
          View Revised Manuscript
        </Button>
        <Text className="text-gray-700 mt-6">Thank you for your time.</Text>
      </Section>

      {/* Footer */}
      <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
        <Text>© 2025 JAEPH. All rights reserved.</Text>
      </Section>
    </Container>
  </Tailwind>
);

export const ReviewerReReviewEmailTemplate = ({
  reviewerName,
  authorName,
  articleTitle,
  articleLink,
}: {
  reviewerName: string;
  authorName: string;
  articleTitle: string;
  articleLink: string;
}) => (
  <Tailwind>
    <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6">
      {/* Header */}
      <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
        <Text className="text-xl font-semibold text-gray-800">
          Journal of African Epidemiology and Public Health
        </Text>
      </Section>

      {/* Main Content */}
      <Section className="px-6 py-4">
        <Text className="text-lg font-medium text-gray-800">
          Hi {reviewerName},
        </Text>
        <Text className="text-gray-700 my-4">
          <strong>{authorName}</strong> has submitted a revised manuscript:
          &quot;<em>{articleTitle}</em>&quot;
        </Text>
        <Text className="text-gray-700 my-4">
          The author has addressed your previous review comments. We would
          appreciate your re-review of this revised manuscript.
        </Text>
        <Button
          href={`${process.env.NEXT_PUBLIC_URL}/reviewer/articles/${articleLink}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium my-4"
        >
          Re-Review Manuscript
        </Button>
        <Text className="text-gray-700 mt-6">
          Thank you for your continued support.
        </Text>
      </Section>

      {/* Footer */}
      <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
        <Text>© 2025 JAEPH. All rights reserved.</Text>
      </Section>
    </Container>
  </Tailwind>
);
