import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "LIFE OS — غرفة القيادة الشخصية",
  description: "Personal command center for financial, career, and life execution.",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
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
