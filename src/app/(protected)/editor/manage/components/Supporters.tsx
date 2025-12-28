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

type Sponsor = {
  id: string;
  link: string;
  logo: string;
};

export default function Sponsors() {
  const { data: manualData } = useGetManuals();
  const { mutate: createManualMutation, isPending } = useCreateManuals();
  const searchParams = useSearchParams();
  const clearURL = useClearURL();

  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [sponsorLink, setSponsorLink] = useState('');
  const [logoFileId, setLogoFileId] = useState<string>('');

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);
  const currentLogoFileId = fileIds[0] || logoFileId;

  // Load sponsors from manualData
  useEffect(() => {
    if (manualData?.sponsors) {
      setSponsors(manualData.sponsors as Sponsor[]);
    }
  }, [manualData]);

  // Update logoFileId when file is uploaded
  useEffect(() => {
    if (currentLogoFileId && currentLogoFileId !== logoFileId) {
      setLogoFileId(currentLogoFileId);
    }
  }, [currentLogoFileId, logoFileId]);

  const handleOpenDialog = (sponsor?: Sponsor) => {
    if (sponsor) {
      setEditingSponsor(sponsor);
      setSponsorLink(sponsor.link);
      setLogoFileId(sponsor.logo);
    } else {
      setEditingSponsor(null);
      setSponsorLink('');
      setLogoFileId('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSponsor(null);
    setSponsorLink('');
    setLogoFileId('');
    clearURL();
  };

  const handleSave = () => {
    const logoToUse = currentLogoFileId || logoFileId;
    if (!sponsorLink.trim() || !logoToUse) {
      return;
    }

    let updatedSponsors: Sponsor[];

    if (editingSponsor) {
      // Update existing sponsor
      updatedSponsors = sponsors.map((s) =>
        s.id === editingSponsor.id
          ? { ...s, link: sponsorLink.trim(), logo: logoToUse }
          : s
      );
    } else {
      // Add new sponsor
      const newSponsor: Sponsor = {
        id: crypto.randomUUID(),
        link: sponsorLink.trim(),
        logo: logoToUse,
      };
      updatedSponsors = [...sponsors, newSponsor];
    }

    createManualMutation(
      { sponsors: updatedSponsors },
      {
        onSuccess: () => {
          setSponsors(updatedSponsors);
          handleCloseDialog();
        },
      }
    );
  };

  const handleDelete = (sponsorId: string) => {
    const updatedSponsors = sponsors.filter((s) => s.id !== sponsorId);
    createManualMutation(
      { sponsors: updatedSponsors },
      {
        onSuccess: () => {
          setSponsors(updatedSponsors);
        },
      }
    );
  };

  return (
    <TabsContent value="sponsors" className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Supporters</CardTitle>
              <CardDescription>
                Manage journal sponsors and their logos
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Sponsor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sponsors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sponsors added yet. Click &quot;Add Sponsor&quot; to get
              started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Logo</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsors.map((sponsor) => (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <img
                        src={sponsor.logo}
                        alt="Sponsor logo"
                        className="w-16 h-16 object-contain"
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href={sponsor.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate max-w-xs block"
                      >
                        {sponsor.link}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(sponsor)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sponsor.id)}
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
              {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="sponsorLink">Sponsor Link</Label>
              <Input
                id="sponsorLink"
                type="url"
                placeholder="https://example.com"
                value={sponsorLink}
                onChange={(e) => setSponsorLink(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the URL where the sponsor logo should link to
              </p>
            </div>

            <div>
              <Label htmlFor="logo">Logo</Label>
              <DragAndDropFileInput />
              <FileList isEditNeeded />
              {editingSponsor && logoFileId && !fileIds[0] && (
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
                  !sponsorLink.trim() ||
                  (!currentLogoFileId && !logoFileId)
                }
              >
                {isPending ? (
                  <Loader text="Saving..." />
                ) : editingSponsor ? (
                  'Update Sponsor'
                ) : (
                  'Add Sponsor'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
