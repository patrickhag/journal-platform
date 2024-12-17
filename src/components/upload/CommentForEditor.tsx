'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
export const CommentForEditor = () => {
  const params = useSearchParams();
  const newParams = new URLSearchParams(params);
  const pathname = usePathname();
  const router = useRouter();

  const [val, setval] = useState('')
  return (
    <ReactQuill
      theme="snow"
      className="h-32 mb-4"
      value={val}
      onBlur={() => {
        newParams.delete('Comments for the editor');
        newParams.set('Comments for the editor', val);
        router.push(`${pathname}?${newParams?.toString()}`);
      }}
      onChange={(e) => {
        setval(e);
      }}
    />
  );
};
