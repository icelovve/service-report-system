import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const kanit = Kanit({
  subsets: ['thai'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-kanit',
});


export const metadata: Metadata = {
  title: "กองบริการการศึกษา",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${kanit.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
