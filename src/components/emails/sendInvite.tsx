import { Button, Tailwind } from '@react-email/components';
import type * as React from 'react';
import { Section, Text, Container, Row, Column } from '@react-email/components';

export const SendInvitation: React.FC<{
  reviewer: string;
  article: {
    article: string;
    title: string;
    subTitle: string;
    content: string;
  };
  reviewerEmail: string;
  isAlreadyUser: boolean;
  editorInChiefId: string;
}> = (props) => {
  const { article, reviewer, isAlreadyUser, editorInChiefId } = props;
  const nameParts = reviewer.split(' ');
  const password = nameParts.length > 2 ? nameParts[1] : nameParts[0];

  return (
    <Tailwind>
      <Container className="bg-white border border-gray-200 max-w-xl mx-auto my-8 p-6 text-center">
        <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
          <Text className="text-xl font-semibold text-gray-800">
            Journal of African Epidemiology and Public Health
          </Text>
        </Section>
        <Section className="px-6 py-4">
          <Text className="text-lg font-medium text-gray-800">
            Hi, <span className="font-semibold">{reviewer}</span>
          </Text>
          <Text className="text-gray-700 my-4">
            You have received this email because JAEPH editors are proposing you
            to review the manuscript titled{' '}
            <span className="font-semibold">“{article.title}”</span>.
          </Text>
          <Text className="text-gray-700 my-4">
            Editor-in-chief has left a message{' '}
            <span className="font-semibold">&quot;{article.content}&quot;</span>{' '}
            and you might want to visit the manuscript page to accept or reject
            the invitation.
          </Text>
          <Text className="text-gray-700 my-4">
            If you&apos;re ready to review the manuscript you can use your email{' '}
            {isAlreadyUser ? (
              <span>and password to login.</span>
            ) : (
              <span>
                and <span className="font-semibold">{`@123${password}`}</span>{' '}
                as your password.
              </span>
            )}
          </Text>
          <Row>
            <Column align="center">
              <Row>
                <td align="center" className="w-1/2 pr-[16px]" colSpan={1}>
                  <Button
                    className="box-border w-full rounded-[8px] bg-indigo-600 px-[20px] py-[12px] text-center font-semibold text-white"
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/invitation/${article.article}?accept_invite=1?editor=${editorInChiefId}`}
                  >
                    Accept invitation
                  </Button>
                </td>
                <td align="center" className="w-1/2 pl-[16px]" colSpan={1}>
                  <Button
                    className="box-border w-full rounded-[8px] border border-solid border-gray-200 bg-red-500 px-[20px] py-[12px] text-center font-semibold text-white"
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/invitation/${article.article}?accept_invite=0?editor=${editorInChiefId}`}
                  >
                    Reject invitation
                  </Button>
                </td>
              </Row>
            </Column>
          </Row>
        </Section>
        <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
          <Text>© 2025 JAEPH. All rights reserved.</Text>
        </Section>
      </Container>
    </Tailwind>
  );
};
