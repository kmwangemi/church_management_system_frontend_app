'use client';

import SuperAdminLoginForm from '@/components/forms/superadmin-login-form';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/lib/use-auth';
import { Church } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default function SuperAdminLoginPage() {
  const {
    user: session,
    isLoading: isPending, //loading state
    error, //error object
  } = useAuth();
  // Show loading state while checking session
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-700 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="text-muted-foreground text-lg">Loading your experience...</p>
        </div>
      </div>
    );
  }
  // Show error state if there's a session error
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="mx-auto max-w-md p-6 text-center">
          <div className="mb-4 text-6xl text-red-400">⚠️</div>
          <h1 className="mb-4 font-bold text-2xl">Something went wrong</h1>
          <p className="mb-6 text-muted-foreground">
            We're having trouble loading your session. Please try refreshing the
            page.
          </p>
          <button
            className="rounded-lg bg-gradient-to-r from-purple-500 to-red-500 px-6 py-3 font-semibold text-white transition-colors hover:from-purple-600 hover:to-red-600"
            onClick={() => window.location.reload()}
            type="button"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
  // Redirect user
  if (session && session.role === 'SUPER_ADMIN') {
    redirect('/superadmin');
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-8 text-center">
            <div className="mb-6 flex items-center justify-center space-x-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <Church className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl text-foreground">
                ChurchHub
              </span>
            </div>
            <CardTitle className="font-bold text-2xl text-foreground">
              Superadmin Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to the super administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<SpinnerLoader />}>
              <SuperAdminLoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
