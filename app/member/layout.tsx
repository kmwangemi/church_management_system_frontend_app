import { BrandedLoader } from '@/components/branded-loader';
import { MemberClient } from '@/components/member/member-client';
import { SessionLoader } from '@/components/session-loader';
import type React from 'react';

export default async function MemberLayout({
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
    >
      <MemberClient user={{ name: 'Member', email: '' } as any}>{children}</MemberClient>
    </SessionLoader>
  );
}
