import { ArticleCardProof } from '@/components/article/ArticleCardProof';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900">Proof Management</h1>
      <p className="mt-2 text-gray-600">
        Manage and track article proof, communicate with editors, and finalize
        publication.
      </p>
      <div>{children}</div>
    </>
  );
}
