'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, EyeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/status-badge';
import { useRouter } from 'next/navigation';

export interface Review {
  id: string;
  title: string | null;
  section: string;
  articleStatus?: string | null;
}

interface ReviewCardProps {
  a: Review;
  i: number;
}

export function ReviewCard({ a, i }: ReviewCardProps) {
  const router = useRouter();

  return (
    <Card key={a.id}>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex gap-6">
          <div className="flex items-center">
            <span className="text-xl font-medium text-muted-foreground">
              {(i + 1).toString().padStart(4, '0')}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center gap-1 font-medium">
              <FileText className="h-4 w-4 text-muted-foreground" />
              {a.section}
            </h3>
            <div className="text-mdm">{a.title}</div>
            <div className={`flex ${cn('mt-2')}`}>
              <StatusBadge status={a.articleStatus || 'SUBMITTED'} />
            </div>
          </div>
        </div>
        <Button
          variant={'outline'}
          className="flex items-center"
          // disabled={a.articleStatus === 'PUBLISHED'}
          onClick={() => router.push(`/articles/${a.id}`)}
        >
          <EyeIcon className="mr-1" />
          Review manuscript
        </Button>
      </CardContent>
    </Card>
  );
}
