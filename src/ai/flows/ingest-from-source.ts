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
  sourceUrl: z.string().url().describe('The URL of the data source to ingest from.'),
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
    try {
      const response = await fetch(input.sourceUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data from source: ${response.statusText}`);
      }
      const data = await response.json();

      if (!data.elements || !Array.isArray(data.elements)) {
        throw new Error("Invalid data format from source. Expected 'elements' array.");
      }

      const normalizationPromises = data.elements.map((element: any) => {
        // The normalize flow expects a string. We'll pass the 'tags' object, which contains the core business info.
        if (!element.tags) return Promise.resolve(null);
        
        const rawDataString = JSON.stringify(element.tags);
        return normalizeIngestedBusinessData({ rawBusinessData: rawDataString, sourceId: 'overpass-api-ingestion' });
      });

      const normalizedResults = await Promise.all(normalizationPromises);

      // Filter out any null results from elements that had no tags
      return normalizedResults.filter((r): r is NormalizeIngestedBusinessDataOutput => r !== null);
    } catch (error: any) {
        console.error("Error in ingestFromSourceFlow: ", error);
        // Re-throw the error to be caught by the client-side caller
        throw new Error(error.message || 'An unexpected error occurred during ingestion.');
    }
  }
);
