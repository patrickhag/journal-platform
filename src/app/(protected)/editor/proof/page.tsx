import { ArticleCardProof } from '@/components/article/ArticleCardProof';

export default function ProofManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50 rounded-lg">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Proof Management</h1>
          <p className="mt-2 text-gray-600">
            Manage and track article proofs, communicate with authors, and
            finalize publications.
          </p>
          <ArticleCardProof />
        </div>
      </div>
    </div>
  );
}
