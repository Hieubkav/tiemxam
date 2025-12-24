import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trung Địa Tattoo - Art & Precision",
  description: "Xăm hình nghệ thuật Trung Địa Tattoo Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
