import { type ClassValue, clsx } from 'clsx';
import { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSectionImage = (section: string): string => {
  switch (section) {
    case 'Case study':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747135546/case-study_bgo0y0.jpg';

    case 'Case Report':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747135942/case-report_ag5oyy.jpg';

    case 'Narative Review':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747136065/narrative-review_voprgt.jpg';

    case 'Original Research':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747136666/original-study_fvljpd.jpg';

    case 'Meta Analysis':
      return 'https://res.cloudinary.com/demb9mspy/image/upload/v1747136864/meta-analysis_ysopis.jpg';

    case 'Systematic Review':
      return 'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp';

    default:
      return 'https://res.cloudinary.com/dwhfpxrgz/image/upload/v1732708303/old-books-wooden-table-library-vintage-style-ai-generated-content-design-background-instagram-facebook-wall-323974717_kbravu.webp';
  }
};

export const formatStatus = (status: string) => {
  return status
    .toLowerCase()
    .replace(/_/g, ' ') // Replace _ with space
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
};
