'use client';

import { useFormStatus } from 'react-dom';
import { publishArticle } from '@/actions/publishArticle';
import { ARTICLE_STATUS } from '@/lib/consts';
import { Button } from '../ui/button';
import withPermissions from '../WithPermission';
import Loader from '../Loader';

function SubmitButton({
  status,
}: {
  status: (typeof ARTICLE_STATUS)[number] | null;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-4/5 mx-auto bg-green-500 hover:bg-green-600 mt-3"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? (
        <>
          <Loader />
          {status === 'Published' ? 'Unpublishing' : 'Publishing'} manuscript...
        </>
      ) : (
        <>{status === 'Published' ? 'Unpublish' : 'Publish'} this manuscript</>
      )}
    </Button>
  );
}

const PublishArticle = ({
  articleId,
  status,
}: {
  articleId: string;
  status: (typeof ARTICLE_STATUS)[number] | null;
}) => {
  async function handlePublish() {
    await publishArticle({
      articleId,
      status: status || 'Submitted',
    });
  }

  return (
    <form action={handlePublish} className="flex justify-center items-center">
      <SubmitButton status={status} />
    </form>
  );
};

export const Publish = withPermissions(PublishArticle);
