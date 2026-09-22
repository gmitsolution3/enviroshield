import ClientIsland from "@/components/client-island";
import SmoothScroll from "@/components/smooth-scroll";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Fustat, Geist } from "next/font/google";
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
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <SmoothScroll>
          {children} 
          <ClientIsland />
        </SmoothScroll>
      </body>
    </html>
  );
}
