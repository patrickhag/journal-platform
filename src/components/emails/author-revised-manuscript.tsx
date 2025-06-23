import type * as React from 'react';
import { Tailwind, Text, Container, Section } from '@react-email/components';

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
    <Container>
      <Section>
        <Text>Dear {editorName},</Text>

        <Text>
          This is to inform you that the author <strong>{authorName}</strong>{' '}
          has submitted a revised version of the manuscript titled &quot;
          <em>{articleTitle}</em>&quot;.
        </Text>

        <Text>
          The author has addressed the review comments and made the necessary
          changes as requested. The revised manuscript is now ready for your
          re-evaluation and further review for potential acceptance.
        </Text>

        <Text>
          You can view the revised manuscript and the author&quot;s response to
          the reviewers by clicking the link below:
        </Text>

        <a
          href={`${process.env.NEXT_PUBLIC_URL}/editor/articles/${articleLink}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Revised Manuscript
        </a>

        <Text className="mt-6">
          Please proceed with your assessment and let us know your decision in
          due course.
        </Text>

        <Text>Thank you for your continued contribution to the journal.</Text>
      </Section>
    </Container>
  </Tailwind>
);
