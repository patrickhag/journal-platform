import type * as React from 'react';
import {
  Tailwind,
  Text,
  Container,
  Section,
  Button,
} from '@react-email/components';

export const AssignReviewerEmailTemplate: React.FC<{
  reviewerName: string;
  articleTitle: string;
  reviewAcceptUrl?: string;
  reviewDeclineUrl?: string;
}> = ({ reviewerName, articleTitle, reviewAcceptUrl, reviewDeclineUrl }) => {
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
            Dear {reviewerName},
          </Text>

          <Text className="text-gray-700 my-4">
            You have been invited to review the manuscript titled&nbsp;
            <span className="font-semibold">
              &quot;{articleTitle}&quot;
            </span>{' '}
            submitted to the&nbsp;
            <strong>
              Journal of African Epidemiology and Public Health (JAEPH)
            </strong>
            .
          </Text>

          <Text className="text-gray-700 my-4">
            This assignment was made by the Associate Editor handling the
            peer-review process. Your expert opinion will be invaluable in
            evaluating the quality, relevance, and scientific merit of this
            work.
          </Text>

          <Text className="text-gray-700 my-4">
            You can access the manuscript and submit your review by logging into
            your reviewer dashboard. If you encounter any issues or need further
            guidance, please contact us at{' '}
            <a href="mailto:editorial@jaeph.org">editorial@jaeph.org</a>.
          </Text>

          {/* Action Buttons */}
          <Section className="flex justify-center gap-4 mt-6">
            <Button
              href={reviewAcceptUrl}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
            >
              Accept Invitation
            </Button>
            <Button
              href={reviewDeclineUrl}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium"
            >
              Decline Invitation
            </Button>
          </Section>

          <Text className="text-gray-700 mt-6">
            Thank you for your valuable contribution to JAEPH and the scientific
            community.
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
