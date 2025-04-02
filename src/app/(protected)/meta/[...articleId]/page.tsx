import { Button } from '@/components/ui/button';
import { NewMetaForm } from '@/components/upload/NewMetaForm';
import { db, metadata } from '@/db/schema';
import { eq } from 'drizzle-orm';
interface MetaFormProps {
  prefix: string;
  title: string;
  subtitle: string;
  abstract: string;
  topics: string[];
}

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

  // Transform DB data to match form props
  const formData: MetaFormProps = {
    prefix: meta[0].prefix,
    title: meta[0].title,
    subtitle: meta[0].subtitle ?? '',
    abstract: meta[0].abstract,
    topics: meta[0].topics,
  };

  return (
    <div className="container mx-auto mt-4">
      <NewMetaForm meta={formData}>
        <div className="mt-12">
          <Button>save updates</Button>
        </div>
      </NewMetaForm>
    </div>
  );
};

export default MetaUpdate;
