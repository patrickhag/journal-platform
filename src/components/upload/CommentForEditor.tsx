'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { RichTextEditor } from '../RichTextEditor';
import { useCallback, useEffect, useState } from 'react';

export const CommentForEditor = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [content, setContent] = useState(
    params.get('Comments for the editor') || ''
  );

  useEffect(() => {
    setContent(params.get('Comments for the editor') || '');
  }, [params]);

  const debouncedUpdateURL = useCallback(
    (value: string) => {
      const newParams = new URLSearchParams(params);
      newParams.delete('Comments for the editor');
      newParams.set('Comments for the editor', value);
      router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [params, pathname, router]
  );

  const handleChange = (value: string) => {
    setContent(value);
    const timeoutId = setTimeout(() => {
      debouncedUpdateURL(value);
    }, 3000);

    return () => clearTimeout(timeoutId);
  };

  return (
    <RichTextEditor
      description={content}
      onChange={handleChange}
      placeholder="Add any specific comments or notes for the editor here..."
    />
  );
};
