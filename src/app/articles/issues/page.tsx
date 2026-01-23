'use server';

import { getPublishedVolumesOnly } from '@/actions/fetchIssuesNVolumes';
import { IssuesList } from './components/IssuesList';

async function IssuesPage() {
  const { data: volumes, error } = await getPublishedVolumesOnly();

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="md:col-span-2">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Archive</h2>
        {volumes?.map((volume) => (
          <IssuesList key={volume.id} volume={volume} />
        ))}
      </div>
    </div>
  );
}

export default IssuesPage;
