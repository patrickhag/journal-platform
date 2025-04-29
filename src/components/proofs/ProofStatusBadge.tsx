import { IArticle } from '@/types';
import { Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: IArticle['proofStatus']) => {
  const statusConfig = {
    AwaitingProof: { color: 'bg-yellow-500', icon: Clock },
    ProofUploaded: { color: 'bg-blue-500', icon: FileText },
    AuthorResponded: { color: 'bg-purple-500', icon: AlertCircle },
    Finalized: { color: 'bg-green-500', icon: CheckCircle },
  };

  const { color, icon: Icon } = statusConfig[status];

  return (
    <Badge
      className={`${color} text-white flex gap-1 items-center hover:bg-none`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
};
