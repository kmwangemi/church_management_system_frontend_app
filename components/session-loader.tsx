'use client';

import { useAuth } from '@/lib/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// ============================================
// LOADING SPINNER COMPONENT
// ============================================

function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-border border-t-blue-600`}
        />
        {/* Loading text */}
        <div className="space-y-2 text-center">
          <p className="font-semibold text-muted-foreground text-lg dark:text-gray-200">
            Loading your session...
          </p>
          <p className="text-muted-foreground text-sm dark:text-muted-foreground">
            Please wait while we authenticate you
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SESSION LOADER WITH AUTHENTICATION
// ============================================

interface SessionLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export function SessionLoader({
  children,
  fallback,
  requireAuth = true,
  redirectTo,
  allowedRoles,
}: SessionLoaderProps) {
  const { user: session, isLoading: isPending, error } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isPending && requireAuth && !session) {
      // Redirect to appropriate sign-in if authentication is required but user is not authenticated
      const targetLogin =
        redirectTo ||
        (pathname?.startsWith('/superadmin')
          ? '/auth/superadmin'
          : pathname?.startsWith('/member')
            ? '/auth/member'
            : '/auth/admin');
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`${targetLogin}?callbackUrl=${callbackUrl}`);
    }
  }, [isMounted, isPending, session, requireAuth, router, redirectTo, pathname]);

  useEffect(() => {
    if (isMounted && !isPending && session && allowedRoles && allowedRoles.length > 0) {
      // Check if user has the required role
      const userRole = session?.role;
      if (userRole && !allowedRoles.includes(userRole)) {
        router.push('/auth/unauthorized');
      }
    }
  }, [isMounted, isPending, session, allowedRoles, router]);

  // Show loading state until mounted and loaded
  if (!isMounted || isPending) {
    return fallback || <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-accent dark:bg-gray-900">
        <div className="space-y-4 text-center">
          <div className="text-6xl text-red-600">⚠️</div>
          <h2 className="font-bold text-2xl text-foreground dark:text-gray-200">
            Authentication Error
          </h2>
          <p className="text-muted-foreground dark:text-muted-foreground">
            {(error as any)?.message || 'Failed to load session'}
          </p>
          <button
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
            onClick={() => router.push('/auth/member')}
            type="button"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  // If authentication is required but no session exists, don't render children
  if (requireAuth && !session) {
    return null;
  }

  // Render children when session is ready
  return <>{children}</>;
}

// ============================================
// SKELETON LOADER (Alternative)
// ============================================

export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-accent p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Skeleton */}
        <div className="h-16 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-32 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
          <div className="h-32 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
          <div className="h-32 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
        </div>
        {/* Table Skeleton */}
        <div className="space-y-3">
          <div className="h-12 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
          <div className="h-12 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
          <div className="h-12 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
          <div className="h-12 animate-pulse rounded-lg bg-secondary dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// HOC for Page-Level Protection
// ============================================

export function withSessionLoader<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireAuth?: boolean;
    allowedRoles?: string[];
    fallback?: React.ReactNode;
  }
) {
  return function SessionProtectedComponent(props: P) {
    return (
      <SessionLoader
        allowedRoles={options?.allowedRoles}
        fallback={options?.fallback}
        requireAuth={options?.requireAuth}
      >
        <Component {...props} />
      </SessionLoader>
    );
  };
}
