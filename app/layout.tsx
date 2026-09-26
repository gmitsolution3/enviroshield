import ClientIsland from "@/components/client-island";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fustat, Geist } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Enviroshield",
    template: "%s | Enviroshield",
  },

  description:
    "Enviroshield provides professional painting, wall finishing, wallpaper, and surface transformation solutions.",

  applicationName: "Enviroshield",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "Enviroshield",
    title: "Enviroshield",
    description:
      "Professional painting, wall finishing, wallpaper, and surface transformation solutions.",
    url: siteUrl,
  },

  twitter: {
    card: "summary_large_image",
    title: "Enviroshield",
    description:
      "Professional painting, wall finishing, wallpaper, and surface transformation solutions.",
  },

  other: {
    "fb:pages": "YOUR_FACEBOOK_PAGE_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", fustat.variable)}>
      <body className="min-h-screen antialiased">
        <TooltipProvider>
          {children}
          <Toaster />
          <ClientIsland />
        </TooltipProvider>
      </body>
    </html>
  );
}
