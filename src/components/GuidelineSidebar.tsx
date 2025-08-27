'use client';

import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { TManuals } from '@/db/schema';

type Props = {
  manuals: TManuals;
};

const formatTitle = (key: string) => {
  switch (key) {
    case 'guidelines':
      return 'Guidelines';
    case 'policies':
      return 'Policies';
    case 'aboutUs':
      return 'About Us';
    case 'aimsNscope':
      return 'Aims and Scope';
    case 'termsNconditions':
      return 'Terms and conditions';
    default:
      return null;
  }
};

const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const offset = 80;
    const bodyTop = document.body.getBoundingClientRect().top;
    const elementTop = el.getBoundingClientRect().top;
    const scrollTarget = elementTop - bodyTop - offset;

    window.scrollTo({
      top: scrollTarget,
      behavior: 'smooth',
    });
  }
};

const LeftSideBar: React.FC<Props> = ({ manuals }) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = Object.keys(manuals || {}).filter(
    (key) => key !== 'id' && manuals[key as keyof TManuals]
  );

  useEffect(() => {
    const handleScroll = () => {
      for (const key of sections) {
        const el = document.getElementById(key);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <div className="lg:w-2/12">
      <aside className="sticky top-24 space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50">
        {sections.map((key) => {
          const isActive = activeSection === key;

          return (
            <button
              key={key}
              onClick={() => {
                scrollToSection(key);
                setActiveSection(key);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{formatTitle(key)}</span>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </button>
          );
        })}
      </aside>
    </div>
  );
};

export default LeftSideBar;
