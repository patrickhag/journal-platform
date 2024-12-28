import { Button } from '@/components/ui/button';
import { NewMetaForm } from '@/components/upload/NewMetaForm';
import { db, metadata } from '@/db/schema';
import { eq } from 'drizzle-orm';

const MetaUpdate = async ({
  params,
}: {
  params: Promise<{ articleId: string[] }>;
}) => {
  const parameters = await params;
  const [articleId] = parameters.articleId;
  const meta = await db
    .select()
    .from(metadata)
    .where(eq(metadata.articleId, articleId))
    .limit(1);
  return (
    <div className="container mx-auto mt-4">
      <NewMetaForm meta={meta[0]}>
        <div className="mt-12">
          <Button>save updates</Button>
        </div>
      </NewMetaForm>
    </div>
  );
};

export default MetaUpdate;
