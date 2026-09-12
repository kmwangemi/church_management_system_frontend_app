'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Countdown timer that updates every second
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/auth/member');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(countdownTimer);
  }, [router]);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/auth/member');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-accent py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background px-4 py-8 shadow-lg sm:rounded-lg sm:px-10">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a4 4 0 00-8 0v2m0 0V9a4 4 0 018 0v2m0 0h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
            </svg>
          </div>
          {/* Title */}
          <h1 className="mb-2 text-center font-bold text-2xl text-foreground">
            Access Denied
          </h1>
          {/* Message */}
          <p className="mb-6 text-center text-muted-foreground">
            You don't have permission to access this resource. Please contact
            your administrator or try logging in with the appropriate
            credentials.
          </p>
          {/* Error Code */}
          <div className="mb-8 text-center text-muted-foreground text-sm">
            Error Code: 401 - Unauthorized
          </div>
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleLogin}
              type="button"
            >
              Sign In
            </button>
            <button
              className="flex w-full justify-center rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleGoHome}
              type="button"
            >
              Go to Home
            </button>
            <button
              className="flex w-full justify-center rounded-md border border-border bg-background px-4 py-2 font-medium text-muted-foreground text-sm shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={handleGoBack}
              type="button"
            >
              Go Back
            </button>
          </div>
          {/* Auto-redirect notice with countdown */}
          <div className="mt-6 text-center text-muted-foreground text-xs">
            You will be automatically redirected to the login page in{' '}
            <span className="font-medium text-blue-600">{countdown}</span>
            {countdown === 1 ? ' second' : ' seconds'}
          </div>
        </div>
      </div>
    </div>
  );
}
