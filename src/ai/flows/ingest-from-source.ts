'use server';
/**
 * @fileOverview A Genkit flow for fetching data from a source URL and normalizing it.
 *
 * - ingestFromSource - A function that fetches data from a URL, then uses another AI flow to normalize it.
 * - IngestFromSourceInput - The input type for the ingestFromSource function.
 * - IngestFromSourceOutput - The return type for the ingestFromSource function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
    normalizeIngestedBusinessData,
    NormalizeIngestedBusinessDataOutput,
} from './normalize-ingested-business-data';

// --- Input Schema ---

const IngestFromSourceInputSchema = z.object({
  sourceUrl: z.string().describe('The URL of the data source to ingest from.'),
});
export type IngestFromSourceInput = z.infer<typeof IngestFromSourceInputSchema>;

// --- Output Schema ---

const IngestFromSourceOutputSchema = z.array(z.object({
  name_en: z.string().optional(),
  name_ar: z.string().optional(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  category_ids: z.array(z.string()).optional(),
  tag_ids: z.array(z.string()).optional(),
  address_en: z.string().optional(),
  address_ar: z.string().optional(),
  geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
}).passthrough()); // Use passthrough to allow fields from the normalization output

export type IngestFromSourceOutput = z.infer<typeof IngestFromSourceOutputSchema>;

// --- Wrapper Function ---

export async function ingestFromSource(input: IngestFromSourceInput): Promise<IngestFromSourceOutput> {
  return ingestFromSourceFlow(input);
}

// --- Genkit Flow Definition ---

const ingestFromSourceFlow = ai.defineFlow(
  {
    name: 'ingestFromSourceFlow',
    inputSchema: IngestFromSourceInputSchema,
    outputSchema: IngestFromSourceOutputSchema,
  },
  async (input) => {
    const controller = new AbortController();
    // Set a 30-second timeout for the fetch request, as Overpass API can be slow.
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(input.sourceUrl, { signal: controller.signal });
      clearTimeout(timeoutId); // Clear the timeout if the fetch completes in time

      if (!response.ok) {
        throw new Error(`Failed to fetch data from source: ${response.statusText}`);
      }
      const data = await response.json();

      if (!data.elements || !Array.isArray(data.elements)) {
        throw new Error("Invalid data format from source. Expected 'elements' array.");
      }
      
      const normalizedResults: NormalizeIngestedBusinessDataOutput[] = [];
      for (const element of data.elements) {
        if (!element.tags) {
            continue;
        }

        const rawDataString = JSON.stringify(element.tags);
        
        try {
            const normalized = await normalizeIngestedBusinessData({ rawBusinessData: rawDataString, sourceId: 'overpass-api-ingestion' });
            if (normalized) {
                normalizedResults.push(normalized);
            }
        } catch (e: any) {
            // Log the error for the individual item but continue processing the rest
            console.error(`Skipping an element due to normalization error: ${e.message}`);
        }
      }
      return normalizedResults;

    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('The data source timed out after 30 seconds. The server may be busy. Please try again later.');
        }
        // Re-throw the error to be caught by the client-side caller, which will log it in the job document.
        throw error;
    }
  }
);
