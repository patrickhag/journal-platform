'use server';

import { getPublishedVolumesOnly } from '@/actions/fetchIssuesNVolumes';
import { IssuesList } from './components/IssuesList';

type Volume = {
  id: string;
  volumeNumber: number;
  year: number;
  issues: {
    id: string;
    issueNumber: number;
    publicationDate: string | null;
    articles: {
      id: string;
    }[];
  }[];
};

async function IssuesPage() {
  // const { data: volumes, error } = await getPublishedVolumesOnly();
  // console.log("volumes:", volumes)

  const volumes: Volume[] = [
    {
      id: 'vol-1',
      volumeNumber: 1,
      year: 2022,
      issues: [
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 6,
          publicationDate: '2022-02-10',
          articles: [{ id: 'a-1' }, { id: 'a-2' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 7,
          publicationDate: '2022-03-15',
          articles: [{ id: 'a-3' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 2,
          publicationDate: '2022-01-05',
          articles: [{ id: 'a-4' }, { id: 'a-5' }, { id: 'a-6' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 11,
          publicationDate: '2022-10-01',
          articles: [{ id: 'a-7' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 4,
          publicationDate: '2022-02-28',
          articles: [{ id: 'a-8' }, { id: 'a-9' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 3,
          publicationDate: '2022-03-28',
          articles: [{ id: 'a-10' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 2,
          publicationDate: '2022-01-05',
          articles: [{ id: 'a-4' }, { id: 'a-5' }, { id: 'a-6' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 11,
          publicationDate: '2022-10-01',
          articles: [{ id: 'a-7' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 4,
          publicationDate: '2022-02-28',
          articles: [{ id: 'a-8' }, { id: 'a-9' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 3,
          publicationDate: '2022-03-28',
          articles: [{ id: 'a-10' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 2,
          publicationDate: '2022-01-05',
          articles: [{ id: 'a-4' }, { id: 'a-5' }, { id: 'a-6' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 11,
          publicationDate: '2022-10-01',
          articles: [{ id: 'a-7' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 4,
          publicationDate: '2022-02-28',
          articles: [{ id: 'a-8' }, { id: 'a-9' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 3,
          publicationDate: '2022-03-28',
          articles: [{ id: 'a-10' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 11,
          publicationDate: '2022-10-01',
          articles: [{ id: 'a-7' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 4,
          publicationDate: '2022-02-28',
          articles: [{ id: 'a-8' }, { id: 'a-9' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 3,
          publicationDate: '2022-03-28',
          articles: [{ id: 'a-10' }],
        },
      ],
    },
    {
      id: 'vol-2',
      volumeNumber: 2,
      year: 2023,
      issues: [
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 6,
          publicationDate: '2023-02-12',
          articles: [{ id: 'a-11' }, { id: 'a-12' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 7,
          publicationDate: '2023-03-18',
          articles: [{ id: 'a-13' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 2,
          publicationDate: '2023-01-08',
          articles: [{ id: 'a-14' }, { id: 'a-15' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 11,
          publicationDate: '2023-11-03',
          articles: [{ id: 'a-16' }, { id: 'a-17' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 4,
          publicationDate: '2023-02-25',
          articles: [{ id: 'a-18' }],
        },
        {
          id: '3056fdb3-2b1a-4104-a15a-e6b5d6f454f7',
          issueNumber: 3,
          publicationDate: '2022-05-28',
          articles: [{ id: 'a-19' }, { id: 'a-20' }],
        },
      ],
    },
    {
      id: 'vol-3',
      volumeNumber: 3,
      year: 2024,
      issues: [
        // {
        //   id: "v3-i6",
        //   issueNumber: 6,
        //   publicationDate: "2024-02-14",
        //   articles: [{ id: "a-21" }],
        // },
      ],
    },
  ];

  // if (error) {
  //   return <p>{error}</p>;
  // }

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
