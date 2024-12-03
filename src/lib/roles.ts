export const USER_ROLES = [
  "NORMAL_USER",
  "CHIEF_EDITOR",
  // "REVIEWER",
  "ADMIN"
] as const;
export type USER_ROLE = typeof USER_ROLES[number]
export type TPermissionItem =
  | 'DELETE_OWN_ARTICLES'
  | 'DELETE_OTHERS_ARTICLES'
  | 'VIEW_PUBLIC_ARTICLES'
  | 'CREATE_ARTICLE'
  | 'EDIT_OWN_ARTICLES'
  | 'EDIT_OTHERS_ARTICLES'
  | 'MANAGE_USERS'
  | 'PUBLISH_ARTICLES'
  | 'DELETE_JOURNAL'           // New permission: Delete a journal
  | 'UPDATE_JOURNAL'           // New permission: Update a journal
  | 'DELETE_CONTRIBUTOR'       // New permission: Delete a contributor
  | 'INVITE_CONTRIBUTOR'       // New permission: Invite a contributor
  | 'MANAGE_REVIEWS'           // New permission: CRUD for reviews
  | 'UPDATE_REVIEW'            // New permission: Update a review
  | 'DELETE_REVIEW'            // New permission: Delete a review
  | 'CREATE_REVIEW'            // New permission: Create a review
  | 'VIEW_REVIEW'              // New permission: View reviews

export type TPermission = {
  [role in typeof USER_ROLES[number]]: TPermissionItem[];
}

// Define permissions for each role
export const ROLE_PERMISSIONS: TPermission = {
  NORMAL_USER: [
    "VIEW_PUBLIC_ARTICLES",
    "VIEW_REVIEW", // Normal users might have permission to view reviews of public articles
    "VIEW_PUBLIC_ARTICLES",
    "CREATE_REVIEW",     // Reviewers can create reviews for articles they are reviewing
    "UPDATE_REVIEW",     // Reviewers can update their reviews
    "DELETE_REVIEW",     // Reviewers can delete their reviews
    "VIEW_REVIEW"        // Reviewers can view reviews
  ],
  EDITOR: [
    "VIEW_PUBLIC_ARTICLES",
    "CREATE_ARTICLE",
    "EDIT_OWN_ARTICLES",
    "DELETE_OWN_ARTICLES",
    "UPDATE_JOURNAL",    // Editors can update journal content
    "DELETE_JOURNAL",    // Editors can delete journals (maybe their own?)
    "MANAGE_REVIEWS",    // Editors can manage reviews (CRUD)
    "CREATE_REVIEW",     // Editors can create new reviews
    "UPDATE_REVIEW",     // Editors can update reviews
    "DELETE_REVIEW",     // Editors can delete reviews
    "PUBLISH_ARTICLES"   // Editors can publish articles
  ],
  ADMIN: [
    "VIEW_PUBLIC_ARTICLES",
    "CREATE_ARTICLE",
    "EDIT_OWN_ARTICLES",
    "EDIT_OTHERS_ARTICLES",
    "DELETE_OWN_ARTICLES",
    "DELETE_OTHERS_ARTICLES",
    "PUBLISH_ARTICLES",
    "MANAGE_USERS",
    "DELETE_JOURNAL",     // Admin can delete any journal
    "UPDATE_JOURNAL",     // Admin can update any journal
    "DELETE_CONTRIBUTOR", // Admin can delete contributors
    "INVITE_CONTRIBUTOR", // Admin can invite contributors
    "MANAGE_REVIEWS",     // Admin can manage all reviews (CRUD for all reviews)
    "CREATE_REVIEW",      // Admin can create any review
    "UPDATE_REVIEW",      // Admin can update any review
    "DELETE_REVIEW"       // Admin can delete any review
  ]
};

export type TUserPermissions = {
  role: typeof USER_ROLES[number]; // User's role
};
