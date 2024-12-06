import { Button, Html, Tailwind } from "@react-email/components";
import type * as React from "react";
import { Row, Hr, Section, Img, Heading, Text, Link } from "@react-email/components";
import { title } from "process";

export const SendInvitation: React.FC<{
    reviewer: string;
    article: { article: string,title: string, subTitle: string, content: string };
    author: {
        name: string;
        role: string;
        avatar: string;
    }
}> = (props) => {
    const { article, reviewer, author } = props;
    return (
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            brand: "#007291",
                        },
                    },
                },
            }}
        >
            <Html lang="en">
                Hi {reviewer}

                <Section className="my-[16px]">
                    <Text className="text-[16px] leading-[24px] text-gray-500">
                        You have been invited to review the following article:
                    </Text>
                 
                    <Section className="mt-[32px] text-center">
                        <Text className="my-[16px] text-[18px] font-semibold leading-[28px] text-indigo-600">
                            {title}
                        </Text>
                        <Text
                            className="m-0 mt-[8px] text-[22px]  leading-[36px] text-gray-900"
                        >
                            {article.subTitle}
                        </Text>
                        <Text className="text-[16px] leading-[24px] text-gray-500">
                            {article.content}
                        </Text>
                        <section className="grid grid-cols-2 gap-4">

                        <Button
                            className="mt-[16px] rounded-[8px] bg-indigo-600 px-[40px] py-[12px] font-semibold text-white"
                            href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/articles/${article.article}?accept_invite=1`}
                        >
                            Accept invitation
                        </Button>
                        <Button
                            className="mt-[16px] rounded-[8px] bg-indigo-400 px-[40px] py-[12px] font-semibold text-white"
                            href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/articles/${article.article}?accept_invite=0`}
                        >
                            Reject invitation
                        </Button>
                        </section>
                    </Section>
                </Section>

                <Row>
                    <Hr className="my-[16px] !border-gray-300" />
                    <Section className="mt-[5px] inline-block max-h-[48px] max-w-[48px] text-left">
                        <Img
                            alt={author.name}
                            className="block h-[48px] w-[48px] rounded-full object-cover object-center"
                            height={48}
                            src={author.avatar}
                            width={48}
                        />
                    </Section>
                    <Section className="ml-[18px] inline-block max-w-[120px] text-left align-top">
                        <Heading
                            as="h3"
                            className="m-[0px] text-[14px] font-medium leading-[20px] text-gray-800"
                        >
                            {author.name}
                        </Heading>
                        <Text className="m-[0px] text-[12px] font-medium leading-[14px] text-gray-500">
                            {author.role}
                        </Text>
                        <Section className="mt-[4px]">
                            <Link className="inline-flex h-[12px] w-[12px]" href="#">
                                <Img
                                    alt="X"
                                    src="https://react.email/static/x-icon.png"
                                    style={{ height: "12px", width: "12px" }}
                                />
                            </Link>
                            <Link className="ml-[8px] inline-flex h-[12px] w-[12px]" href="#">
                                <Img
                                    alt="LinkedIn"
                                    src="https://react.email/static/in-icon.png"
                                    style={{ height: "12px", width: "12px" }}
                                />
                            </Link>
                        </Section>
                    </Section>
                </Row>
            </Html>
        </Tailwind>
    );
};
