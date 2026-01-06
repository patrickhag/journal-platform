import { NotifiyContributor } from '@/components/emails/notify-contributor';
import { EmailPasswordReset } from '@/components/emails/password-reset';
import { RejectManuscript } from '@/components/emails/reject-manuscript';
import { AcceptManuscriptEmailTemplate } from '@/components/emails/accept-manuscript';
import { SendInvitation } from '@/components/emails/sendInvite';
import { SendVerifyEmail } from '@/components/emails/verify';
import { NotifyAdminEmail } from '@/components/emails/notify-admin';
import { render } from '@react-email/components';
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
import { AssignReviewerEmailTemplate } from '@/components/emails/inform-reviewer-email-template';
import { ArticleReadyForEICApprovalEmailTemplate } from '@/components/emails/inform-chief-editor-email-template';
import { InformStaffEditorAboutInvitation } from '@/components/emails/inform-staff-editor-about-reviewer-invitation';
import { ReviewerSubmittedEmail } from '@/components/emails/review-submitted-email';
import { SendAssociateEditorInvitation } from '@/components/emails/send-invite-associate-editor';
import { InformStaffEditorAboutAssociateInvitation } from '@/components/emails/inform-staff-editor-about-associate-invitation';
import { NotifyStaffEditorAboutAssociateEditorCorrection } from '@/components/emails/notifiy-staff-editor-about-ass-correction';
import { SubscriberEmail } from '@/components/emails/sendSubscriberEmail';
import { RemindReviewer } from '@/components/emails/remind-reviewer';
import { RemindEditor } from '@/components/emails/remind-editor';
import { resend, transporter } from './emailConfig';
import { NotifyStaffEditorAboutReviewerAcceptance } from '@/components/emails/notify-staff-editor-about-review-acceptance';
import { StaffEditorEmailTemplate } from '@/components/emails/inform-associate-editor';
import { NotifyReviewerAboutFinalizedAssignment } from '@/components/emails/notify-reviewer-about-finalised-status';
import { AssociateEditorStatusEmail } from '@/components/emails/inform-associate-editor-about-correction';
import { AuthorReplyToStaffEditorEmail } from '@/components/emails/author-reply-to-staff-editor';
import { AuthorReplyToReviewerEmail } from '@/components/emails/author-reply-to-reviewer';
import { InformChiefEditorAboutOngoingPublication } from '@/components/emails/inform-chief-editor-about-ongoing-publication';

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
  try {
    const emailHtml = await render(
      <EmailPasswordReset url={url} name={name} />
    );
    const options = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
      html: emailHtml,
    };

    const result = await transporter.sendMail(options);

    return {
      success: true,
      messageId: result.messageId,
      accepted: result.accepted,
    };
  } catch (error) {
    console.error('Error sending password reset email:', {
      error: error instanceof Error ? error.message : error,
      toEmail,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const notifyContibutor = async ({
  subject,
  toEmail,
  originalAuthor,
  article,
  contributor,
}: {
  toEmail: string;
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

export const remindReviewerAboutRevision = async ({
  toEmail,
  articleTitle,
  reviewerName,
  dueDate,
}: {
  toEmail: string;
  articleTitle: string;
  reviewerName: string;
  dueDate: string;
}) => {
  const emailHtml = await render(
    <RemindReviewer
      articleTitle={articleTitle}
      reviewerName={reviewerName}
      dueDate={dueDate}
    />
  );

  const options = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Reminder: Please review your assigned manuscript',
    html: emailHtml,
  };
  const result = await transporter.sendMail(options);
  if (result.accepted.length === 0) {
    return false;
  } else {
    return true;
  }
};

export const remindAssociateEditorAboutAssignment = async ({
  toEmail,
  articleTitle,
  editorName,
  dueDate,
}: {
  toEmail: string;
  articleTitle: string;
  editorName: string;
  dueDate: string;
}) => {
  const emailHtml = await render(
    <RemindEditor
      articleTitle={articleTitle}
      editorName={editorName}
      dueDate={dueDate}
    />
  );

  const options = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: 'Reminder: Please complete your assigned manuscript formatting',
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
  reviewAssignmentId,
}: {
  reviewerNames: string;
  articleId: string;
  articleTitle: string;
  toEmail: string;
  isAlreadyUser: boolean;
  dueDate: string;
  password?: string;
  abstract: string;
  reviewAssignmentId: string;
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
      reviewAssignmentId={reviewAssignmentId}
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
  name,
}: {
  email: string;
  token: string;
  name?: string;
}) => {
  const emailHtml = await render(
    <SendVerifyEmail
      link={`${process.env.NEXT_PUBLIC_URL}/api/verify-user?id=${token}`}
      name={name}
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
    subject: 'Associate Editor has edited the manuscript',
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

export const notifyStaffEditor = async ({
  articleTitle,
  authorNames,
  staffEditorEmail,
  editorName,
}: {
  articleTitle: string;
  authorNames: string;
  staffEditorEmail: string;
  editorName: string;
}) => {
  try {
    const emailHtml = await render(
      <StaffEditorEmailTemplate
        articleTitle={articleTitle}
        authorName={authorNames}
        editorName={editorName}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: staffEditorEmail,
      subject: 'You have been assigned as Staff Editor to an article',
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
      subject = 'Manuscript Revision Requested';
      emailHtml = await render(
        <ReviewerReReviewEmailTemplate
          articleTitle={articleTitle}
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

export const notifyStaffEditorAboutReviewStatus = async ({
  articleTitle,
  authorNames,
  staffEditorEmail,
  articleId,
  status,
}: {
  articleTitle: string;
  authorNames: string;
  staffEditorEmail: string;
  articleId: string;
  status: 'Accepted' | 'Rejected';
}) => {
  try {
    let isAccepted;
    switch (status) {
      case 'Accepted':
        isAccepted = true;
        break;
      case 'Rejected':
        isAccepted = false;
        break;
      default:
        throw new Error('Invalid status type');
    }
    const emailHtml = await render(
      <NotifyStaffEditorAboutReviewerAcceptance
        articleTitle={articleTitle}
        authorName={authorNames}
        isAccepted={isAccepted as boolean}
        articleId={articleId}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: staffEditorEmail,
      subject: 'Reviewer decision',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const notifyReviewerAboutReReview = async ({
  reviewerName,
  articleTitle,
  reviewerEmail,
}: {
  reviewerName: string;
  articleTitle: string;
  reviewerEmail: string;
}) => {
  try {
    const emailHtml = await render(
      <ReviewerReReviewEmailTemplate
        reviewerName={reviewerName}
        articleTitle={articleTitle}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reviewerEmail,
      subject: 'Manuscript Revision Requested',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
};

export const notifyAllReviewersAboutFinalStatus = async ({
  articleTitle,
  authorNames,
  reviewerEmail,
  status,
}: {
  articleTitle: string;
  authorNames: string;
  reviewerEmail: string;
  status: 'ACCEPT' | 'REJECT';
}) => {
  try {
    let isAccepted;
    switch (status) {
      case 'ACCEPT':
        isAccepted = true;
        break;
      case 'REJECT':
        isAccepted = false;
        break;
      default:
        throw new Error('Invalid status type');
    }
    const emailHtml = await render(
      <NotifyReviewerAboutFinalizedAssignment
        articleTitle={articleTitle}
        authorName={authorNames}
        isAccepted={isAccepted as boolean}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reviewerEmail,
      subject: 'Editorial decision',
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

export const authorInformStaffEditor = async ({
  staffEditorName,
  authorName,
  articleTitle,
  articleLink,
  message,
  staffEditorEmail,
}: {
  staffEditorName: string;
  authorName: string;
  articleTitle: string;
  articleLink: string;
  message: string;
  staffEditorEmail: string;
}) => {
  try {
    const emailHtml = await render(
      <AuthorReplyToStaffEditorEmail
        staffEditorName={staffEditorName}
        articleTitle={articleTitle}
        articleLink={articleLink}
        authorName={authorName}
        message={message}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: staffEditorEmail,
      subject: `Author reply received for "${articleTitle}"`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending author reply notification:', error);
    return { success: false, error };
  }
};

export const authorInformReviewer = async ({
  reviewerName,
  authorName,
  articleTitle,
  articleLink,
  message,
  reviewerEmail,
}: {
  reviewerName: string;
  authorName: string;
  articleTitle: string;
  articleLink: string;
  message?: string;
  reviewerEmail: string;
}) => {
  try {
    const emailHtml = await render(
      <AuthorReplyToReviewerEmail
        reviewerName={reviewerName}
        articleTitle={articleTitle}
        articleLink={articleLink}
        authorName={authorName}
        message={message}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reviewerEmail,
      subject: `Author reply received for "${articleTitle}"`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error(
      'Error sending author reply notification to reviewer:',
      error
    );
    return { success: false, error };
  }
};

export const notifyAssociateEditor = async ({
  associateEditorEmail,
  associateEditorName,
  articleTitle,
  articleId,
  status,
  message,
}: {
  associateEditorEmail: string;
  associateEditorName: string;
  articleTitle: string;
  articleId: string;
  status: 'APPROVED' | 'RE_CORRECTION_REQUESTED';
  message?: string;
}) => {
  try {
    const emailHtml = await render(
      <AssociateEditorStatusEmail
        associateEditorName={associateEditorName}
        articleTitle={articleTitle}
        articleId={articleId}
        status={status}
        message={message}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: associateEditorEmail,
      subject:
        status === 'APPROVED'
          ? `Your corrections for "${articleTitle}" have been approved`
          : `Further action required: "${articleTitle}"`,
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

export const informChiefEditorAboutOngoingPublication = async ({
  articleTitle,
  authorNames,
  issueNumber,
  volumeYear,
}: {
  articleTitle: string;
  authorNames: string;
  issueNumber: string | number;
  volumeYear: string | number;
}) => {
  try {
    const emailHtml = await render(
      <InformChiefEditorAboutOngoingPublication
        articleTitle={articleTitle}
        authorNames={authorNames}
        issueNumber={issueNumber}
        volumeYear={volumeYear}
      />
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EDITOR_IN_CHIEF_EMAIL,
      subject: 'Ongoing publication awaits your acceptance',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error(
      'Error informing chief editor about ongoing publication:',
      error
    );
    return { success: false, error };
  }
};
