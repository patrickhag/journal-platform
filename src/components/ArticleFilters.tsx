'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ARTICLE_STATUS, articleFilters } from '@/lib/consts';
import { useSession } from 'next-auth/react';
import { Dispatch, SetStateAction } from 'react';

export const ArticleFilters = ({
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<string>>;
}) => {
  const session = useSession();
  const userRole = session?.data?.user.role;

  return (
    <>
      <Select
        onValueChange={(e) => {
          console.log(e);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={
              userRole === 'NORMAL_USER' || userRole === 'CHIEF_EDITOR'
                ? 'My Articles'
                : 'Assigned to review'
            }
          />
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
            setSelectedValue(e);
          }}
          value={selectedValue}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={
                selectedValue || ARTICLE_STATUS.find((a) => a === 'Submitted')
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
