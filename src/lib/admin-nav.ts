'use server';
/**
 * @fileOverview A Genkit flow for detecting potential duplicate business listings.
 *
 * - detectDuplicateBusinesses - A function that handles the process of detecting duplicate businesses.
 * - DetectDuplicateBusinessesInput - The input type for the detectDuplicateBusinesses function.
 * - DetectDuplicateBusinessesOutput - The return type for the detectDuplicateBusinesses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const BusinessDetailSchema = z.object({
  id: z.string().describe('Unique identifier for the business.'),
  name_en: z.string().optional().describe('English name of the business.'),
  name_ar: z.string().optional().describe('Arabic name of the business.'),
  address_en: z.string().optional().describe('English address of the business.'),
  address_ar: z.string().optional().describe('Arabic address of the business.'),
  phone: z.string().optional().describe('Phone number of the business.'),
  email: z.string().optional().describe('Email address of the business.'),
  website: z.string().optional().describe('Website URL of the business.'),
  geo: z.object({
    lat: z.number().describe('Latitude of the business location.'),
    lng: z.number().describe('Longitude of the business location.'),
  }).optional().describe('Geographical coordinates of the business.'),
});

const DetectDuplicateBusinessesInputSchema = z.object({
  business1: BusinessDetailSchema.describe('Details of the first business.'),
  business2: BusinessDetailSchema.describe('Details of the second business.'),
});
export type DetectDuplicateBusinessesInput = z.infer<typeof DetectDuplicateBusinessesInputSchema>;

// Output Schema
const DetectDuplicateBusinessesOutputSchema = z.object({
  isDuplicate: z.boolean().describe('True if the two businesses are determined to be duplicates, false otherwise.'),
  confidenceScore: z.number().min(0).max(1).describe('A confidence score (0-1) indicating the likelihood of duplication.'),
  reasoning: z.string().describe('A brief explanation for the duplication decision, highlighting key similarities or differences.'),
  duplicateAttributes: z.array(z.string()).describe('A list of attributes that contributed to the duplication decision (e.g., "name", "phone", "address", "geo").'),
});
export type DetectDuplicateBusinessesOutput = z.infer<typeof DetectDuplicateBusinessesOutputSchema>;

// Wrapper function
export async function detectDuplicateBusinesses(input: DetectDuplicateBusinessesInput): Promise<DetectDuplicateBusinessesOutput> {
  return detectDuplicateBusinessesFlow(input);
}

// Prompt definition
const prompt = ai.definePrompt({
  name: 'detectDuplicateBusinessesPrompt',
  input: { schema: DetectDuplicateBusinessesInputSchema },
  output: { schema: DetectDuplicateBusinessesOutputSchema },
  prompt: `You are an expert data integrity specialist tasked with identifying duplicate business listings.
Given two business profiles, your goal is to determine if they represent the same real-world business.
Consider the following attributes for comparison:
- Business Names (both English and Arabic, check for similarity even with minor variations or transliterations)
- Addresses (both English and Arabic, check for proximity if geo coordinates are available, or similarity in street names)
- Contact Information (phone, email, website)

Your decision should be based on a holistic comparison of all provided attributes.
If multiple strong indicators (e.g., identical phone number AND very similar name) are present, the confidence score should be high.
If there are minor similarities but also significant differences, the confidence score should be lower.

Provide a boolean indicating if they are duplicates, a confidence score between 0 and 1 (0 being definitely not a duplicate, 1 being definitely a duplicate), a clear reasoning for your decision, and a list of attributes that strongly suggest duplication.

Business 1 (ID: {{{business1.id}}}):
Name (EN): {{{business1.name_en}}}
Name (AR): {{{business1.name_ar}}}
Address (EN): {{{business1.address_en}}}
Address (AR): {{{business1.address_ar}}}
Phone: {{{business1.phone}}}
Email: {{{business1.email}}}
Website: {{{business1.website}}}
Geo Location: Lat {{{business1.geo.lat}}}, Lng {{{business1.geo.lng}}}

Business 2 (ID: {{{business2.id}}}):
Name (EN): {{{business2.name_en}}}
Name (AR): {{{business2.name_ar}}}
Address (EN): {{{business2.address_en}}}
Address (AR): {{{business2.address_ar}}}
Phone: {{{business2.phone}}}
Email: {{{business2.email}}}
Website: {{{business2.website}}}
Geo Location: Lat {{{business2.geo.lat}}}, Lng {{{business2.geo.lng}}}`,
});

// Flow definition
const detectDuplicateBusinessesFlow = ai.defineFlow(
  {
    name: 'detectDuplicateBusinessesFlow',
    inputSchema: DetectDuplicateBusinessesInputSchema,
    outputSchema: DetectDuplicateBusinessesOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
