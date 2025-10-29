
import type { Metadata } from "next";
// FIX: Import ReactNode to resolve 'Cannot find namespace 'React'' error for the type annotation of 'children'.
import type { ReactNode } from "react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/lib/i18n";
import { I18nProvider } from "@/hooks/useTranslation";
import { cookies } from "next/headers";
import { Analytics } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Dartgrid",
  description: "Live Darts Ticker & Predictions",
  manifest: "/manifest.json",
  themeColor: "#111827",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Dartgrid",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // FIX: The cookies() function from next/headers is being incorrectly typed as returning a Promise. Awaiting it resolves the promise and provides the cookie store object.
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'de-CH';
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang.split('-')[0]}>
      <head>
         <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').then(registration => {
                    console.log('SW registered: ', registration);
                  }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <I18nProvider dictionary={dictionary}>
          {/* FIX: Wrap children in a fragment to resolve incorrect 'children' is missing error. */}
          <>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </>
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}