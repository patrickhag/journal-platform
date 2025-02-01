import { NotifiyContributor } from '@/components/emails/notify-contributor';
import { EmailPasswordReset } from '@/components/emails/password-reset';
import { SendInvitation } from '@/components/emails/sendInvite';
import { SendVerifyEmail } from '@/components/emails/verify';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async ({
  subject,
  toEmail,
  url,
  name,
}: {
  toEmail: string;
  url: string;
  subject: string;
  name: string;
}) => {
  const emailHtml = await render(<EmailPasswordReset url={url} name={name} />);
  const options = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject,
    html: emailHtml,
  };
  await transporter.sendMail(options);
};

export const notifyContibutor = async ({
  subject,
  toEmail,
  originalAuthor,
  article,
  contributor,
}: {
  toEmail: string;
  url: string;
  subject: string;
  originalAuthor: string;
  article: string;
  contributor: string;
}) => {
  const emailHtml = await render(
    <NotifiyContributor
      contributor={contributor}
      originalAuthor={originalAuthor}
      article={article}
    />
  );

  const options = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject,
    html: emailHtml,
  };
  await transporter.sendMail(options);
  return true;
};

export const sendInvitation = async ({
  article,
  author,
  reviewer,
  toEmail,
}: {
  reviewer: string;
  article: {
    article: string;
    title: string;
    subTitle: string;
    content: string;
  };
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  toEmail: string;
}) => {
  const emailHtml = await render(
    <SendInvitation
      reviewerEmail={toEmail}
      article={article}
      author={author}
      reviewer={reviewer}
    />
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'You have been invited to review the following article',
    html: emailHtml,
  };
  await transporter.sendMail(options);
};

export const sendVerifyToken = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const emailHtml = await render(
    <SendVerifyEmail
      link={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/verify-user?id=${token}`}
    />
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Please verify your account',
    html: emailHtml,
  };

  await transporter.sendMail(options);
};
