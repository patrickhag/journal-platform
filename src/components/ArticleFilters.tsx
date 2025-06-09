'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ARTICLE_STATUS, articleFilters } from '@/lib/consts';
import { Dispatch, SetStateAction } from 'react';

export const ArticleFilters = ({
  selectedValue,
  setSelectedValue,
}: {
  selectedValue: string;
  setSelectedValue: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="My articles" />
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
              placeholder={selectedValue ? selectedValue : 'All Status'}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
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
