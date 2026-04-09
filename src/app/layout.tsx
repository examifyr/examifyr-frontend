import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Free Coding Readiness Tests — Python, JavaScript, SQL & More | Examifyr",
    template: "%s | Examifyr",
  },
  description:
    "Take a free exam-style readiness test in Python, JavaScript, SQL, or HTML & CSS. Get a readiness score, find your weak areas, and know if you're ready — in under 20 minutes. No sign-up required.",
  keywords: [
    "python readiness test",
    "javascript quiz",
    "sql practice test",
    "html css quiz",
    "coding exam practice",
    "free coding test",
    "python certification practice",
    "am i ready for python exam",
  ],
  metadataBase: new URL("https://www.examifyr.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://www.examifyr.com",
    siteName: "Examifyr",
    title: "Free Coding Readiness Tests — Know If You're Ready | Examifyr",
    description:
      "Instant readiness score, weak-area diagnosis, and pass likelihood — free, no sign-up. Python, JavaScript, SQL, HTML & CSS.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Coding Readiness Tests | Examifyr",
    description:
      "Take a free Python, JavaScript, SQL, or HTML & CSS readiness test. Instant score + weak-area breakdown.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
