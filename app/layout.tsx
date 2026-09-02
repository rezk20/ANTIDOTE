import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LocaleProvider } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/translations";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://smart-antidote.vercel.app"),
  // Sub-page titles already include "| ANTIDOTE" (e.g. "الروتين اليومي | ANTIDOTE"),
  // so no template is used here to avoid brand duplication.
  title: "ANTIDOTE — LIFE OS",
  description:
    "Personal command center for financial, career, and life execution.",
  alternates: {
    canonical: "/",
    languages: {
      ar: "/",
      en: "/",
    },
  },
  openGraph: {
    title: "ANTIDOTE — LIFE OS",
    description:
      "Personal command center for financial, career, and life execution.",
    images: [
      {
        url: "/og-image.png",
        width: 1536,
        height: 1024,
        alt: "ANTIDOTE — LIFE OS",
      },
    ],
    locale: "ar",
    alternateLocale: ["en"],
    type: "website",
    siteName: "ANTIDOTE",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANTIDOTE — LIFE OS",
    description:
      "Personal command center for financial, career, and life execution.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // Set GOOGLE_SITE_VERIFICATION in your env (from Google Search Console)
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ANTIDOTE",
  },
  formatDetection: {
    telephone: false,
  },
};

// Structured data for search engines (JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ANTIDOTE — LIFE OS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Personal command center for financial, career, and life execution.",
  inLanguage: ["ar", "en"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("life_os_locale")?.value;
  const initialLocale: Locale = localeCookie === "en" ? "en" : "ar";
  const isRtl = initialLocale === "ar";

  return (
    <html
      lang={initialLocale}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${cairo.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LocaleProvider initialLocale={initialLocale}>
            {children}
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
