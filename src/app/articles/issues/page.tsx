import React from 'react';
import { IssuesList } from './components/IssuesList';

function IssuesPage() {
  return (
    <div className="md:col-span-2">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">All Issues</h2>
        <IssuesList />
      </div>
    </div>
  );
}

export default IssuesPage;
