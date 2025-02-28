'use client';

import { redirect, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ARTICLE_STATUS, articleFilters } from '@/lib/consts';

export const ArticleFilters = () => {
  const s = useSearchParams();

  return (
    <>
      <Select
        onValueChange={(e) => {
          redirect(`/submissions?f=${e}`);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={s.get('f') || articleFilters[0]} />
        </SelectTrigger>
        <SelectContent>
          {articleFilters.map((a) => (
            <SelectItem value={a} key={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mx-3">
        <Select
          onValueChange={(e) => {
            redirect(`/submissions?status=${e}`);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={
                s.get('status') || ARTICLE_STATUS.find((a) => a === 'Submitted')
              }
            />
          </SelectTrigger>
          <SelectContent>
            {ARTICLE_STATUS.map((a) => (
              <SelectItem value={a} key={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
