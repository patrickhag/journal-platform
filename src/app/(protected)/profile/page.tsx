'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { COUNTRIES, SALUTATION } from '@/lib/consts';
import { useSession } from 'next-auth/react';
import { useGetUserInfo, useUpdateUserProfile } from '@/hooks/useUsers';
import { DragAndDropFileInput } from '@/components/upload/FileInput';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PutBlobResult } from '@vercel/blob';
import { profileSchema } from '@/lib/schemas';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';

export default function ProfileSettings() {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id || '';
  const { data: userInfo, isLoading: isUserLoading } = useGetUserInfo(userId);
  const updateProfile = useUpdateUserProfile(userId);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const isLoading = form.formState.isSubmitting || updateProfile.isPending;
  const firstName = form.watch('firstName') || '';
  const lastName = form.watch('lastName') || '';
  const avatar = form.watch('avatar') || '';

  useEffect(() => {
    if (!userInfo?.user) return;

    form.reset({
      prefix: userInfo.user.prefix || SALUTATION[0],
      firstName: userInfo.user.firstName || '',
      lastName: userInfo.user.lastName || '',
      email: userInfo.user.email || '',
      affiliation: userInfo.user.affiliation || '',
      country: userInfo.user.country || '',
      orcid: userInfo.user.orcid || '',
      bio: userInfo.user.bio || '',
      expertise: userInfo.user.expertise || '',
      avatar: userInfo.user.avatar || '',
    });
  }, [form, userInfo]);

  const handleSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!userId) return;
    await updateProfile.mutateAsync({
      prefix: values.prefix,
      firstName: values.firstName,
      lastName: values.lastName,
      affiliation: values.affiliation,
      country: values.country,
      orcid: values.orcid,
      bio: values.bio,
      expertise: values.expertise,
      avatar: values.avatar,
    });
  };

  const handleAvatarUpload = () => {
    setIsAvatarDialogOpen(true);
  };

  const handleAvatarUploaded = async (blobs: PutBlobResult[]) => {
    const uploadedUrl = blobs[0]?.url;
    if (!uploadedUrl || !userId) return;

    form.setValue('avatar', uploadedUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });

    const values = form.getValues();
    await updateProfile.mutateAsync({
      prefix: values.prefix,
      firstName: values.firstName,
      lastName: values.lastName,
      affiliation: values.affiliation,
      country: values.country,
      orcid: values.orcid,
      bio: values.bio,
      expertise: values.expertise,
      avatar: uploadedUrl,
    });

    setIsAvatarDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="outline" className="mb-3">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and preferences
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatar} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {firstName[0] || '?'}
                    {lastName[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAvatarUpload}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Update Your Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Dialog
            open={isAvatarDialogOpen}
            onOpenChange={setIsAvatarDialogOpen}
          >
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload profile photo</DialogTitle>
                <DialogDescription>
                  Choose a clear, square image (JPG/PNG/GIF). Max size 2MB.
                </DialogDescription>
              </DialogHeader>
              <DragAndDropFileInput
                onUploadComplete={handleAvatarUploaded}
                dropzoneOptions={{
                  maxFiles: 1,
                  maxSize: 1024 * 1024 * 2,
                  multiple: false,
                  accept: {
                    'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
                  },
                }}
              />
            </DialogContent>
          </Dialog>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prefix</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select prefix" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SALUTATION.map((prefix) => (
                            <SelectItem key={prefix} value={prefix}>
                              {prefix}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled
                        className="bg-muted"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Email cannot be changed. Contact support if you need to
                      update it.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="affiliation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affiliation / Institution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your institution"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-64">
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>
                Your academic and research details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="orcid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ORCID ID</FormLabel>
                    <FormControl>
                      <Input placeholder="0000-0000-0000-0000" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your ORCID iD uniquely identifies you as a researcher.{' '}
                      <a
                        href="https://orcid.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Get an ORCID
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Areas of Expertise</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Machine Learning, Data Science, Neural Networks"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate multiple areas with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself and your research interests..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of your background and research
                      interests
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isUserLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isUserLoading}>
              {isLoading ? (
                <Loader text="Saving..." />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
