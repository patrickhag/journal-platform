import { Loader2 } from 'lucide-react';

export default function Loader({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin" />
      <p className="ml-3">{text}</p>
    </div>
  );
}
