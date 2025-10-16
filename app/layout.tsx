import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Payment Transactions Tracker",
  description: "Track all your payment app transactions in one place",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50">{children}</body>
    </html>
  );
}
