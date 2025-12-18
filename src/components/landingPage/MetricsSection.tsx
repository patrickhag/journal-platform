'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { useGetMetricsInteractions } from '@/hooks/useMetrics';
import { useGetManuals } from '@/hooks/useSettings';

export function MetricsSection() {
  const { data: metricsData } = useGetMetricsInteractions();
  const { data: manualData } = useGetManuals();

  const totalInteractions = metricsData?.totalInteractions ?? 0;

  const generalSettings = manualData?.generalSettings as {
    journalImpactFactor?: string;
    downloads?: string;
    submissionToFirstDecision?: string;
  } | null;

  // Use real data from generalSettings, fallback to actual metrics if not set
  const journalImpactFactor = generalSettings?.journalImpactFactor || 'Not set';
  const downloads = generalSettings?.downloads
    ? parseInt(generalSettings.downloads).toLocaleString()
    : totalInteractions.toLocaleString();
  const submissionToFirstDecision =
    generalSettings?.submissionToFirstDecision || 'Not set';

  const metrics = [
    { label: 'Publishing model', value: 'Open access' },
    {
      label: 'Journal Impact Factor',
      value: journalImpactFactor,
    },
    {
      label: 'Downloads',
      value: downloads,
    },
    {
      label: 'Submission to first decision',
      value: submissionToFirstDecision,
      sub: '(median)',
    },
  ];

  return (
    <Card className="w-full max-w-xs rounded-xl shadow-sm">
      <CardContent className="p-3">
        <div className="space-y-2">
          {metrics.map((item, index) => (
            <div key={index}>
              <div className="flex items-start justify-between gap-2 border-b last:border-b-0 pb-2 last:pb-0">
                <div className="text-xs text-muted-foreground leading-snug">
                  {item.label}
                  {item.sub && (
                    <span className="block text-[10px]">{item.sub}</span>
                  )}
                </div>
                <div className="text-xs font-medium text-right whitespace-nowrap">
                  {item.value}
                </div>
              </div>
              {index === 0 && (
                <div className="pt-2 pb-2 border-b">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src="/open-access-logo.png"
                      alt="Open Access"
                      width={280}
                      height={60}
                      className="w-full h-auto rounded-lg object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
