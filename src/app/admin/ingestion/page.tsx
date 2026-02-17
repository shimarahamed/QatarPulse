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
import { Loader2, Sparkles, Save } from 'lucide-react';

const formSchema = z.object({
  rawData: z.string().min(10, {
    message: 'Raw data must be at least 10 characters.',
  }),
});

export default function IngestionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [normalizedData, setNormalizedData] =
    useState<NormalizeIngestedBusinessDataOutput | null>(null);
  const { toast } = useToast();

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
      setIsLoading(false);
    }
  }

  const handleSave = () => {
    // This is where you would save to Firestore
    toast({
      title: 'Save Requested',
      description: 'Saving to database is not implemented yet.',
    });
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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
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
              Review the structured data below. You can save it to the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-secondary rounded-md text-sm overflow-x-auto">
              {JSON.stringify(normalizedData, null, 2)}
            </pre>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Business
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
