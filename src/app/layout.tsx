import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Providers from "@/lib/providers";
import { fontSans } from "@/components/ui/fonts";
import { cn } from "@/lib/utils/styles";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://findplace.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  title: "Find a Mosque 'Masjid' ابحث عن مسجد",
  description:
    "Find or add a place to pray for muslims prayers ابحث او اضف مكان للصلاه",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/salat.png",
    },
  ],
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Find a Mosque 'Masjid' ابحث عن مسجد",
    description:
      "Find or add a place to pray for muslims prayers ابحث او اضف مكان للصلاه",
    url: "https://findplace.vercel.app",
    siteName: "Find a Mosque 'Masjid' ابحث عن مسجد",
    type: "website",
    images: [
      {
        url: "https://findplace.vercel.app/_next/image?url=/mosque-status-screenshot.png&w=1920&q=75",
        secureUrl:
          "https://findplace.vercel.app/_next/image?url=/mosque-status-screenshot.png&w=1920&q=75",
        width: 1920,
        height: 75,
        alt: "Preview image for the site",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://findplace.vercel.app",
    title: "Find a Mosque 'Masjid' ابحث عن مسجد",
    description:
      "Find or add a place to pray for muslims prayers ابحث او اضف مكان للصلاه",
    creator: "Sherif Awad",
    images: {
      url: "https://findplace.vercel.app/_next/image?url=/mosque-status-screenshot.png&w=1920&q=75",
      alt: "Preview image for the site",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
