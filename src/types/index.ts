import { metadataSchema } from '@/components/upload/ContributorsForm';
import { reviewerSchema } from '@/schemas/reviewer';
import { User } from 'next-auth';
import { z } from 'zod';

export type CustomUser = User & {
  role: string;
};

export type SessionPayload = {
  userId: string | number;
  expiresAt: Date;
};

export type Metadata = z.infer<typeof metadataSchema>;

export type UpdateMetadataResponse = {
  status: number;
  message: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  status: 'Draft' | 'Published' | 'Archived';
  issueNumber: number;
  volumeId: string;
  publicationDate?: Date | undefined;
  volume: {
    id: string;
    volumeNumber: number;
  };
  articles: {
    id: string;
    section: string;
    metadata: {
      title: string;
      topics: string[];
    };
    user: {
      firstName: string;
      lastName: string;
    };
    contributors: {
      name: string;
    }[];
  }[];
};

export type PublshIssueType = {
  issueId: string;
  articleIds: string[];
};

export interface MessageResponse {
  message: string;
  error?: string;
}

export type VolumeType = {
  id: string;
  volumeNumber: number;
  title: string;
  description: string;
  year: number;
  status: 'Active' | 'Archived';
  issues: {
    id: string;
    title: string;
    description: string;
    status: 'Draft' | 'Published';
    issueNumber: number;
    publicationDate: string;
    articles: {
      id: string;
    }[];
  }[];
}[];

export type IArticle = {
  id: string;
  createdAt: string;
  updatedAt: string;
  articleStatus: string;
  acceptedAt: string;
  proofStatus:
    | 'AwaitingProof'
    | 'ProofUploaded'
    | 'AuthorResponded'
    | 'Finalized';
  proofNote?: string;
  proofFileUrl?: string[];
  user: {
    firstName: string;
    lastName: string;
    affiliation: string;
  };
  metadata: {
    title: string;
    prefix: string;
    abstract: string;
  };
  files: {
    publicId: string;
  }[];
};

export type EditorsPicks = {
  id: string;
  section: string;
  updatedAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
  };
  metadata: {
    title: string;
  };
}[];

export type TCollections = {
  id: string;
  title: string;
  slug: string;
  description: string;
  objective: string;
  sdgGoal: string;
  isFeatured: boolean;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: string;
  collectionArticles: {
    collectionId: string;
    articleId: string;
    articleSubmission: {
      articleStatus: string;
      metadata: {
        title: string;
      };
      user: {
        firstName: string;
        lastName: string;
      };
    };
  }[];
};

export type TReview =
  | {
      articleStatus: string | null;
      metadata: {
        title: string;
      };
      user: {
        firstName: true;
        lastName: true;
      };
      reviews: {
        message: string;
        status: string | null;
        articleId: string | null;
        id: string;
        userId: string;
        fileIds: string[];
        reviewedAt: string | null;
        user: {
          firstName: string;
          lastName: string;
          email: string;
        };
      }[];
      editorActions: {
        id: string;
      };
    }
  | undefined;

export type TReviewerAssignment = {
  id: string;
  assignedDate: string; // ISO date string
  dueDate: string; // ISO date string
  status: 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | string;
  article: {
    id: string;
    articleStatus:
      | 'SUBMITTED'
      | 'UNDER REVIEW'
      | 'ACCEPTED'
      | 'PUBLISHED'
      | string;
    metadata: {
      title: string;
      prefix: string;
    };
    user: {
      firstName: string;
      lastName: string;
    };
  };
}[];

export type TAssociateEditorAssignment = {
  id: string;
  assignedAt: string;
  articleSubmission: {
    id: string;
    articleStatus: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
    };
    metadata: {
      title: string;
      prefix: string;
    };
    reviews: {
      id: true;
    }[];
  };
};

export type TIssues = {
  id: string;
  issueNumber: number;
  volume: {
    id: string;
    year: number;
  };
};

export type TPublishedArticle = {
  id: string;
  doi: string;
  publishedAt: string;
  status: 'PUBLISHED' | string;
  pageRange: string;
  article: {
    id: string;
    metadata: {
      title: string;
      prefix: string;
    };
    user: {
      firstName: string;
      lastName: string;
    };
  };
  issue: {
    id: string;
    issueNumber: number;
    volume: {
      year: number;
    };
  };
};

export type ReviewersReview = {
  id: string;
  articleId: string;
  reviewedAt: string;
  status: string;
  message: string;
  fileIds: string[];
  user: {
    id: string;
    firstName: string;
    lastName: string;
    prefix: string | null;
    email: string;
  };
};

export type TArticlesReview = {
  id: string;
  articleStatus: string;
  metadata: {
    title: string;
  };
  reviews: ReviewersReview[];
};

type ArticleMetadata = {
  prefix: string;
  title: string;
  subtitle: string;
  abstract: string;
  topics: string[];
};

type Contributor = {
  name: string;
  salutation: string;
  affiliation: string;
  email: string;
  orcid: string;
};

type Author = {
  firstName: string;
  lastName: string;
  affiliation: string;
  email: string;
  orcid: string;
};

type Article = {
  id: string;
  section: string;
  user: Author;
  createdAt: string;
  acceptedAt: string;
  metadata: ArticleMetadata;
  contributors: Contributor[];
};

