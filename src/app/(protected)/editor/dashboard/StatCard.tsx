'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideProps } from 'lucide-react';
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from 'react';
import MetricsCardSkeleton from '../components/MetricsCardSkeleton';

interface StatCardProps {
  title: string;
  value: number;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  description?: string;
  trendValue?: string;
  className?: string;
  iconClassName?: string;
  isPending?: boolean;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  iconClassName,
  isPending,
}: StatCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setIsClient(true);

    // Animate the number count up
    const duration = 1000; // 1 second animation
    const steps = 20;
    const stepTime = duration / steps;
    const increment = value / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(timer);
      }
      setDisplayValue(Math.floor(current));
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return isPending ? (
    <MetricsCardSkeleton />
  ) : (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-full bg-muted/80', iconClassName)}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isClient ? displayValue.toLocaleString() : 'Loading...'}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
