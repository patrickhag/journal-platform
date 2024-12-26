import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React from 'react';

export default function SearchBar() {
  return (
    <div>
      <h1
        className="text-3xl font-bold text-center my-9"
        style={{ color: '#141A26' }}
      >
        JAEPH is calling for new manuscripts
      </h1>
      <div className="flex items-center border ml-[38%] border-gray-300 rounded-md px-3 py-2 shadow-sm w-80">
        <input
          type="text"
          placeholder="Search journals, authors, reviewers..."
          className="flex-1 outline-none border-none text-gray-700 placeholder-gray-400"
        />
        <button type="button">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