type PublishedIssue = {
  issueNumber: number;
  volume: {
    year: number;
  };
};

export type TPublication = {
  id: string;
  doi: string;
  publishedAt: string;
  pdfUrl: string;
  pageRange: string;
  slug: string;
  article: Article;
  issue: PublishedIssue;
};

export type TMetric = {
  views: number;
  downloads: number;
};

export type FormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type TMostViewed = {
  id: string;
  views: number;
  publishedArticle: {
    slug: string;
    article: {
      id: string;
      metadata: {
        title: string;
      };
    };
  };
}[];

export type TUserInfo = {
  id: string;
  role: 'NORMAL_USER';
  user: {
    id: string;
    firstName: string;
    lastName: string;
    affiliation: string;
    country: string;
    email: string;
    emailVerified: string;
    isActive: boolean;
    isPartOfEditorialBoard: boolean;
    password: string;
    avatar: string;
    orcid: string;
    bio: string;
    expertise: null | string;
    updatedAt: null | string;
    prefix: null | string;
    createdAt: string;
    articles: Array<{
      id: string;
      createdAt: string;
      articleStatus: string;
      metadata: {
        title: string;
      };
    }>;
    publishedArticles: Array<{
      id: string;
      publishedAt: string;
      slug: string;
      article: {
        id: string;
        metadata: {
          title: string;
        };
      };
    }>;
  };
};

export type TReviewers = {
  role: string;
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    affiliation: string;
    email: string;
    bio: string;
    expertise: string;
    prefix: string;
  };
}[];

export type PReview = {
  id: string;
  status: string;
  reviewedAt: string;
  message: string;
  fileIds: string[];
  article: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    metadata: {
      title: string;
      prefix: string;
    };
    authorRevisions: {
      message: string;
    };
  };
};

export type TReviewerInfo = {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    affiliation: string | null;
    expertise: string | null;
    prefix: string | null;
    reviews: {
      id: string;
    }[];
    reviewAssignments: {
      id: string;
      articleId: string;
      assignedDate: Date;
      dueDate: Date;
      article: {
        id: string;
        articleStatus: string;
        metadata: {
          title: string;
        };
      };
    }[];
  };
};

export type TUser = {
  id: string | null;
  firstName: string | null;
  affiliation: string | null;
  lastName: string | null;
  email: string | null;
  avatar: string | null;
  createdAt: string | null;
  role: string;
};

export type TSUser = {
  role: string;
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    orcid: string;
    expertise: string;
    country: string;
    affiliation: string;
    email: string;
    bio: string;
  };
};

export type TAssociateEditorAssignments = {
  id: string;
  assignedAt: string;
  dueDate: string;
  fileIds: string[] | null;
  message: string;
  staffEditor: {
    firstName: string;
    lastName: string;
    email: string;
  };
  articleSubmissions: {
    id: string;
    articleStatus: 'UNDER REVIEW' | string;
    metadata: {
      title: string;
    };
  };
};

export type TAssociateEditors = {
  id: string;
  role: string;
  userId: string;
  user: {
    id: string;
    prefix: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    affiliation: string | null;
    bio: string | null;
    expertise: string | null;
  };
};

export type TAssociateEditorCollection = {
  id: string;
  submittedAt: string;
  fileIds: string[];
  user: {
    firstName: string;
    lastName: string;
  };
};

export type TAssignment = {
  id: string;
  dueDate: string;
  article: {
    id: string;
    articleStatus: string;
    metadata: {
      title: string;
      prefix: string;
    };
    files: {
      publicId: string;
      originalName: string;
    }[];
    user: {
      firstName: string;
      lastName: string;
    };
    reviews: {
      id: string;
      fileIds: string[];
      message: string;
      status: string;
      reviewedAt: string; // ISO date string
    }[];
  };
};

export type TAssociateAssignment = {
  id: string;
  assignedAt: string;
  dueDate: string;
  message: string;
  articleSubmissions: {
    id: string;
    articleStatus: string;
    associateEditorCorrections: {
      fileIds: string[];
      submittedAt: string;
    }[];
    user: {
      firstName: string;
      lastName: string;
    };
    metadata: {
      prefix?: string;
      title: string;
    };
  };
};

export type Params = { articleId: string };

export type TAssociateEditorAssignmentsInfo = {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    affiliation: string;
    expertise: string;
    prefix: string | null;
    associateEditorAssignments: {
      id: string;
      articleId: string;
      assignedAt: Date;
      dueDate: Date;
      articleSubmissions: {
        articleStatus: string;
        metadata: {
          title: string;
        };
      };
    }[];
  };
};

export type TParticipants = {
  staffEditor: {
    firstName: string;
    lastName: string;
    prefix: string | null;
    expertise: string | null;
  } | null;
  reviewers: {
    id: string;
    status: string;
    user: {
      firstName: string;
      lastName: string;
      prefix: string | null;
      expertise: string | null;
    };
  }[];
  associateEditors: {
    id: string;
    status: string;
    user: {
      firstName: string;
      lastName: string;
      prefix: string | null;
      expertise: string | null;
    };
  }[];
};

export type AddReviewerFormValues = z.infer<typeof reviewerSchema>;
