import { NotifiyContributor } from "@/components/emails/notify-contributor";
import { EmailPasswordReset } from "@/components/emails/password-reset";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
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
}: { toEmail: string; url: string; subject: string }) => {
  const emailHtml = await render(<EmailPasswordReset url={url} />);
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
}: {
  toEmail: string;
  url: string;
  subject: string;
  originalAuthor: string;
  article: string;
}) => {
  const emailHtml = await render(
    <NotifiyContributor
      contributor={toEmail}
      originalAuthor={originalAuthor}
      article={article}
    />,
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject,
    html: emailHtml,
  };
  await transporter.sendMail(options);
};
