import { metadataSchema } from '@/components/upload/ContributorsForm';
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
};

export type TAssociateEditorAssignment = {
  id: string;
  assignedAt: string;
  articleSubmissions: {
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
  }[];
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
};

type Author = {
  firstName: true;
  lastName: true;
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
