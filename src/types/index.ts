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
