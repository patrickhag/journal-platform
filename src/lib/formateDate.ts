import { format } from 'date-fns';

export const DateFormatter = (parsedDate: string | null | Date) => {
  parsedDate = new Date();
  const formattedDate = format(parsedDate, 'MMMM d, yyyy');
  return formattedDate;
};

export const grabYear = (parsedDate: string | null | Date) => {
  parsedDate = new Date();
  const formattedDate = format(parsedDate, 'yyyy');
  return formattedDate;
};
