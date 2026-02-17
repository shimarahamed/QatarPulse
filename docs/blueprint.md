# **App Name**: QatarPulse

## Core Features:

- Advanced Business Search & Map View: Empower users to find businesses using keywords, categories, locations, radius, and filters like 'open now' and 'verified status', displayed in both list and map views with bilingual support.
- Rich, Bilingual Business Profile Pages: Provide comprehensive business profiles with structured data, photos, maps, contact options, social links, detailed services, pricing, source attribution, and last-updated timestamps, available in both Arabic and English.
- Automated & Compliant Data Ingestion Engine: A robust system for collecting business information from various sources (APIs, feeds, allowed crawlers), enforcing compliance with robots.txt and rate limits. Includes a generative AI tool for normalizing diverse data sources into a canonical schema and performing intelligent deduplication based on attributes like phone, geo-proximity, and name similarity.
- Business Listing Claim & Verification: Enable business owners to claim their listings through a guided workflow. Admin/moderator approval mechanisms using email domain, document uploads, or phone OTP, resulting in a 'Verified' badge on successful completion.
- Role-Based Access Control & User Management: Secure user authentication (Email/Password, Google) and robust authorization roles (Guest, Registered User, Business Owner, Moderator, Admin) powered by Firebase Authentication and Firestore Security Rules to manage access and permissions.
- Admin Portal for Content & Moderation: A secure administrative interface for managing categories, locations, and business data (CRUD), handling user submissions, managing moderation queues for change requests, and addressing reports and takedown requests with a comprehensive audit trail.
- Real-time Search Index Integration: Synchronize core business data from Firestore to a dedicated search index (Algolia, Typesense, or Meilisearch via Cloud Run) in real-time, enabling fast and advanced full-text, geo, and faceted search capabilities not feasible with Firestore alone.

## Style Guidelines:

- Primary brand color: A muted indigo (#505084) conveying professionalism, reliability, and depth. (HSL: 245, 45%, 40%)
- Background color: A very light, subtle purple-grey (#EBEBF0) for a clean, unobtrusive canvas. (HSL: 245, 15%, 93%)
- Accent color: A vibrant, clear blue (#459AEE) used for interactive elements and key highlights to provide visual emphasis and user feedback. (HSL: 215, 75%, 55%)
- Headline font: 'Space Grotesk' (sans-serif) for a modern, slightly tech-forward and authoritative look in titles.
- Body font: 'Inter' (sans-serif) for high readability across various screen sizes and effective rendering of bilingual Arabic and English text.
- Utilize a consistent set of clean, line-art icons that are modern and clear, providing intuitive visual cues for navigation and actions.
- Employ a responsive, mobile-first design philosophy with emphasis on a clear, organized content hierarchy and dedicated support for Right-to-Left (RTL) languages for Arabic content.
- Implement subtle and functional micro-animations for interactive elements, loading states, and state changes to enhance user experience and provide feedback without distracting.