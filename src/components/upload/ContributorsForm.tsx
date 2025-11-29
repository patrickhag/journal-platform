import { z } from 'zod';
import 'react-quill-new/dist/quill.snow.css';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import type { ManuscriptFormValues } from '@/app/(protected)/author/new-manuscript/schema';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { COUNTRIES, SALUTATION } from '@/lib/consts';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Trash2, User } from 'lucide-react';

export const metadataSchema = z.object({
  prefix: z
    .string({ required_error: 'Prefix must be provided' })
    .min(2, { message: 'Atleast 2 character are required' }),
  title: z
    .string({ required_error: 'Title must be provided' })
    .min(5, { message: 'Atleast 5 character are required' }),
  subtitle: z.string({ required_error: 'Subtitle must be provided' }),
  abstract: z
    .string({ required_error: 'Abstract must be provided' })
    .refine((value) => value.trim().split(/\s+/).length <= 300, {
      message: "Don't exceed 300 words",
    }),
  topics: z
    .array(z.string().min(3))
    .max(4, { message: 'You can add at most 4 keywords.' }),
});

export const ContributorsForm = () => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<ManuscriptFormValues>();

  const contributorsFieldArray = useFieldArray({
    control,
    name: 'contributors',
  });

  const contributors = watch('contributors');

  const addContributor = () => {
    contributorsFieldArray.append({
      name: '',
      salutation: SALUTATION[0],
      country: COUNTRIES[0],
      orcid: '',
      homepage: '',
      affiliation: '',
      bio: '',
      role: 'Author',
      email: '',
    });
  };

  const removeContributor = (index: number) => {
    contributorsFieldArray.remove(index);
  };

  return (
    <div className="my-4 space-y-6">
      {contributors?.map((contributor, index) => {
        const contributorErrors = (errors.contributors as any)?.[index] ?? {};

        return (
          <div
            key={index}
            className="space-y-6 rounded-xl border border-border bg-muted/40 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Contributor {index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Provide the contributor&apos;s details below.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => removeContributor(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove contributor</span>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`contributors.${index}.name`}>
                  Names <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`contributors.${index}.name`}
                  placeholder="Dr. John Smith (Include prefix if available)"
                  {...register(`contributors.${index}.name` as const)}
                />
                {contributorErrors?.name && (
                  <p className="text-xs text-destructive">
                    {contributorErrors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contributors.${index}.email`}>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`contributors.${index}.email`}
                  type="email"
                  placeholder="email@example.com"
                  {...register(`contributors.${index}.email` as const)}
                />
                {contributorErrors?.email && (
                  <p className="text-xs text-destructive">
                    {contributorErrors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Salutation</Label>
                <Controller
                  control={control}
                  name={`contributors.${index}.salutation`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select salutation" />
                      </SelectTrigger>
                      <SelectContent>
                        {SALUTATION.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {contributorErrors?.salutation && (
                  <p className="text-xs text-destructive">
                    {contributorErrors.salutation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Controller
                  control={control}
                  name={`contributors.${index}.country`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {contributorErrors?.country && (
                  <p className="text-xs text-destructive">
                    {contributorErrors.country.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contributors.${index}.orcid`}>ORCID ID</Label>
                <Input
                  id={`contributors.${index}.orcid`}
                  placeholder="0000-0000-0000-0000"
                  {...register(`contributors.${index}.orcid` as const)}
                />
                {contributorErrors?.orcid && (
                  <p className="text-xs text-destructive">
                    {contributorErrors.orcid.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contributors.${index}.homepage`}>
                  Homepage
                </Label>
                <Input
                  id={`contributors.${index}.homepage`}
                  placeholder="https://example.com"
                  {...register(`contributors.${index}.homepage` as const)}
                />
                {contributorErrors?.homepage && (
                  <p className="text-xs text-destructive">
                    {contributorErrors.homepage.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`contributors.${index}.affiliation`}>
                Affiliation <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`contributors.${index}.affiliation`}
                placeholder="Organization or institution"
                {...register(`contributors.${index}.affiliation` as const)}
              />
              {contributorErrors?.affiliation && (
                <p className="text-xs text-destructive">
                  {contributorErrors.affiliation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`contributors.${index}.bio`}>Bio</Label>
              <Textarea
                id={`contributors.${index}.bio`}
                placeholder="Short bio"
                className="min-h-[120px]"
                {...register(`contributors.${index}.bio` as const)}
              />
              {contributorErrors?.bio && (
                <p className="text-xs text-destructive">
                  {contributorErrors.bio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Controller
                control={control}
                name={`contributors.${index}.role`}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col gap-2"
                  >
                    {(['Author', 'Translator'] as const).map((role) => (
                      <div
                        key={role}
                        className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2"
                      >
                        <RadioGroupItem
                          value={role}
                          id={`contributors.${index}.role.${role}`}
                        />
                        <Label
                          htmlFor={`contributors.${index}.role.${role}`}
                          className="text-sm font-normal"
                        >
                          {role}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {contributorErrors?.role && (
                <p className="text-xs text-destructive">
                  {contributorErrors.role.message}
                </p>
              )}
            </div>
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={addContributor}>
        Add contributor
      </Button>
    </div>
  );
};
