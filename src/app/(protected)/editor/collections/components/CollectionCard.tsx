'use client';

import { MoreHorizontal, FileText, Calendar, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { TCollections } from '@/types';
import { useState } from 'react';
import { EditCollectionModal } from './EditCollectionModal';
import { DeleteCollectionDialog } from './DeleteCollectionDialog';

interface CollectionCardProps {
  collection: TCollections;
}

const CollectionCard = ({ collection }: CollectionCardProps) => {
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const onClose = () => setOpen(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 group">
      {/* Thumbnail */}
      <div className="relative">
        <img
          src={collection.thumbnailUrl as string}
          alt={collection.title}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        {collection.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-blue-600 text-white text-xs">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
              {collection.title}
            </h3>
            <div className="flex items-center text-xs text-gray-500 space-x-2">
              <span>📚 Collection {collection.id.slice(0, 8)}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-gray-200 shadow-lg z-50"
            >
              <DropdownMenuItem
                className="hover:bg-gray-50"
                onClick={() => setOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Collection
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:bg-gray-50 text-red-600"
                onClick={() => setOpenDeleteDialog(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Collection
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {collection.description}
        </p>

        {/* Assigned User */}
        {collection.user && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="font-medium">Assigned to:</span>
            <span>
              {collection.user.firstName} {collection.user.lastName}
              {collection.user.affiliation &&
                ` (${collection.user.affiliation})`}
            </span>
          </div>
        )}

        {/* SDG Goal */}
        {collection.sdgGoal && (
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className="text-xs border-blue-200 text-blue-700 bg-blue-50"
            >
              SDG: {collection.sdgGoal}
            </Badge>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>{collection.collectionArticles.length} articles</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(collection.createdAt as Date).toLocaleDateString()}
              </span>
            </span>
          </div>
        </div>
      </div>

      <EditCollectionModal
        collection={collection}
        isOpen={open}
        onClose={onClose}
      />
      <DeleteCollectionDialog
        collectionId={collection.id}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
      />
    </div>
  );
};

export default CollectionCard;
