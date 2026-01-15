import LeftSideBar from '@/components/landingPage/leftSideBar';
import { promises as fs } from 'fs';
import path from 'path';
import Markdown from 'react-markdown';

type Params = { slug: string };

const SomeManuals = async ({ params }: { params: Promise<Params> }) => {
  const { slug } = await params;

  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);
  const file = await fs.readFile(filePath, 'utf-8');

  return (
    <div className="px-4 md:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-9">
        <div className="lg:col-span-3 w-full">
          <div className="prose w-full max-w-none">
            <Markdown>{file}</Markdown>
          </div>
        </div>
        <LeftSideBar />
      </div>
    </div>
  );
};

export default SomeManuals;
