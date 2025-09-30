'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdFormSchema, adSchema } from '@/lib/schemas';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import { useClearURL } from '@/components/ClearURL';
import { useCreateAdverts } from '@/hooks/useAds';
import Loader from '@/components/Loader';

interface CreateAdDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CreateAdDialog({ isOpen, setIsOpen }: CreateAdDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdFormSchema>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: '',
      linkUrl: '',
      isActive: true,
    },
  });

  const searchParams = useSearchParams();

  const filesValidation = safeParse({
    schema: filesSchema,
    input: new URLSearchParams(searchParams.toString()),
  });

  const clearURL = useClearURL();

  const files = filesValidation.data?.files || [];
  const fileIds = files.map((f) => f.publicId);
  const fileId = fileIds[0];

  const { mutate, isPending } = useCreateAdverts();

  const onSubmit = (data: AdFormSchema) => {
    const payload = {
      fileId,
      ...data,
    };
    mutate(payload, {
      onSuccess: () => {
        clearURL();
        setIsOpen(false);
      },
    });
  };

  const isActive = watch('isActive');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Ad</DialogTitle>
        </DialogHeader>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <DragAndDropFileInput />
          <FileList isEditNeeded={true} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Ad title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="linkUrl">Link URL</Label>
            <Input
              id="linkUrl"
              placeholder="Where the user will be redirected to."
              {...register('linkUrl')}
            />
            {errors.linkUrl && (
              <p className="text-sm text-red-500">{errors.linkUrl.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader text="Creating Ad..." /> : 'Create Ad'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
