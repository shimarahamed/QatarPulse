'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { collection, serverTimestamp } from 'firebase/firestore';
import {
  addDocumentNonBlocking,
  useFirestore,
  useUser,
} from '@/firebase';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.displayName || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    if (!firestore) return;
    try {
      const messagesCollection = collection(firestore, 'contact_messages');
      await addDocumentNonBlocking(messagesCollection, {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: 'new',
        userId: user?.uid ?? null,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Message Sent',
        description: "Thanks for reaching out — we'll get back to you soon.",
      });
      reset({ name: user?.displayName || '', email: user?.email || '', subject: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact message', error);
      toast({
        title: 'Submission Failed',
        description: 'Could not send your message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Contact Us</CardTitle>
          <CardDescription>
            Have a question, feedback, or need support? Fill out the form
            below and we&apos;ll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="What is your message about?"
                {...register('subject')}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here."
                className="min-h-[120px]"
                {...register('message')}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>
            <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Message
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
