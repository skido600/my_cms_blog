import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { ReactQueryProvider } from "../context/TanstackQuery";
import { Toaster } from "sonner";
import NavbarWrapper from "../components/NavbarWrapper";
import FooterWrapper from "../components/FooterWrapper";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://my-cms-blog-ktw2.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Leo Wave | Personal Developer Blog",
    template: "%s | Leo Wave",
  },

  description:
    "Welcome to Leo Wave, my personal blog where I share programming tutorials, web development insights, my coding journey, lifestyle, personal experiences, ideas, and lessons from everyday life.",

  keywords: [
    "Leo Wave",
    "Chinecherem",
    "Personal Developer Blog",
    "Programming",
    "Web Development",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Full Stack Development",
    "Software Engineering",
    "Backend Development",
    "Frontend Development",
    "Coding Tutorials",
    "Tech Articles",
    "Developer Journey",
  ],

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },

  openGraph: {
    title: "Leo Wave |  Personal Developer Blog",
    description:
      "Explore more about Leowave — my coding journey, programming insights, tech entrepreneurship, lifestyle, personal growth, and experiences building modern applications. Sharing my ideas, ambitions, and life beyond the code.",
    url: siteUrl,
    siteName: "Leo Wave",
    images: [
      {
        url: `${siteUrl}/Leo.png`,
        alt: "Leo Wave Personal Developer Blog",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Leo Wave | Personal Developer Blog",
    description:
      "Sharing code, building software, and exploring web development. Follow my journey as a developer.",
    images: [`${siteUrl}/Leo.png`],
  },

  alternates: {
    canonical: siteUrl,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaSans.variable} `}>
        <ThemeProvider>
          <ReactQueryProvider>
            <NavbarWrapper />
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
              }}
            />
            <FooterWrapper />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
