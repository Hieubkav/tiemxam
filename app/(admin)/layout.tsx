import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Trung Địa Tattoo",
  description: "Quản trị Trung Địa Tattoo Studio",
};

export default function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
