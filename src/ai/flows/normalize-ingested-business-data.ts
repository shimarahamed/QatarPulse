'use server';

/**
 * @fileOverview A Genkit flow for normalizing raw business data into a canonical schema,
 * leveraging AI for intelligent mapping and transformation, and suggesting deduplication hints.
 *
 * - normalizeIngestedBusinessData - A function that handles the normalization process.
 * - NormalizeIngestedBusinessDataInput - The input type for the normalizeIngestedBusinessData function.
 * - NormalizeIngestedBusinessDataOutput - The return type for the normalizeIngestedBusinessData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// --- Tools for Category and Tag ID lookup ---

const getCategoryIds = ai.defineTool(
  {
    name: 'getCategoryIds',
    description: 'Looks up internal category IDs given a list of category names or keywords. Prioritize exact matches.',
    inputSchema: z.object({
      categoryNames: z.array(z.string()).describe('A list of category names or keywords extracted from the business data.'),
    }),
    outputSchema: z.array(z.string()).describe('A list of matching internal category IDs. Returns an empty array if no matches.'),
  },
  async (input) => {
    // In a real application, this would query a database (e.g., Firestore)
    // to map category names to predefined category IDs.
    // For this example, we'll provide some mock IDs.
    const mockCategoryMapping: Record<string, string> = {
      'restaurant': 'cat-food-101',
      'cafe': 'cat-food-102',
      'supermarket': 'cat-retail-201',
      'pharmacy': 'cat-health-301',
      'electronics': 'cat-retail-202',
      'services': 'cat-general-001',
      'automotive': 'cat-auto-501',
      'hospital': 'cat-health-302',
      'hotel': 'cat-travel-401',
      'spa': 'cat-wellness-601',
      'gym': 'cat-fitness-701',
      'bakery': 'cat-food-103',
      'fashion': 'cat-retail-203'
    };
    const matchedIds = input.categoryNames
      .map(name => name.toLowerCase().trim())
      .filter(name => mockCategoryMapping[name])
      .map(name => mockCategoryMapping[name]!);
    return Array.from(new Set(matchedIds)); // Ensure unique IDs
  }
);

const getTagIds = ai.defineTool(
  {
    name: 'getTagIds',
    description: 'Looks up internal tag IDs given a list of tag names or keywords. Prioritize exact matches.',
    inputSchema: z.object({
      tagNames: z.array(z.string()).describe('A list of tag names or keywords extracted from the business data.'),
    }),
    outputSchema: z.array(z.string()).describe('A list of matching internal tag IDs. Returns an empty array if no matches.'),
  },
  async (input) => {
    // In a real application, this would query a database (e.g., Firestore)
    // to map tag names to predefined tag IDs.
    // For this example, we'll provide some mock IDs.
    const mockTagMapping: Record<string, string> = {
      'delivery': 'tag-svc-001',
      'parking': 'tag-amenity-002',
      'wifi': 'tag-amenity-003',
      'outdoor seating': 'tag-amenity-004',
      'wheelchair access': 'tag-access-001',
      'takeaway': 'tag-svc-002',
      'halal': 'tag-food-001',
      'vegetarian options': 'tag-food-002',
      'kids friendly': 'tag-family-001',
      'pet friendly': 'tag-family-002',
      '24/7': 'tag-hours-001',
      'drive-thru': 'tag-svc-003'
    };
    const matchedIds = input.tagNames
      .map(name => name.toLowerCase().trim())
      .filter(name => mockTagMapping[name])
      .map(name => mockTagMapping[name]!);
    return Array.from(new Set(matchedIds)); // Ensure unique IDs
  }
);

// --- Input Schema ---

const NormalizeIngestedBusinessDataInputSchema = z.object({
  rawBusinessData: z.string().describe('The raw business data payload, potentially in various formats (JSON string, XML, plain text).'),
  sourceId: z.string().describe('The ID of the ingestion source for attribution.').optional(),
});
export type NormalizeIngestedBusinessDataInput = z.infer<typeof NormalizeIngestedBusinessDataInputSchema>;

// --- Output Schema ---

const NormalizeIngestedBusinessDataOutputSchema = z.object({
  name_en: z.string().describe('English name of the business.').optional(),
  name_ar: z.string().describe('Arabic name of the business.').optional(),
  description_en: z.string().describe('English description of the business.').optional(),
  description_ar: z.string().describe('Arabic description of the business.').optional(),
  category_ids: z.array(z.string()).describe('List of relevant category IDs for the business, resolved via tools.').optional(),
  tag_ids: z.array(z.string()).describe('List of relevant tag IDs for the business, resolved via tools.').optional(),
  address_en: z.string().describe('English address of the business.').optional(),
  address_ar: z.string().describe('Arabic address of the business.').optional(),
  geo: z.object({
    lat: z.number().describe('Latitude coordinate.'),
    lng: z.number().describe('Longitude coordinate.'),
  }).describe('Geographic coordinates of the business.').optional(),
  phone: z.string().describe('Primary phone number of the business.').optional(),
  whatsapp: z.string().describe('WhatsApp number of the business.').optional(),
  email: z.string().email().describe('Email address of the business.').optional(),
  website: z.string().url().describe('Website URL of the business.').optional(),
  social_links: z.array(z.object({
    platform: z.string().describe('Social media platform (e.g., Facebook, Instagram).'),
    url: z.string().url().describe('URL to the social media profile.'),
  })).describe('List of social media links.').optional(),
  opening_hours: z.object({
    monday: z.array(z.string()).describe('Monday opening hours, e.g., ["09:00-17:00"]').optional(),
    tuesday: z.array(z.string()).optional(),
    wednesday: z.array(z.string()).optional(),
    thursday: z.array(z.string()).optional(),
    friday: z.array(z.string()).optional(),
    saturday: z.array(z.string()).optional(),
    sunday: z.array(z.string()).optional(),
  }).describe('Structured weekly opening hours.').optional(),
  price_range: z.string().describe('Price range, e.g., "$", "$$", "$$$" or "Low", "Medium", "High".').optional(),
  services: z.array(z.string()).describe('List of services offered by the business.').optional(),
  attributes: z.array(z.string()).describe('List of business attributes (e.g., parking, delivery, wheelchair access).').optional(),
  photos: z.array(z.string().url()).describe('URLs of business photos.').optional(),
  deduplication_hints: z.object({
    normalized_phone: z.string().describe('A normalized primary phone number (e.g., +97455123456) for deduplication.').optional(),
    normalized_address_string: z.string().describe('A normalized address string (lowercase, no punctuation, trimmed) to generate a hash for geo-proximity deduplication.').optional(),
    normalized_name: z.string().describe('A normalized version of the business name (lowercase, no legal suffixes, trimmed) for similarity checks.').optional(),
  }).describe('Hints for downstream deduplication logic, generated by the AI for consistency.').optional(),
});
export type NormalizeIngestedBusinessDataOutput = z.infer<typeof NormalizeIngestedBusinessDataOutputSchema>;

// --- Wrapper Function ---

export async function normalizeIngestedBusinessData(input: NormalizeIngestedBusinessDataInput): Promise<NormalizeIngestedBusinessDataOutput> {
  return normalizeIngestedBusinessDataFlow(input);
}

// --- Genkit Prompt Definition ---

const normalizePrompt = ai.definePrompt({
  name: 'normalizeIngestedBusinessDataPrompt',
  input: { schema: NormalizeIngestedBusinessDataInputSchema },
  output: { schema: NormalizeIngestedBusinessDataOutputSchema },
  tools: [getCategoryIds, getTagIds],
  prompt: `You are an expert data normalization and extraction AI. Your task is to analyze raw business data from various sources and accurately transform it into a structured canonical schema.

Pay close attention to detail, especially for names, descriptions, and addresses, extracting both English and Arabic versions if available.
Infer categories and tags from the description, services, and other relevant text. *Crucially, after inferring potential category and tag names, use the provided \`getCategoryIds\` and \`getTagIds\` tools to obtain their respective internal IDs.* If no IDs are returned for inferred names, omit them from the final output.
Extract all contact information: phone, WhatsApp, email, and website.
Parse social media links into a structured array of platform and URL.
Convert opening hours into the specified structured weekly format. Each day can have multiple time slots if the business opens, closes, and reopens (e.g., ["09:00-12:00", "13:00-17:00"]).
Identify and list all services and relevant attributes.
If geographic coordinates (latitude and longitude) are explicitly present in the raw data or can be accurately inferred from a clear, complete address, include them. Do not hallucinate coordinates.
Extract URLs of business photos if provided.

After extracting the core business information, you must also provide \`deduplication_hints\`. These hints are crucial for identifying potential duplicate businesses in our database.
For \`normalized_phone\`, extract the primary phone number from the raw data and format it into a standardized international format (e.g., +97455123456), removing any spaces or special characters.
For \`normalized_address_string\`, extract the street address, city, and postal code (if available) into a single string. Convert this string to lowercase, and remove any punctuation or extra spaces. This standardized string will be used by our system to generate a hash for geo-proximity deduplication.
For \`normalized_name\`, extract the business name, convert it to lowercase, remove common legal suffixes (e.g., "LLC", "Co.", "Ltd."), and remove any leading/trailing spaces or special characters.

Here is the raw business data, which could be JSON, XML, or plain text:
{{{rawBusinessData}}}

Source ID: {{{sourceId}}}

Please output the normalized business data in JSON format, strictly adhering to the provided schema. Ensure all fields are correctly typed and formatted as per the schema definition. If a field cannot be extracted or is not applicable, omit it.
`,
});

// --- Genkit Flow Definition ---

const normalizeIngestedBusinessDataFlow = ai.defineFlow(
  {
    name: 'normalizeIngestedBusinessDataFlow',
    inputSchema: NormalizeIngestedBusinessDataInputSchema,
    outputSchema: NormalizeIngestedBusinessDataOutputSchema,
  },
  async (input) => {
    const {output} = await normalizePrompt(input);
    return output!;
  }
);
