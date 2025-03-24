import { metadataSchema } from '@/components/upload/ContributorsForm';
import { User } from 'next-auth';
import { z } from 'zod';

export type CustomUser = User & {
  role: string;
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
  volume: {
    id: string;
    volumeNumber: number;
  };
  articles: {
    id: string;
    section: string;
    metadata: {
      title: string;
    };
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
};

export type PublshIssueType = {
  issueId: string;
  articleIds: string[];
};

export interface IssueResponse {
  message: string;
}
