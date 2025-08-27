'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCreateContact, useCreateFeedback } from '@/hooks/useContacts';
import Loader from '@/components/Loader';

// Zod Schemas
const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  institution: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  feedbackType: z.string().min(1, 'Feedback type is required'),
  rating: z.string().optional(),
  feedbackMessage: z.string().min(1, 'Feedback message is required'),
});

export default function ContactFeedback() {
  const { data: session } = useSession();

  // Contact form
  const contactForm = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
      subject: '',
      message: '',
    },
  });

  // Feedback form
  const feedbackForm = useForm({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      feedbackType: '',
      rating: '',
      feedbackMessage: '',
    },
  });

  // Scroll to hash on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      }
    }
  }, []);

  const { mutate: createContactMutation, isPending: isCreatingContactPending } =
    useCreateContact();

  const { mutate, isPending } = useCreateFeedback();

  // Submit Handlers
  const handleContactSubmit = (values: z.infer<typeof contactSchema>) => {
    createContactMutation(values, {
      onSuccess: () => {
        contactForm.reset();
      },
    });
  };

  const handleFeedbackSubmit = (values: z.infer<typeof feedbackSchema>) => {
    mutate(values, {
      onSuccess: () => {
        feedbackForm.reset();
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column (Contact Info) */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground mb-8">
              Whether you're a researcher looking to submit your work, a reader
              with questions, or a potential collaborator, we'd love to hear
              from you.
            </p>
          </div>

          {/* Email Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">
                    Email Address
                  </h3>
                  <p className="text-muted-foreground">info@airpd.org</p>
                  <p className="text-muted-foreground">editor@journal.edu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Card */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">
                    Whatsapp Phone Number
                  </h3>
                  <a
                    href="https://wa.me/+250788589658"
                    target="_blank"
                    className="hover:text-blue-500"
                  >
                    +250788589658
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri, 9:00 AM - 5:00 PM EST
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Forms) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Form */}
          <Card id="contact" className="scroll-mt-24">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={contactForm.handleSubmit(handleContactSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      First Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      {...contactForm.register('firstName')}
                      placeholder="John"
                    />
                    {contactForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {contactForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>
                      Last Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      {...contactForm.register('lastName')}
                      placeholder="Doe"
                    />
                    {contactForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {contactForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>
                    Email Address <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    type="email"
                    {...contactForm.register('email')}
                    placeholder="johndoe@gmail"
                  />
                  {contactForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">
                      {contactForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Institution/Organization</Label>
                  <Input
                    {...contactForm.register('institution')}
                    placeholder="University of Rwanda"
                  />
                </div>

                <div>
                  <Label>
                    Subject <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    {...contactForm.register('subject')}
                    placeholder="Submitting a research"
                  />
                  {contactForm.formState.errors.subject && (
                    <p className="text-red-500 text-sm">
                      {contactForm.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    Message <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    rows={6}
                    {...contactForm.register('message')}
                    placeholder="Explain the reason you're sending this message..."
                  />
                  {contactForm.formState.errors.message && (
                    <p className="text-red-500 text-sm">
                      {contactForm.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant={'secondary'}
                  disabled={isCreatingContactPending}
                >
                  <Send className="w-4 h-4 mr-2" />{' '}
                  {isCreatingContactPending ? (
                    <Loader text="Sending..." />
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Feedback Form */}
          <Card id="feedback" className="scroll-mt-24">
            <CardHeader className="bg-muted/50">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                Leave Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form
                onSubmit={feedbackForm.handleSubmit(handleFeedbackSubmit)}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Name <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      {...feedbackForm.register('name')}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      type="email"
                      {...feedbackForm.register('email')}
                      placeholder="johndoe@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <Label>
                    Feedback Type <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      feedbackForm.setValue('feedbackType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select feedback type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="website">Website Issues</SelectItem>
                      <SelectItem value="submission">
                        Submission Process
                      </SelectItem>
                      <SelectItem value="review">Review Process</SelectItem>
                      <SelectItem value="editorial">
                        Editorial Services
                      </SelectItem>
                      <SelectItem value="suggestion">Suggestion</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                  {feedbackForm.formState.errors.feedbackType && (
                    <p className="text-red-500 text-sm">
                      {feedbackForm.formState.errors.feedbackType.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Overall Rating</Label>
                  <Select
                    onValueChange={(value) =>
                      feedbackForm.setValue('rating', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                      <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                      <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                      <SelectItem value="2">⭐⭐ Poor</SelectItem>
                      <SelectItem value="1">⭐ Very Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>
                    Your Feedback <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    rows={6}
                    {...feedbackForm.register('feedbackMessage')}
                    placeholder="Your feedback please..."
                  />
                  {feedbackForm.formState.errors.feedbackMessage && (
                    <p className="text-red-500 text-sm">
                      {feedbackForm.formState.errors.feedbackMessage.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  variant={'secondary'}
                  disabled={isPending}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />{' '}
                  {isPending ? (
                    <Loader text="Submitting..." />
                  ) : (
                    'Submit Feedback'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
