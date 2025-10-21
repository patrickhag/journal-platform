import type * as React from 'react';
import {
  Tailwind,
  Text,
  Container,
  Section,
  Row,
  Column,
  Button,
} from '@react-email/components';

export const SendInvitation: React.FC<{
  reviewerName: string;
  articleTitle: string;
  abstract: string;
  isAlreadyUser: boolean;
  dueDate?: string;
  articleId: string;
  password: string;
}> = ({
  reviewerName,
  articleTitle,
  abstract,
  isAlreadyUser,
  dueDate,
  articleId,
  password,
}) => {
  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 max-w-xl mx-auto my-8 p-6 text-center">
        {/* Header */}
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>

        {/* Content */}
        <Section className="px-6 py-4 text-left">
          <Text className="text-lg font-medium text-gray-800">
            Dear {reviewerName},
          </Text>

          <Text className="text-gray-700 my-4">
            You are receiving this invitation due to your expertise in the
            field. The editorial team of JAEPH would be honored to have your
            review for the manuscript titled{' '}
            <span className="font-semibold">“{articleTitle}”</span>.
          </Text>

          {/* Abstract Block */}
          <Text className="text-gray-700 my-4">
            <span className="font-semibold">Abstract:</span>{' '}
            <div
              className="prose max-w-none text-sm italic"
              dangerouslySetInnerHTML={{
                __html: abstract,
              }}
            />
          </Text>

          {isAlreadyUser ? (
            <Text className="text-gray-700 my-4">
              Since you already have an account with us, you can log in to your
              reviewer dashboard and begin the review process directly.
            </Text>
          ) : (
            <>
              <Text className="text-gray-700 my-4">
                We’ve created a reviewer account for you. Please follow the
                invitation link below to log in.
              </Text>
              <Text className="text-gray-700 my-4">
                <strong>Temporary password:</strong>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {password}
                </code>
              </Text>
              <Text className="text-gray-700 my-2">
                You can update your password after logging in.
              </Text>
            </>
          )}

          {dueDate && (
            <Text className="text-gray-700 my-4">
              <strong>Note:</strong> The deadline to submit your review is{' '}
              {dueDate}.
            </Text>
          )}

          <Text className="text-gray-700 my-4">
            Kindly respond to this invitation by accepting or declining, so we
            can either proceed with your review or assign another reviewer if
            necessary.
          </Text>

          {/* Buttons */}
          <Row className="my-5">
            <Column align="center">
              <Row>
                <td align="center" className="w-1/2 pr-[8px]">
                  <Button
                    className="box-border w-full rounded-md border border-gray-300 bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
                    href={`${process.env.NEXT_PUBLIC_URL}/reviewer-accept-invitation/${articleId}`}
                  >
                    Accept Invitation
                  </Button>
                </td>
                <td align="center" className="w-1/2 pl-[8px]">
                  <Button
                    className="box-border w-full rounded-md border border-gray-300 bg-white text-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition"
                    href={`${process.env.NEXT_PUBLIC_URL}/invitation/${articleId}?accept_invite=0`}
                  >
                    Decline Invitation
                  </Button>
                </td>
              </Row>
            </Column>
          </Row>

          <Text className="text-gray-700 mt-4">
            Thank you for considering this request. Your support contributes
            greatly to the quality and integrity of JAEPH.
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
