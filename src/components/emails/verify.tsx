import { Html, Link, Tailwind } from '@react-email/components';
import type * as React from 'react';
import { Section } from '@react-email/components';

export const SendVerifyEmail: React.FC<{
  link: string;
}> = (props) => {
  const { link } = props;
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#007291',
            },
          },
        },
      }}
    >
      <Html lang="en">
        <Section className="my-[16px]">
          <Section className="mt-[32px] text-center">
            <Link
              className="mt-[16px] rounded-[8px] bg-indigo-600 px-[40px] py-[12px] font-semibold text-white"
              href={link}
            >
              Verify Email
            </Link>
          </Section>
        </Section>
      </Html>
    </Tailwind>
  );
};
