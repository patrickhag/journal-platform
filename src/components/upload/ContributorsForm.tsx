import { z } from 'zod';
import NewContibutorForm from '../Contibutor';
import { Contributors } from '../Contributors';
import 'react-quill-new/dist/quill.snow.css';

export const metadataSchema = z.object({
  prefix: z
    .string({ required_error: 'Prefix must be provided' })
    .min(2, { message: 'Atleast 2 character are required' }),
  title: z
    .string({ required_error: 'Title must be provided' })
    .min(5, { message: 'Atleast 5 character are required' }),
  subtitle: z
    .string({ required_error: 'Subtitle must be provided' })
    .min(5, { message: 'Atleast 5 character are required' }),
  abstract: z
    .string({ required_error: 'Abstract must be provided' })
    .min(100, { message: 'Atleast 100 character are required' }),
});

export const ContributorsForm = () => {
  return (
    <>
      <div className="my-4">
        <h3 className="mb-2 text-lg font-semibold">Contributors</h3>
        <div className="overflow-x-auto">
          <Contributors />
        </div>
        <NewContibutorForm />
      </div>
    </>
  );
};
