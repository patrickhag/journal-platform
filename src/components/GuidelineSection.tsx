'use client';

import React, { useRef } from 'react';

interface GuidelineSectionProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function GuidelineSection({
  id,
  title,
  description,
  children,
}: GuidelineSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div id={id} ref={sectionRef} className="animate-fadeIn scroll-mt-24">
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">
          {title}
        </h1>
        <p className="text-lg text-gray-600">{description}</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
