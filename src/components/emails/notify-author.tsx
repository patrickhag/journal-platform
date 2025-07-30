import * as React from 'react';
import {
  Tailwind,
  Text,
  Button,
  Container,
  Section,
} from '@react-email/components';

export const ArticleAcceptedEmailTemplate = ({
  authorName,
  articleTitle,
  fileIds,
}: {
  authorName: string;
  articleTitle: string;
  fileIds?: string;
}) => (
  <Tailwind>
    <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
      <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
        <Text className="text-xl font-semibold text-gray-800">
          Journal of African Epidemiology and Public Health
        </Text>
      </Section>

      <Section className="px-6 py-4">
        <Text className="text-lg font-medium text-gray-800">
          Dear <span className="font-semibold">{authorName}</span>,
        </Text>

        <Text className="text-gray-700 my-4">
          We are pleased to inform you that your article titled &quot;
          {articleTitle}&quot; has been accepted and has now entered the
          proofreading stage of the publication process.
        </Text>

        <Text className="text-gray-700 my-4">
          At this stage, we kindly ask you to review the annotated file provided
          by the editor. This is your final opportunity to check for any
          typographical, grammatical, or formatting errors before the article is
          formally published.
        </Text>

        {fileIds && (
          <>
            <Text className="text-gray-700 my-4">
              You can download the annotated proof using the button below:
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_URL}/files/${fileIds}`}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium my-4"
            >
              Download Proof File
            </Button>
          </>
        )}

        <Text className="text-gray-700 mt-6">
          If you notice any issues that need to be corrected, please let us know
          as soon as possible.
        </Text>

        <Text className="text-gray-700 mt-6">
          Thank you for your valuable contribution to our journal.
        </Text>
      </Section>

      <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
        <Text>© 2025 JAEPH. All rights reserved.</Text>
      </Section>
    </Container>
  </Tailwind>
);

export const ArticleRevisionEmailTemplate = ({
  authorName,
  articleTitle,
  articleLink,
  fileIds,
}: {
  authorName: string;
  articleTitle: string;
  articleLink: string;
  fileIds?: string;
}) => (
  <Tailwind>
    <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
      <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
        <Text className="text-xl font-semibold text-gray-800">
          Journal of African Epidemiology and Public Health
        </Text>
      </Section>
      <Section className="px-6 py-4">
        <Text className="text-lg font-medium text-gray-800">
          Dear <span className="font-semibold">{authorName}</span>,
        </Text>
        <Text className="text-gray-700 my-4">
          The review process for your article titled &quot;{articleTitle}&quot;
          is complete. The editor has requested revisions before a final
          decision can be made.
        </Text>
        <Text className="text-gray-700 my-4">
          Please review the feedback and make the necessary changes by clicking
          the button below:
        </Text>
        <Button
          href={`${process.env.NEXT_PUBLIC_URL}/submissions`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium my-4"
        >
          View Review Details
        </Button>
        {fileIds && (
          <>
            <Text className="text-gray-700 my-4">
              Additionally, an annotated file has been provided by the editor
              for your reference. You can download it here:
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_URL}/files/${fileIds}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium my-4"
            >
              Download Review File
            </Button>
          </>
        )}
        <Text className="text-gray-700 mt-6">
          We look forward to receiving your revised submission.
        </Text>
      </Section>
      <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
        <Text>© 2025 JAEPH. All rights reserved.</Text>
      </Section>
    </Container>
  </Tailwind>
);

export const ArticleRejectedEmailTemplate = ({
  authorName,
  articleTitle,
  fileIds,
}: {
  authorName: string;
  articleTitle: string;
  fileIds?: string;
}) => (
  <Tailwind>
    <Container className="bg-white border border-gray-200 rounded-lg max-w-xl mx-auto my-8 p-6 text-center">
      <Section className="text-center py-4 border-b bg-gray-100 font-semibold text-gray-600">
        <Text className="text-xl font-semibold text-gray-800">
          Journal of African Epidemiology and Public Health
        </Text>
      </Section>
      <Section className="px-6 py-4">
        <Text className="text-lg font-medium text-gray-800">
          Dear <span className="font-semibold">{authorName}</span>,
        </Text>
        <Text className="text-gray-700 my-4">
          We regret to inform you that your article titled &quot;{articleTitle}
          &quot; has been rejected after careful evaluation by our editorial
          team.
        </Text>
        {fileIds && (
          <>
            <Text className="text-gray-700 my-4">
              The editor has provided an annotated file with comments. You can
              download it using the button below:
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_URL}/files/${fileIds}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium my-4"
            >
              Download Editor&quot;s File
            </Button>
          </>
        )}
        <Text className="text-gray-700 mt-6">
          We appreciate the time and effort you invested in preparing this
          manuscript and encourage you to consider submitting future work to our
          journal.
        </Text>
      </Section>
      <Section className="bg-gray-100 text-center py-4 text-sm font-semibold text-gray-600">
        <Text>© 2025 JAEPH. All rights reserved.</Text>
      </Section>
    </Container>
  </Tailwind>
);
