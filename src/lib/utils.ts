import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { CorrectionStatus } from '@/types';
import { toast } from 'sonner';
import sanitizeHtml from 'sanitize-html';
import { redirect } from 'next/navigation';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSectionImage = (section: string): string => {
  switch (section) {
    case 'Case study':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747135546/case-study_bgo0y0.jpg';

    case 'Case Report':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747135942/case-report_ag5oyy.jpg';

    case 'Narative Review':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747136065/narrative-review_voprgt.jpg';

    case 'Original Research':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747136666/original-study_fvljpd.jpg';

    case 'Meta Analysis':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747136864/meta-analysis_ysopis.jpg';

    case 'Systematic Review':
      return 'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp';

    default:
      return 'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp';
  }
};

export const formatStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace(/_/g, ' ') // Replace _ with space
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
};

export const getReviewAssignmentsStatusStyle = (status: string) => {
  switch (status) {
    case 'INVITED':
      return 'text-blue-900 bg-blue-100'; // Sent/Pending
    case 'ACCEPTED':
      return 'text-green-900 bg-green-100'; // Accepted
    case 'REJECTED':
      return 'text-red-900 bg-red-100'; // Rejected
    case 'REJECTED_BY_USER':
      return 'text-yellow-900 bg-yellow-100'; // User Rejected
    default:
      return 'text-gray-900 bg-gray-100'; // Unknown/Pending
  }
};

export function formatDateToYMD(isoString: string) {
  const date = parseISO(isoString);
  return format(date, 'yyyy-MM-dd');
}

export const formatAssignmentCorrectionsStatus: Record<
  CorrectionStatus,
  string
> = {
  SUBMITTED: 'Submitted',
  RE_CORRECTION_REQUESTED: 'Revision',
  APPROVED: 'Approved',
};

export const slugify = (value: string) =>
  value
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const sdgGoalsMap: Record<string, string> = {
  'No Poverty': 'Goal 1 - No Poverty',
  'Zero Hunger': 'Goal 2 - Zero Hunger',
  'Good Health and Well-being': 'Goal 3 - Good Health and Well-being',
  'Quality Education': 'Goal 4 - Quality Education',
  'Gender Equality': 'Goal 5 - Gender Equality',
  'Clean Water and Sanitation': 'Goal 6 - Clean Water and Sanitation',
  'Affordable and Clean Energy': 'Goal 7 - Affordable and Clean Energy',
  'Decent Work and Economic Growth': 'Goal 8 - Decent Work and Economic Growth',
  'Industry, Innovation and Infrastructure':
    'Goal 9 - Industry, Innovation and Infrastructure',
  'Reduced Inequality': 'Goal 10 - Reduced Inequality',
  'Sustainable Cities and Communities':
    'Goal 11 - Sustainable Cities and Communities',
  'Responsible Consumption and Production':
    'Goal 12 - Responsible Consumption and Production',
  'Climate Action': 'Goal 13 - Climate Action',
  'Life Below Water': 'Goal 14 - Life Below Water',
  'Life on Land': 'Goal 15 - Life on Land',
  'Peace, Justice and Strong Institutions':
    'Goal 16 - Peace, Justice and Strong Institutions',
  'Partnerships for the Goals': 'Goal 17 - Partnerships for the Goals',
};

export function getSDGLabel(sdg: string): string {
  return sdgGoalsMap[sdg] ?? sdg;
}

export const roleMap: Record<string, string> = {
  NORMAL_USER: 'Author',
  CHIEF_EDITOR: 'Chief Editor',
  SENIOR_EDITOR: 'Senior Editor',
  LEAD_EDITOR: 'Lead Editor',
  ASSOCIATE_EDITOR: 'Associate Editor',
  STAFF_EDITOR: 'Staff Editor',
  ADMIN: 'Admin',
  REVIEWER: 'Reviewer',
  ADVISOR: 'Advisor',
  EDITORIAL_BOARD_MEMBER: 'Editorial Board Member',
};

