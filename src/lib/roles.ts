export const USER_ROLES = [
  'NORMAL_USER',
  'CHIEF_EDITOR',
  'REVIEWER',
  'ASSOCIATE_EDITOR',
  'STAFF_EDITOR',
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
  | 'ADD_REVIEW' // New permission: Create a review
  | 'VIEW_REVIEWS' // New permission: View reviews
  | 'ARCHIVE_OWN_ARTICLE'
  | 'ACCEPT_ARTICLE'
  | 'REJECT_ARTICLE'
  | 'INVITE_REVIEWERS'
  | 'ASSIGN_REVIEWERS'
  | 'DEACTIVATE_USER'
  | 'CHANGE_ROLE'
  | 'VIEW_ALL_PARTICIPANTS';

type TPermission = {
  [role in (typeof USER_ROLES)[number]]: TPermissionItem[];
};

// Define permissions for each role
export const ROLE_PERMISSIONS: TPermission = {
  NORMAL_USER: [
    'VIEW_PUBLIC_ARTICLES',
    'VIEW_PUBLIC_ARTICLES',
    'ARCHIVE_OWN_ARTICLE',
    'CREATE_ARTICLE',
  ],
  CHIEF_EDITOR: [
    'VIEW_PUBLIC_ARTICLES',
    'UPDATE_JOURNAL',
    'DELETE_JOURNAL',
    'MANAGE_REVIEWERS',
    'UPDATE_REVIEW',
    'DELETE_REVIEW',
    'MANAGE_USERS',
    'ACCEPT_ARTICLE',
    'REJECT_ARTICLE',
    'VIEW_REVIEWS',
    'CHANGE_ROLE',
    'DEACTIVATE_USER',
    'VIEW_ALL_PARTICIPANTS',
  ],
  REVIEWER: [
    'VIEW_PUBLIC_ARTICLES',
    'ADD_REVIEW',
    'ARCHIVE_OWN_ARTICLE',
    'EDIT_OWN_ARTICLES',
    'DELETE_OWN_ARTICLES',
  ],
  ASSOCIATE_EDITOR: ['INVITE_REVIEWERS', 'ASSIGN_REVIEWERS', 'VIEW_REVIEWS'],
  STAFF_EDITOR: [
    'INVITE_REVIEWERS',
    'ASSIGN_REVIEWERS',
    'VIEW_REVIEWS',
    'VIEW_ALL_PARTICIPANTS',
  ],
};

export type TUserPermissions = {
  role: (typeof USER_ROLES)[number]; // User's role
};
