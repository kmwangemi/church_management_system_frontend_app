import { BrandedLoader } from '@/components/branded-loader';
import { SessionLoader } from '@/components/session-loader';
import { SuperAdminClient } from '@/components/superadmin/superadmin-client';
import type React from 'react';

export default async function SuperAdminLayout({
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
        />
      }
      requireAuth={true}
      allowedRoles={['SUPER_ADMIN']}
    >
      <SuperAdminClient user={{ name: 'Super Admin', email: '' } as any}>{children}</SuperAdminClient>
    </SessionLoader>
  );
}
