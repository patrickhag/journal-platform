'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { CreateAdDialog } from './components/CreateAdDialog';
import { useGetEditorAds } from '@/hooks/useAds';
import { EditAdDialog } from './components/EditAdDialog';
import { TAd } from '@/db/schema';
import Loader from '@/components/Loader';
import { DeleteAdDialog } from './components/DeleteAdDialog';

const ManageAds = () => {
  const { data: ads, isPending } = useGetEditorAds();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [editingAd, setEditingAd] = useState<TAd | null>(null);
  const [deletingAdId, setDeletingAdId] = useState('');

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Ads</h1>
            <p className="text-gray-600">
              Create and manage homepage advertisements
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Ad
          </Button>

          {isCreateOpen && (
            <CreateAdDialog isOpen={isCreateOpen} setIsOpen={setIsCreateOpen} />
          )}
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(ads) && ads.length <= 0 && (
                <p className="p-4">No adverts found.</p>
              )}
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading ...
                  </TableCell>
                </TableRow>
              ) : (
                ads?.map((ad) => (
                  <TableRow key={ad.id}>
                    <TableCell>
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ad.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {ad.linkUrl}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingAd(ad);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDeletingAdId(ad.id);
                            setIsDeleteDialog(true);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          {deletingAdId === ad.id ? (
                            <Loader />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {isEditDialogOpen && editingAd && (
        <EditAdDialog
          advert={editingAd}
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
        />
      )}
      {isDeleteDialog && (
        <DeleteAdDialog
          open={isDeleteDialog}
          adId={deletingAdId}
          onOpenChange={setIsDeleteDialog}
        />
      )}
    </>
  );
};

export default ManageAds;
