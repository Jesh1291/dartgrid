
# Dartgrid - Live Darts Ticker & Predictions

This is a production-ready MVP for Dartgrid, a live darts ticker and predictions application built with Next.js, Tailwind CSS, and Supabase.

## Features

-   **Live Match Ticker:** Real-time updates for ongoing matches.
-   **Order of Merit:** Browse the top 200 players.
-   **Player Profiles:** Detailed stats and information for each player.
-   **Head-to-Head:** Compare two players side-by-side.
-   **Predictions (Pick'em):** Log in to predict match outcomes and compete with friends in groups.
-   **Authentication:** Secure magic link login via Supabase Auth.
-   **Internationalization:** Supports English (en), German (de-CH), and Dutch (nl).
-   **PWA:** Installable on mobile devices with offline capabilities.
-   **Dark Mode:** Adapts to your system's color scheme.

## Tech Stack

-   **Framework:** Next.js (App Router, TypeScript)
-   **Styling:** Tailwind CSS
-   **Backend & DB:** Supabase (Auth, Postgres, RLS)
-   **Real-time:** Server-Sent Events (SSE) on Vercel Edge Functions
-   **Deployment:** Vercel

---

## Getting Started

### Prerequisites

-   Node.js (v18 or newer)
-   npm, yarn, or pnpm
-   A Supabase account

### 1. Set up Supabase

1.  Go to [supabase.com](https://supabase.com) and create a new project.
2.  Navigate to the **SQL Editor** in your Supabase project dashboard.
3.  Copy the entire content of `supabase/migrations/0000_init.sql` and run it to create the necessary tables and policies.
4.  Go to **Project Settings** > **API**. You will need these values for the next step:
    -   Project URL
    -   `anon` public key
    -   `service_role` secret key

### 2. Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd dartgrid
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project by copying the example file:
    ```bash
    cp .env.local.example .env.local
    ```
    Now, open `.env.local` and paste in the keys you copied from your Supabase project settings.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

### 3. Seed the Database

To populate your database with some demo data (players, a match, etc.), run the seed script. This requires your environment variables to be set correctly.

```bash
npm run seed
```

---

## How to Deploy on Vercel

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab).

2.  **Import the project on Vercel:**
    -   Go to your Vercel dashboard and click "Add New... > Project".
    -   Select your Git repository.
    -   Vercel will automatically detect that it's a Next.js project.

3.  **Configure Environment Variables:**
    -   In the Vercel project settings, navigate to the "Environment Variables" section.
    -   Add the same keys from your `.env.local` file:
        -   `NEXT_PUBLIC_SUPABASE_URL`
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        -   `SUPABASE_SERVICE_ROLE_KEY`
    -   The service role key is sensitive and should never be exposed to the client. Vercel makes server-only variables available during the build process and in server-side functions.

4.  **Deploy:**
    -   Click the "Deploy" button. Vercel will build and deploy your application.

## Demo Mode

If you run the application without setting the Supabase environment variables, it will automatically fall back to a client-side only "Demo Mode". This allows you to browse the UI and see the components with mocked data, but no database interactions (like login or making predictions) will work.
