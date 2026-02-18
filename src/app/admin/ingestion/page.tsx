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
  FormDescription,
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
    message: 'Raw data must be at least 10 characters.',
  }),
});

export default function IngestionPage() {
  const [isNormalizing, setIsNormalizing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    setIsNormalizing(true);
    setNormalizedData(null);
    try {
      const result = await normalizeIngestedBusinessData({
        rawBusinessData: values.rawData,
        sourceId: 'manual-ingestion-form',
      });
      setNormalizedData(result);
      toast({
        title: 'Normalization Successful',
        description: 'AI has processed and structured the business data.',
      });
    } catch (error) {
      console.error('Normalization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Normalization Failed',
        description:
          'An error occurred while processing the data. Please try again.',
      });
    } finally {
      setIsNormalizing(false);
    }
  }

  const handleSave = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Required", description: "You must be logged in to submit a business."});
        return;
    }
    if (!normalizedData || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'No data to save or database not available.'});
        return;
    }
    setIsSaving(true);
    try {
        const pendingCol = collection(firestore, 'pending_businesses');
        const dataToSave = {
            ...normalizedData,
            submittedBy: user.uid,
            submittedAt: serverTimestamp(),
            status: 'pending',
        }
        await addDocumentNonBlocking(pendingCol, dataToSave);
        toast({
            title: 'Business Submitted for Review',
            description: `${normalizedData.name_en} has been added to the moderation queue.`,
        });
        setNormalizedData(null);
        form.reset();
    } catch (e: any) {
         toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: e.message || "Could not submit business for review.",
        });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Data Entry</CardTitle>
          <CardDescription>
            Paste raw business data below. The AI will normalize it into a
            structured format.
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
                        placeholder={`Example:\n{\n  "name": "The Coffee Shop",\n  "location": "123 Main St, Doha",\n  "contact": "555-1234",\n  "type": "cafe"\n}`}
                        className="min-h-[200px] font-mono"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Can be JSON, plain text, or any other format.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isNormalizing || isSaving}>
                {isNormalizing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Normalize Data
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {normalizedData && (
        <Card>
          <CardHeader>
            <CardTitle>Normalized Output</CardTitle>
            <CardDescription>
              Review the structured data below. You can submit it for approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-secondary rounded-md text-sm overflow-x-auto">
              {JSON.stringify(normalizedData, null, 2)}
            </pre>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave} disabled={isSaving || isNormalizing}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
               Submit for Review
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
