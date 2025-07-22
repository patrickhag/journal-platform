import { toast } from 'sonner';

export function downloadPublishedArticle(content: string, filename: string) {
  if (!content) {
    toast.error('PDF URL not available');
    return;
  }
  const link = document.createElement('a');
  link.href = content;
  link.download = filename + '.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
