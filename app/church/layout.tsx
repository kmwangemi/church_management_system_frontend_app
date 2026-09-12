import { BrandedLoader } from '@/components/branded-loader';
import { ChurchClient } from '@/components/church/church-client';
import { SessionLoader } from '@/components/session-loader';
import type React from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionLoader
      fallback={
        <BrandedLoader
          brandName="Church Hub"
          logo="/placeholder.svg"
          message="Preparing your workspace..."
          showProgress={true}
        />
      }
      requireAuth={true}
    >
      <ChurchClient user={{ name: 'Church Admin', email: '' } as any}>{children}</ChurchClient>
    </SessionLoader>
  );
}
