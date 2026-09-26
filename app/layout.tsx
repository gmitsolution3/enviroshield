import ClientIsland from "@/components/client-island";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fustat, Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enviroshield",
  description:
    "Enviroshield — professional environmental and protective solutions.",
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
