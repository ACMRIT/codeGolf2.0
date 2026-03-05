import type { Metadata } from "next";
import "./globals.css";
import "@fontsource/amarante";
import "@fontsource/almendra";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/600.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "CodeGolf 2.0 | ACM Student Chapter",
  description:
    "CodeGolf 2.0 – Think smarter. Code shorter. Win faster. A competitive programming event by ACM Student Chapter.",
  keywords: ["code golf", "competitive programming", "ACM", "hackathon", "coding competition"],
  openGraph: {
    title: "CodeGolf 2.0",
    description: "Think smarter. Code shorter. Win faster.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head />
      <body className="min-h-screen bg-[#060914] antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(8, 14, 28, 0.95)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#e2e8f0",
            },
          }}
        />
      </body>
    </html>
  );
}
