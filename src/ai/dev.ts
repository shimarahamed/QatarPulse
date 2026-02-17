import { config } from 'dotenv';
config();

import '@/ai/flows/detect-duplicate-businesses.ts';
import '@/ai/flows/normalize-ingested-business-data.ts';