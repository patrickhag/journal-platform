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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import { useState } from 'react';
import { AdFormSchema, adSchema } from '@/lib/schemas';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import { FileList } from '@/components/upload/FileList';
import { safeParse } from 'zod-urlsearchparams';
import { filesSchema } from '@/schemas/reviewer';
import { useSearchParams } from 'next/navigation';
import { useClearURL } from '@/components/ClearURL';
import { useEditAd } from '@/hooks/useAds';
import Loader from '@/components/Loader';
import { TAd } from '@/db/schema';

interface EditAdDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  advert: TAd;
}

export function EditAdDialog({ isOpen, setIsOpen, advert }: EditAdDialogProps) {
  const [isDateOpen, setIsDateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdFormSchema>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: advert.title,
      linkUrl: advert.linkUrl,
      startDate: new Date(advert.startDate),
      endDate: new Date(advert.endDate),
      isActive: advert.isActive as boolean,
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

  const { mutate: editAd, isPending } = useEditAd();

  const onSubmit = (data: AdFormSchema) => {
    const payload = {
      ...data,
      fileId,
    };
    editAd(
      { advertId: advert.id, data: payload },
      {
        onSuccess: () => {
          clearURL();
          setIsOpen(false);
        },
      }
    );
  };

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isActive = watch('isActive');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild />
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Ad</DialogTitle>
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
              placeholder="https://example.com"
              {...register('linkUrl')}
            />
            {errors.linkUrl && (
              <p className="text-sm text-red-500">{errors.linkUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setValue('startDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-red-500">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setValue('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
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
              {isPending ? <Loader text="Editing Ad..." /> : 'Edit Ad'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
