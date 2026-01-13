'use client';

import { useState, useEffect } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCreateManuals, useGetManuals } from '@/hooks/useSettings';
import Loader from '@/components/Loader';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { useSearchParams } from 'next/navigation';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useClearURL } from '@/components/ClearURL';

type Supporter = {
  id: string;
  link: string;
  logo: string;
  name: string;
};

export default function Supporters() {
  const { data: manualData } = useGetManuals();
  const { mutate: createManualMutation, isPending } = useCreateManuals();
  const searchParams = useSearchParams();
  const clearURL = useClearURL();

  const [supporters, setSupporters] = useState<Supporter[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupporter, setEditingSupporter] = useState<Supporter | null>(
    null
  );
  const [supporterLink, setSupporterLink] = useState('');
  const [supporterName, setSupporterName] = useState('');
  const [logoFileId, setLogoFileId] = useState<string>('');

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);
  const currentLogoFileId = fileIds[0] || logoFileId;

  // Load supporters from manualData
  useEffect(() => {
    if (manualData?.sponsors) {
      setSupporters(manualData?.sponsors);
    }
  }, [manualData?.sponsors]);

  // Update logoFileId when file is uploaded
  useEffect(() => {
    if (currentLogoFileId && currentLogoFileId !== logoFileId) {
      setLogoFileId(currentLogoFileId);
    }
  }, [currentLogoFileId, logoFileId]);

  const handleOpenDialog = (supporter?: Supporter) => {
    if (supporter) {
      setEditingSupporter(supporter);
      setSupporterLink(supporter.link);
      setSupporterName(supporter.name);
      setLogoFileId(supporter.logo);
    } else {
      setEditingSupporter(null);
      setSupporterLink('');
      setSupporterName('');
      setLogoFileId('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSupporter(null);
    setSupporterLink('');
    setSupporterName('');
    setLogoFileId('');
    clearURL();
  };

  const handleSave = () => {
    const logoToUse = currentLogoFileId || logoFileId;
    if (!supporterLink.trim() || !logoToUse) {
      return;
    }

    let updatedSupporters: Supporter[];

    if (editingSupporter) {
      // Update existing supporter
      updatedSupporters = supporters.map((s) =>
        s.id === editingSupporter.id
          ? { ...s, link: supporterLink.trim(), logo: logoToUse }
          : s
      );
    } else {
      // Add new supporter
      const newSupporter: Supporter = {
        id: crypto.randomUUID(),
        link: supporterLink.trim(),
        logo: logoToUse,
        name: supporterName,
      };
      updatedSupporters = [...supporters, newSupporter];
    }
    createManualMutation(
      { sponsors: updatedSupporters },
      {
        onSuccess: () => {
          setSupporters(updatedSupporters);
          handleCloseDialog();
        },
      }
    );
  };

  const handleDelete = (supporterId: string) => {
    const updatedSupporters = supporters.filter((s) => s.id !== supporterId);
    createManualMutation(
      { sponsors: updatedSupporters },
      {
        onSuccess: () => {
          setSupporters(updatedSupporters);
        },
      }
    );
  };

  return (
    <TabsContent value="supporters" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Supporters</CardTitle>
              <CardDescription>
                Manage journal supporters and their logos
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supporter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {supporters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No supporters added yet. Click &quot;Add Supporter&quot; to get
              started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supporters.map((supporter) => (
                  <TableRow key={supporter.id}>
                    <TableCell>
                      <img
                        src={supporter.logo}
                        alt="Supporter logo"
                        className="w-16 h-16 object-contain"
                      />
                    </TableCell>
                    <TableCell>{supporter.name}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(supporter)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(supporter.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSupporter ? 'Edit Supporter' : 'Add New Supporter'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="supporterName">Name of the supporter</Label>
              <Input
                id="supporterName"
                type="text"
                placeholder="Crossref"
                value={supporterName}
                onChange={(e) => setSupporterName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="supporterLink">Supporter Link</Label>
              <Input
                id="supporterLink"
                type="url"
                placeholder="https://crossref.org"
                value={supporterLink}
                onChange={(e) => setSupporterLink(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="logo">Logo</Label>
              <DragAndDropFileInput />
              <FileList isEditNeeded />
              {editingSupporter && logoFileId && !fileIds[0] && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Current logo:</p>
                  <img
                    src={logoFileId}
                    alt="Current logo"
                    className="w-32 h-32 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={
                  isPending ||
                  !supporterLink.trim() ||
                  (!currentLogoFileId && !logoFileId)
                }
              >
                {isPending ? (
                  <Loader text="Saving..." />
                ) : editingSupporter ? (
                  'Update Supporter'
                ) : (
                  'Add Supporter'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
