import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "./components/ConvexProvider";

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
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
