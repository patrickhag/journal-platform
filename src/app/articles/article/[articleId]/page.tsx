import LeftSideBar from '@/components/landingPage/leftSideBar';
import ArticleContent from './ArticleContent';

export default function PublicArticleView() {
  return (
    <div className="px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ArticleContent />
        </div>
        <LeftSideBar />
      </div>
    </div>
  );
}