export const getAssignmentStatusColor = (status: string) => {
  switch (status) {
    case 'UNDER REVIEW':
      return 'bg-blue-100 text-blue-800'; // pending
    case 'ACCEPTED':
      return 'bg-green-100 text-green-800'; // confirmed
    case 'DECLINED':
      return 'bg-red-100 text-red-800'; // rejected
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800'; // finished
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getReviewRecommendationColor = (recommendation: string) => {
  switch (recommendation) {
    case 'Accepted':
      return 'bg-green-100 text-green-800';
    case 'Minor Collection':
      return 'bg-yellow-100 text-yellow-800';
    case 'Major Collection':
      return 'bg-orange-100 text-orange-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getUrgencyColor = (daysRemaining: number, status: string) => {
  if (status === 'COMPLETED') return '!bg-green-100 !text-green-800';
  if (daysRemaining <= 3) return '!bg-amber-100 !text-amber-800';
  return '!bg-blue-100 !text-blue-800';
};

export const calculateDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const redirectUserBasedOnRole = (role: string): string => {
  let linkUrl: string;

  switch (role) {
    case 'NORMAL_USER':
      linkUrl = '/author/submissions';
      break;
    case 'REVIEWER':
      linkUrl = '/reviewer/assignments';
      break;
    case 'STAFF_EDITOR':
      linkUrl = '/staff-editor/assignments';
      break;
    case 'ASSOCIATE_EDITOR':
      linkUrl = '/associate-editor/assignments';
      break;
    case 'CHIEF_EDITOR':
      linkUrl = '/editor/dashboard';
      break;
    default:
      linkUrl = '/';
      break;
  }

  return linkUrl;
};

export const formatDate = (date: Date | string) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d, yyyy');
};

export const formatRoleText = (roleText: string): string => {
  // Trim, split on whitespace, filter empty, uppercase each word, then join with _
  if (!roleText) return '';
  return roleText
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.toUpperCase())
    .join('_');
};

export const copyToClipboard = (text: string, format?: string) => {
  navigator.clipboard.writeText(text).then(() => {
    if (format) {
      toast.info(`${format} citation copied successfully.`);
    } else {
      toast.info('Link copied successfully.');
    }
  });
};

// Helper function to escape XML special characters
export function escapeXml(unsafe: string | null | undefined): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper function for returning errors in xml
export function errorResponse(code: string, message?: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <OAI-PMH xmlns="http://www.openarchives.org/OAI/2.0/">
      <responseDate>${new Date().toISOString()}</responseDate>
      <error code="${code}">${message ?? ''}</error>
    </OAI-PMH>`;
}

// Helper function to format date to YYYY-MM-DD
export function formatDateForXML(
  date: Date | string | null | undefined
): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

// Helper function to strip HTML tags and convert to plain text
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  // Use sanitize-html to remove all HTML tags and return plain text
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim(); // Trim leading/trailing whitespace
}

export function encodeResumptionToken(data: object) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export function decodeResumptionToken(token: string) {
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export const handleDashboardRedirect = (role: string) => {
  switch (role) {
    case 'NORMAL_USER':
      redirect('/author/submissions');
      break;
    case 'ASSOCIATE_EDITOR':
      redirect('/staff-editor/assigned');
      break;
    case 'CHIEF_EDITOR':
      redirect('/editor/dashboard');
      break;
    case 'STAFF_EDITOR':
      redirect('/staff-editor/assignments');
      break;
    case 'REVIEWER':
      redirect('/reviewer/assignments');
      break;
    default:
      redirect('/');
  }
};

export function buildGoogleScholarLink(reference: string) {
  const query = encodeURIComponent(reference);
  return `https://scholar.google.com/scholar?q=${query}`;
}

export function buildPubMedLink(reference: string) {
  const query = encodeURIComponent(reference);
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${query}`;
}

export function extractDOI(reference: string): string | null {
  const doiRegex = /\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i;
  const match = reference.match(doiRegex);
  return match ? match[0] : null;
}

export function buildCrossRefLink(reference: string) {
  const doi = extractDOI(reference);
  return doi ? `https://doi.org/${doi}` : null;
}
