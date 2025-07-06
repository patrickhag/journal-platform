import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { editorialBoardMembers } from '@/db/schema';
import React, { useEffect, useState } from 'react';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

interface EditorialBoardMemberFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: InferSelectModel<typeof editorialBoardMembers> | null;
  onSubmit: (member: InferInsertModel<typeof editorialBoardMembers>) => void;
}

const EditorialBoardMemberFormModal: React.FC<
  EditorialBoardMemberFormModalProps
> = ({ isOpen, onClose, member, onSubmit }) => {
  const [formData, setFormData] = useState<
    Partial<InferInsertModel<typeof editorialBoardMembers>>
  >({
    fullName: '',
    affiliation: '',
    country: '',
    role: '',
    areasOfExpertise: '',
    photoUrl: '',
    orcidOrProfileUrl: '',
    isVisible: true,
  });

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName,
        affiliation: member.affiliation,
        country: member.country,
        role: member.role,
        areasOfExpertise: member.areasOfExpertise || '',
        photoUrl: member.photoUrl || '',
        orcidOrProfileUrl: member.orcidOrProfileUrl || '',
        isVisible: member.isVisible,
        id: member.id,
      });
    } else {
      setFormData({
        fullName: '',
        affiliation: '',
        country: '',
        role: '',
        areasOfExpertise: '',
        photoUrl: '',
        orcidOrProfileUrl: '',
        isVisible: true,
      });
    }
  }, [member]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, isVisible: e.target.checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as InferInsertModel<typeof editorialBoardMembers>);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {member
              ? 'Edit the details of the editorial board member.'
              : 'Add a new editorial board member.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="affiliation" className="text-right">
              Affiliation
            </Label>
            <Input
              id="affiliation"
              value={formData.affiliation || ''}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="country" className="text-right">
              Country
            </Label>
            <Input
              id="country"
              value={formData.country || ''}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              value={formData.role || ''}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="areasOfExpertise" className="text-right">
              Areas of Expertise
            </Label>
            <Textarea
              id="areasOfExpertise"
              value={formData.areasOfExpertise || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photoUrl" className="text-right">
              Photo URL
            </Label>
            <Input
              id="photoUrl"
              value={formData.photoUrl || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="orcidOrProfileUrl" className="text-right">
              ORCID / Profile URL
            </Label>
            <Input
              id="orcidOrProfileUrl"
              value={formData.orcidOrProfileUrl || ''}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isVisible" className="text-right">
              Visible
            </Label>
            <input
              type="checkbox"
              id="isVisible"
              checked={formData.isVisible}
              onChange={handleCheckboxChange}
              className="col-span-3"
            />
          </div>
          <Button type="submit">
            {member ? 'Save Changes' : 'Add Member'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditorialBoardMemberFormModal;
