import { NotifiyContributor } from '@/components/emails/notify-contributor';
import { EmailPasswordReset } from '@/components/emails/password-reset';
import { RejectManuscript } from '@/components/emails/reject-manuscript';
import { AcceptManuscriptEmailTemplate } from '@/components/emails/accept-manuscript';
import { SendInvitation } from '@/components/emails/sendInvite';
import { SendVerifyEmail } from '@/components/emails/verify';
import { NotifyAdminEmail } from '@/components/emails/notify-admin';
import { render } from '@react-email/components';
import nodemailer from 'nodemailer';
import {
  ArticleAcceptedEmailTemplate,
  ArticleRejectedEmailTemplate,
  ArticleRevisionEmailTemplate,
} from '@/components/emails/notify-author';
import ProofSubmittedAdminEmailTemplate from '@/components/emails/notify-admin-proof';
import ArticleNotificationEmail from '@/components/emails/notify-user-proof';
import {
  AuthorRevisedManuscriptEmailTemplate,
  ReviewerReReviewEmailTemplate,
} from '@/components/emails/author-revised-manuscript';

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
  return true;
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
  const result = await transporter.sendMail(options);
  if (result.accepted.length === 0) {
    return false;
  } else {
    return true;
  }
};

export const sendInvitation = async ({
  article,
  reviewer,
  toEmail,
  isAlreadyUser,
  editorInChiefId,
  dueDate,
}: {
  reviewer: string;
  article: {
    article: string;
    title: string;
    subTitle: string;
    content: string;
  };
  toEmail: string;
  isAlreadyUser: boolean;
  editorInChiefId: string;
  dueDate: string;
}) => {
  const emailHtml = await render(
    <SendInvitation
      reviewerEmail={toEmail}
      article={article}
      reviewer={reviewer}
      isAlreadyUser={isAlreadyUser}
      editorInChiefId={editorInChiefId}
      dueDate={dueDate}
    />
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'You have been invited to review a manuscript.',
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
      link={`${process.env.NEXT_PUBLIC_URL}/api/verify-user?id=${token}`}
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

export const rejectManuscriptEmail = async ({
  article,
  authorEmails,
  names,
}: {
  article: string;
  authorEmails: string[];
  names: string;
}) => {
  const emailHtml = await render(
    <RejectManuscript article={article} names={names} />
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: authorEmails.map((email) => email),
    subject: 'Your manuscript has been rejected',
    html: emailHtml,
  };
  await transporter.sendMail(options);
};

export const acceptManuscriptEmail = async ({
  nameOfArticle,
  authorEmail,
  names,
}: {
  nameOfArticle: string;
  authorEmail: string;
  names: string;
}) => {
  const emailHtml = await render(
    <AcceptManuscriptEmailTemplate article={nameOfArticle} names={names} />
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: authorEmail,
    subject: 'Your manuscript has been accepted',
    html: emailHtml,
  };
  await transporter.sendMail(options);
};

export const notifyAdmin = async ({
  article,
  authorName,
  subject,
  articleId,
  participant,
}: {
  article: string;
  authorName: string;
  subject: string;
  articleId: string;
  participant: 'REVIEWER' | 'AUTHOR';
}) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new Error('Admin email not configured');
    }

    const emailHtml = await render(
      <NotifyAdminEmail
        articleId={articleId}
        article={article}
        authorName={authorName}
        participant={participant}
        title={subject}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: subject,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const notifyUser = async ({
  articleTitle,
  authorName,
  authorEmail,
  articleLink,
  subject,
  type,
}: {
  articleTitle: string;
  authorName: string;
  authorEmail: string;
  articleLink: string;
  subject: string;
  type: 'proof' | 'published';
}) => {
  try {
    const emailHtml = await render(
      <ArticleNotificationEmail
        authorName={authorName}
        articleTitle={articleTitle}
        articleLink={articleLink}
        type={type}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: authorEmail,
      subject: subject,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const notifyAdminAboutProof = async ({
  article,
  authorName,
}: {
  article: string;
  authorName: string;
}) => {
  try {
    const emailHtml = await render(
      <ProofSubmittedAdminEmailTemplate
        authorName={authorName}
        articleTitle={article}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Author Submitted Updated Proof for Review',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const notifyUserAboutEditorDecision = async ({
  article,
  authorName,
  authorEmail,
  articleLink,
  decision,
  fileIds,
}: {
  article: string;
  authorName: string;
  authorEmail: string;
  articleLink: string;
  decision: 'ACCEPT' | 'REVISION' | 'REJECT';
  fileIds?: string;
}) => {
  try {
    let subject = '';
    let emailHtml;

    switch (decision) {
      case 'ACCEPT':
        subject = 'Your article has been accepted!';
        emailHtml = await render(
          <ArticleAcceptedEmailTemplate
            authorName={authorName}
            articleTitle={article}
            fileIds={fileIds}
          />
        );
        break;
      case 'REVISION':
        subject = 'Revision requested for your article';
        emailHtml = await render(
          <ArticleRevisionEmailTemplate
            authorName={authorName}
            articleTitle={article}
            articleLink={articleLink}
            fileIds={fileIds}
          />
        );
        break;
      case 'REJECT':
        subject = 'Your article has been rejected';
        emailHtml = await render(
          <ArticleRejectedEmailTemplate
            authorName={authorName}
            articleTitle={article}
            fileIds={fileIds}
          />
        );
        break;
      default:
        throw new Error('Invalid decision type');
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: authorEmail,
      subject,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending editor decision notification:', error);
    return { success: false, error };
  }
};

export const notifyEditorAboutRevision = async ({
  editorName = 'Patrick HAGENIMANA',
  authorName,
  articleLink,
  articleTitle,
  type,
  reviewerName,
  reviewerEmail,
}: {
  editorName?: string;
  authorName: string;
  articleLink: string;
  articleTitle: string;
  type: 'AUTHOR' | 'REVIEWER';
  reviewerName?: string;
  reviewerEmail?: string;
}) => {
  let subject;
  let emailHtml;
  switch (type) {
    case 'AUTHOR':
      subject = 'Revised Manuscript Ready for Re-evaluation';
      emailHtml = await render(
        <AuthorRevisedManuscriptEmailTemplate
          editorName={editorName}
          authorName={authorName}
          articleLink={articleLink}
          articleTitle={articleTitle}
        />
      );
      break;
    case 'REVIEWER':
      subject = 'Manuscript Revision Complete - Re-review Request';
      emailHtml = await render(
        <ReviewerReReviewEmailTemplate
          articleLink={articleLink}
          articleTitle={articleTitle}
          authorName={authorName}
          reviewerName={reviewerName as string}
        />
      );
    default:
      break;
  }

  const options = {
    from: process.env.EMAIL_USER,
    to: type === 'REVIEWER' ? reviewerEmail : 'patrickhag09@gmail.com',
    subject: 'Revised Manuscript Ready for Re-evaluation',
    html: emailHtml,
  };
  await transporter.sendMail(options);
};
