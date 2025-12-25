'use client';

import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { SpeedDial } from './components/SpeedDial';
import { DynamicHead } from './components/DynamicHead';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-black">
      <DynamicHead />
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <SpeedDial />
    </div>
  );
}
