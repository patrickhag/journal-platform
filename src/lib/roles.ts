export const USER_ROLES = [
  'NORMAL_USER',
  'CHIEF_EDITOR',
  'REVIEWER',
  'ADMIN',
] as const;
export type USER_ROLE = (typeof USER_ROLES)[number];
export type TPermissionItem =
  | 'DELETE_OWN_ARTICLES'
  | 'DELETE_OTHERS_ARTICLES'
  | 'VIEW_PUBLIC_ARTICLES'
  | 'CREATE_ARTICLE'
  | 'EDIT_OWN_ARTICLES'
  | 'EDIT_OTHERS_ARTICLES'
  | 'MANAGE_USERS'
  | 'PUBLISH_ARTICLES'
  | 'DELETE_JOURNAL' // New permission: Delete a journal
  | 'UPDATE_JOURNAL' // New permission: Update a journal
  | 'DELETE_CONTRIBUTOR' // New permission: Delete a contributor
  | 'INVITE_CONTRIBUTOR' // New permission: Invite a contributor
  | 'MANAGE_REVIEWERS' // New permission: CRUD for reviews
  | 'UPDATE_REVIEW' // New permission: Update a review
  | 'DELETE_REVIEW' // New permission: Delete a review
  | 'CREATE_REVIEW' // New permission: Create a review
  | 'VIEW_REVIEW' // New permission: View reviews
  | 'ARCHIVE_OWN_ARTICLE';

type TPermission = {
  [role in (typeof USER_ROLES)[number]]: TPermissionItem[];
};

// Define permissions for each role
export const ROLE_PERMISSIONS: TPermission = {
  NORMAL_USER: [
    'VIEW_PUBLIC_ARTICLES',
    'VIEW_REVIEW', // Normal users might have permission to view reviews of public articles
    'VIEW_PUBLIC_ARTICLES',
    'VIEW_REVIEW', // Reviewers can view reviews
    'ARCHIVE_OWN_ARTICLE', // Reviewers can view reviews
  ],
  CHIEF_EDITOR: [
    'VIEW_PUBLIC_ARTICLES',
    'CREATE_ARTICLE',
    'EDIT_OWN_ARTICLES',
    'DELETE_OWN_ARTICLES',
    'UPDATE_JOURNAL', // Editors can update journal content
    'DELETE_JOURNAL', // Editors can delete journals (maybe their own?)
    'MANAGE_REVIEWERS', // Editors can manage reviews (CRUD)
    'UPDATE_REVIEW', // Editors can update reviews
    'DELETE_REVIEW', // Editors can delete reviews
    'PUBLISH_ARTICLES', // Editors can publish articles
    'MANAGE_USERS',
  ],
  ADMIN: [
    'VIEW_PUBLIC_ARTICLES',
    'CREATE_ARTICLE',
    'EDIT_OWN_ARTICLES',
    'EDIT_OTHERS_ARTICLES',
    'DELETE_OWN_ARTICLES',
    'DELETE_OTHERS_ARTICLES',
    'PUBLISH_ARTICLES',
    'MANAGE_USERS',
    'DELETE_JOURNAL', // Admin can delete any journal
    'UPDATE_JOURNAL', // Admin can update any journal
    'DELETE_CONTRIBUTOR', // Admin can delete contributors
    'INVITE_CONTRIBUTOR', // Admin can invite contributors
    'MANAGE_REVIEWERS', // Admin can manage all reviews (CRUD for all reviews)
    'UPDATE_REVIEW', // Admin can update any review
    'DELETE_REVIEW', // Admin can delete any review
  ],
  REVIEWER: [
    'VIEW_PUBLIC_ARTICLES',
    'CREATE_REVIEW',
    'VIEW_REVIEW',
    'ARCHIVE_OWN_ARTICLE',
    'CREATE_ARTICLE',
    'EDIT_OWN_ARTICLES',
    'DELETE_OWN_ARTICLES',
  ],
};

export type TUserPermissions = {
  role: (typeof USER_ROLES)[number]; // User's role
};
