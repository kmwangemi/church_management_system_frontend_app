'use client';

import AdminLoginForm from '@/components/forms/admin-login-form';
import { SpinnerLoader } from '@/components/loaders/spinnerloader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Church } from 'lucide-react';
import { Suspense } from 'react';

export default function AdminLoginPage() {
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
              Admin Login
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to the administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<SpinnerLoader />}>
              <AdminLoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
