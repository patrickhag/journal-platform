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
import { ThankAuthorEmailTemplate } from '@/components/emails/thank-you-email-template';
import { AssignEditorEmailTemplate } from '@/components/emails/inform-associate-editor';
import { AssignReviewerEmailTemplate } from '@/components/emails/inform-reviewer-email-template';
import { ArticleReadyForEICApprovalEmailTemplate } from '@/components/emails/inform-chief-editor-email-template';
import { InformStaffEditorAboutInvitation } from '@/components/emails/inform-staff-editor-about-reviewer-invitation';
import { ReviewerSubmittedEmail } from '@/components/emails/review-submitted-email';
import { AuthorReplyToReviewEmail } from '@/components/emails/author-reply-to-review-email';
import { SendAssociateEditorInvitation } from '@/components/emails/send-invite-associate-editor';
import { InformStaffEditorAboutAssociateInvitation } from '@/components/emails/inform-staff-editor-about-associate-invitation';
import { NotifyStaffEditorAboutAssociateEditorCorrection } from '@/components/emails/notifiy-staff-editor-about-ass-correction';
import { SubscriberEmail } from '@/components/emails/sendSubscriberEmail';

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
  reviewerNames,
  articleId,
  articleTitle,
  toEmail,
  isAlreadyUser,
  dueDate,
  password,
  abstract,
}: {
  reviewerNames: string;
  articleId: string;
  articleTitle: string;
  toEmail: string;
  isAlreadyUser: boolean;
  dueDate: string;
  password?: string;
  abstract: string;
}) => {
  const emailHtml = await render(
    <SendInvitation
      abstract={abstract}
      reviewerName={reviewerNames}
      articleTitle={articleTitle}
      isAlreadyUser={isAlreadyUser}
      articleId={articleId}
      dueDate={dueDate}
      password={password as string}
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

export const sendAssociateEditorInvitation = async ({
  editorName,
  articleTitle,
  dueDate,
  articleId,
  editorEmail,
}: {
  editorName: string;
  articleTitle: string;
  dueDate: string;
  articleId: string;
  editorEmail: string;
}) => {
  const emailHtml = await render(
    <SendAssociateEditorInvitation
      editorName={editorName}
      articleTitle={articleTitle}
      articleId={articleId}
      dueDate={dueDate}
    />
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: editorEmail,
    subject: 'You have been invited to format a manuscript.',
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

export const informStaffEditorAboutCorrection = async ({
  staffEditorEmail,
  associateEditorName,
  articleTitle,
  staffEditorName,
}: {
  staffEditorEmail: string;
  associateEditorName: string;
  articleTitle: string;
  staffEditorName: string;
}) => {
  const emailHtml = await render(
    <NotifyStaffEditorAboutAssociateEditorCorrection
      articleTitle={articleTitle}
      associateEditorName={associateEditorName}
      staffEditorName={staffEditorName}
    />
  );
  const options = {
    from: process.env.EMAIL_USER,
    to: staffEditorEmail,
    subject: 'Staff Editor has edited the manuscript',
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
  staffEditorEmail,
}: {
  article: string;
  authorName: string;
  subject: string;
  articleId: string;
  participant: 'REVIEWER' | 'AUTHOR';
  staffEditorEmail?: string;
}) => {
  try {
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
      to: staffEditorEmail,
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
  associateEditorName,
  authorName,
  articleLink,
  articleTitle,
  type,
  reviewerName,
  reviewerEmail,
  associateEditorEmail,
}: {
  associateEditorName?: string;
  authorName: string;
  articleLink: string;
  articleTitle: string;
  type: 'AUTHOR' | 'REVIEWER';
  reviewerName?: string;
  reviewerEmail?: string;
  associateEditorEmail?: string;
}) => {
  let subject;
  let emailHtml;
  switch (type) {
    case 'AUTHOR':
      subject = 'Revised Manuscript Ready for Re-evaluation';
      emailHtml = await render(
        <AuthorRevisedManuscriptEmailTemplate
          editorName={associateEditorName as string}
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
    to: type === 'REVIEWER' ? reviewerEmail : associateEditorEmail,
    subject: 'Revised Manuscript Ready for Re-evaluation',
    html: emailHtml,
  };
  await transporter.sendMail(options);
};

export const notifyAssociateEditor = async ({
  articleTitle,
  authorNames,
  associateEditorEmail,
  editorName,
}: {
  articleTitle: string;
  authorNames: string;
  associateEditorEmail: string;
  editorName: string;
}) => {
  try {
    const emailHtml = await render(
      <AssignEditorEmailTemplate
        articleTitle={articleTitle}
        authorName={authorNames}
        editorName={editorName}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: associateEditorEmail,
      subject: 'You have been assigned as Associate Editor to an article',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const associateNotifyReviewer = async ({
  articleTitle,
  reviewerNames,
  reviewerEmail,
  authorNames,
}: {
  articleTitle: string;
  reviewerNames: string;
  reviewerEmail: string;
  authorNames: string;
}) => {
  try {
    const emailHtml = await render(
      <AssignReviewerEmailTemplate
        articleTitle={articleTitle}
        reviewerName={reviewerNames}
        reviewAcceptUrl=""
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reviewerEmail,
      subject: 'Invitation of reviewing a manuscript',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending reviewer invitation:', error);
    return { success: false, error };
  }
};

export const thankAuthorAboutSubmission = async ({
  articleTitle,
  authorNames,
  authorEmail,
}: {
  articleTitle: string;
  authorNames: string;
  authorEmail?: string;
}) => {
  try {
    const emailHtml = await render(
      <ThankAuthorEmailTemplate names={authorNames} article={articleTitle} />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: authorEmail,
      subject: 'Thank you for submitting your article',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const informChiefEditorAboutAcceptance = async ({
  articleTitle,
  authorNames,
  associateEditorName,
  articleLink,
}: {
  articleTitle: string;
  authorNames: string;
  authorEmail?: string;
  associateEditorName: string;
  articleLink: string;
}) => {
  try {
    const emailHtml = await render(
      <ArticleReadyForEICApprovalEmailTemplate
        articleLink={articleLink}
        articleTitle={articleTitle}
        associateEditorName={associateEditorName}
        authorName={authorNames}
        editorInChiefName={process.env.EDITOR_IN_CHIEF_NAME as string}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EDITOR_IN_CHIEF_EMAIL,
      subject: 'Associate editor has accepted the manuscript.',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const informStaffEditorAboutReviewerInvitation = async ({
  staffEditorName,
  associateEditorEmail,
  reviewerName,
  articleTitle,
  status,
}: {
  staffEditorName: string;
  associateEditorEmail: string;
  reviewerName: string;
  articleTitle: string;
  authorEmail?: string;
  status: 'accepted' | 'rejected';
}) => {
  try {
    const emailHtml = await render(
      <InformStaffEditorAboutInvitation
        articleTitle={articleTitle}
        staffEditorName={staffEditorName}
        reviewerName={reviewerName}
        status={status}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: associateEditorEmail,
      subject:
        status === 'accepted'
          ? 'Reviwer has accepted the invitation to review the manuscript.'
          : 'Reviwer has declined the invitation to review the manuscript.',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const informStaffEditorAboutAssociateInvitation = async ({
  staffEditorName,
  staffEditorEmail,
  associateEditorName,
  articleTitle,
  status,
}: {
  staffEditorName: string;
  staffEditorEmail: string;
  associateEditorName: string;
  articleTitle: string;
  status: 'accepted' | 'rejected';
}) => {
  try {
    const emailHtml = await render(
      <InformStaffEditorAboutAssociateInvitation
        articleTitle={articleTitle}
        staffEditorName={staffEditorName}
        associateEditorName={associateEditorName}
        status={status}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: staffEditorEmail,
      subject:
        status === 'accepted'
          ? 'Associate editor has accepted the invitation to edit the manuscript.'
          : 'Associate editor has declined the invitation to edit the manuscript.',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const informingAuthorNReviewer = async ({
  participantEmail,
  participantName,
  articleTitle,
  subject,
  userType,
}: {
  participantEmail: string;
  participantName: string;
  articleTitle: string;
  subject: string;
  userType: string;
}) => {
  try {
    const emailHtml = await render(
      <ReviewerSubmittedEmail
        articleTitle={articleTitle}
        participantName={participantName}
        userType={userType}
      />
    );
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: participantEmail,
      subject,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const authorInformReviewer = async ({
  reviewerEmail,
  reviewerName,
  authorName,
  articleTitle,
  articleLink,
  message,
}: {
  reviewerName: string;
  authorName: string;
  articleTitle: string;
  articleLink: string;
  reviewerEmail: string;
  message: string;
}) => {
  try {
    const emailHtml = await render(
      <AuthorReplyToReviewEmail
        articleTitle={articleTitle}
        reviewerName={reviewerName}
        articleLink={articleLink}
        authorName={authorName}
        message={message}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reviewerEmail,
      subject: 'Author has replied to your the review on JAEPH.',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};
export const sendEmailToSubscribers = async ({
  subscriberEmail,
  subject,
  message,
}: {
  subscriberEmail: string;
  subject: string;
  message: string;
}) => {
  try {
    const emailHtml = await render(<SubscriberEmail email={message} />);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: subscriberEmail,
      subject: subject,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error };
  }
};
