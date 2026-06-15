# QatarPulse - Business Directory Platform

QatarPulse is a production-grade, AI-enhanced business directory platform built specifically for the Qatar market. It connects residents and visitors with local businesses, services, and landmarks across Doha and beyond.

## 🚀 Features

### For Users
- **Advanced Search**: Filter businesses by category, price range, ratings, and specific tags (e.g., "Free WiFi", "Family Friendly").
- **Real-time Map View**: Visualize business locations on an interactive map.
- **Reviews & Ratings**: Share experiences and rate businesses on a 5-star scale.
- **Favorites**: Save businesses to a personal list for quick access.
- **Business Submissions**: Users can suggest new businesses to be added to the directory.

### For Business Owners
- **Listing Claims**: Verified ownership process to manage business profiles.
- **Enhanced Dashboard**: Respond to customer reviews and update business information.
- **Verified Status**: Earn a "Verified" badge to build trust with customers.

### For Administrators
- **Comprehensive Admin Panel**: Centralized control over users, businesses, and content.
- **Content Moderation**: Review queue for user-submitted ratings and business suggestions.
- **Data Ingestion Pipeline**: Automated fetching of business data from external APIs (e.g., OpenStreetMap).
- **User Management**: Manage roles (Admin, Business Owner, User) and permissions.

## 🤖 AI Integration (Firebase Genkit)

The platform leverages **Google Gemini 2.5 Flash** via Firebase Genkit to automate complex data tasks:

1.  **Smart Normalization**: Automatically converts messy, raw text or JSON data from various sources into a structured, canonical business schema.
2.  **Multilingual Extraction**: Intelligent extraction of both English and Arabic names/descriptions.
3.  **Duplicate Detection**: AI analyzes business profiles (names, proximity, contact info) to identify and flag potential duplicate listings.
4.  **Category Mapping**: Automatically maps external categories to the platform's internal category system using semantic understanding.

## 🛠️ Tech Stack

-   **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS.
-   **UI Components**: Shadcn UI (Radix UI primitives), Lucide React icons.
-   **Backend/Database**: Firebase Firestore (Real-time data).
-   **Authentication**: Firebase Auth (Email/Password & Google Social Login).
-   **AI Framework**: Firebase Genkit with Google AI plugin.
-   **State Management**: React Context + Firebase Hooks.

## 📂 Project Structure

-   `src/app`: Next.js App Router pages and layouts.
-   `src/components`: Reusable UI components and specific feature modules.
-   `src/ai`: Genkit flows, prompts, and configuration for AI features.
-   `src/firebase`: Firebase configuration, providers, and custom Firestore hooks.
-   `src/lib`: Shared types, utility functions, and seed data.

## 🚦 Getting Started

1.  **Environment Variables**: Ensure you have your `GEMINI_API_KEY` set up for AI features.
2.  **Database Seeding**: The app automatically seeds core categories and initial businesses on the first run if the database is empty.
3.  **Development**:
    ```bash
    npm run dev           # Start the Next.js development server
    npm run genkit:dev    # Start the Genkit Developer UI
    ```

## ⚖️ Security

The application implements strict **Firestore Security Rules** to ensure:
-   Public read access for verified business data.
-   Admins have full global access.
-   Business owners can only manage their own listings.
-   Users can only edit their own profile and reviews.
-   Moderation-protected content is only visible to admins until approved.
