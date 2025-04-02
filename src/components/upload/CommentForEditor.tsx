'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export const CommentForEditor = () => {
  const params = useSearchParams();
  const newParams = new URLSearchParams(params);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <ReactQuill
      theme="snow"
      className="h-32 mb-4 rounded-md"
      value={newParams.get('Comments for the editor') || ''}
      onBlur={() => {
        router.replace(`${pathname}?${newParams?.toString()}`);
      }}
      onChange={(e) => {
        newParams.delete('Comments for the editor');
        newParams.set('Comments for the editor', e);
      }}
    />
  );
};
