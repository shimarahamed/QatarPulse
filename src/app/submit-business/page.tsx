'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  normalizeIngestedBusinessData,
  type NormalizeIngestedBusinessDataOutput,
} from '@/ai/flows/normalize-ingested-business-data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Send } from 'lucide-react';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  rawData: z.string().min(10, {
    message: 'Please provide at least 10 characters of business data.',
  }),
});

export default function SubmitBusinessPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [normalizedData, setNormalizedData] =
    useState<NormalizeIngestedBusinessDataOutput | null>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rawData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setNormalizedData(null);
    try {
      const result = await normalizeIngestedBusinessData({
        rawBusinessData: values.rawData,
        sourceId: 'public-submission-form',
      });
      setNormalizedData(result);
      toast({
        title: 'Analysis Complete',
        description: 'AI has processed and structured the business data. Please review before submitting.',
      });
    } catch (error) {
      console.error('Normalization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description:
          'An error occurred while processing the data. Please check the format and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmitForReview = async () => {
     if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to submit a business."
        });
        return;
    }
    if (!normalizedData || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'No data to submit or database not available.'});
        return;
    }
    setIsSubmitting(true);
    try {
        const pendingCol = collection(firestore, 'pending_businesses');
        const dataToSave = {
            ...normalizedData,
            submittedBy: user.uid,
            submittedAt: serverTimestamp(),
            status: 'pending', // Initial status
        }
        await addDocumentNonBlocking(pendingCol, dataToSave);
        toast({
          title: 'Submission Sent',
          description: 'Thank you! Your business submission is now pending review from our team.',
        });
        setNormalizedData(null);
        form.reset();

    } catch (e: any) {
         toast({
            variant: "destructive",
            title: "Submission Failed",
            description: e.message || "Could not submit business for review.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
       <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Add Your Business
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
         Reach thousands of potential customers. Add your business to QatarPulse for free.
        </p>
      </div>

    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>1. Paste Your Business Info</CardTitle>
          <CardDescription>
            Provide any details you have. It can be a link to a social media page, a Google Maps location, or just plain text with the name, address, and phone number. Our AI will do the rest.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <FormField
                control={form.control}
                name="rawData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raw Business Data</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Example:\n\nChai Halib at The Pearl\nPhone: +974 4444 1234\nWe serve the best karak in town!\nInstagram: @chaihalib.qa\nOpen Sat-Thu 7am-11pm`}
                        className="min-h-[200px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || isSubmitting}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Analyze Data
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {normalizedData && (
        <Card>
          <CardHeader>
            <CardTitle>2. Review and Submit</CardTitle>
            <CardDescription>
              Our AI has structured the data below. Please review it for accuracy. If everything looks correct, submit it for our team's final approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-secondary rounded-md text-sm overflow-x-auto">
              {JSON.stringify(normalizedData, null, 2)}
            </pre>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitForReview} disabled={isSubmitting || isLoading}>
               {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
               Submit for Review
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
    </div>
  );
}
