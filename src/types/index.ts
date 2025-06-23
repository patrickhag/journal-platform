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
        };
      }[];
    }
  | undefined;
