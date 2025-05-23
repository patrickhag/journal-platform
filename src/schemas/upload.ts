import { COUNTRIES, SALUTATION } from '@/lib/consts';
import { z } from 'zod';

export const contributorFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  salutation: z.enum(SALUTATION, { message: 'Salutation is required.' }),
  country: z.enum(COUNTRIES, { message: 'Country is required.' }),
  email: z
    .string({ required_error: 'Please provide his/her email' })
    .email('Enter a valid email'),
  orcid: z.string().optional(),
  homepage: z.string().optional(),
  affiliation: z.string(),
  bio: z.string(),
  role: z.enum(['Author', 'Translator'], {
    required_error: 'Please select a role.',
  }),
});
