import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dosha Quiz - Maharishi Ayurveda",
  description: "Discover your Ayurvedic constitution",
  icons: {
    icon: [
      {
        url: "https://mh-quiz-nl.vercel.app/favicon.ico",
        sizes: "any",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL || "";

  return (
    <html lang="en">
      <Head>
        <title>Dosha Quiz - Maharishi Ayurveda</title>
        <meta
          name="description"
          content="Discover your Ayurvedic constitution"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href={`https://mh-quiz-nl.vercel.app/favicon.ico`}
          sizes="any"
        />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
