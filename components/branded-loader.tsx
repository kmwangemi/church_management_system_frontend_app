'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// ============================================
// BRANDED LOADER COMPONENT
// ============================================

interface BrandedLoaderProps {
  logo?: string;
  brandName?: string;
  message?: string;
  showProgress?: boolean;
  variant?: 'default' | 'minimal' | 'church' | 'modern';
}

export function BrandedLoader({
  logo,
  brandName = 'Church Management',
  message = 'Preparing your workspace...',
  showProgress = true,
  variant = 'default',
}: BrandedLoaderProps) {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);
  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : `${prev}.`));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  // Progress bar simulation
  useEffect(() => {
    if (!showProgress) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [showProgress]);
  if (variant === 'minimal') {
    return <MinimalLoader brandName={brandName} logo={logo} />;
  }
  if (variant === 'church') {
    return <ChurchLoader brandName={brandName} logo={logo} message={message} />;
  }
  if (variant === 'modern') {
    return <ModernLoader brandName={brandName} logo={logo} message={message} />;
  }
  // Default variant
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex w-full max-w-md flex-col items-center space-y-8 p-8">
        {/* Logo Container */}
        <div className="relative">
          {/* Rotating ring */}
          <div className="absolute inset-0 animate-spin">
            <div className="h-24 w-24 rounded-full border-4 border-transparent border-t-blue-600 border-r-purple-600" />
          </div>
          {/* Logo */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            {logo ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-background shadow-lg">
                <Image
                  alt={brandName}
                  className="object-contain p-2"
                  fill
                  priority
                  src={logo}
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl">
                <span className="font-bold text-2xl text-white">
                  {brandName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Brand Name */}
        <div className="space-y-2 text-center">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-3xl text-transparent">
            {brandName}
          </h1>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>
        {/* Progress Bar */}
        {showProgress && (
          <div className="w-full space-y-2">
            <div className="h-2 overflow-hidden rounded-full bg-secondary dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-muted-foreground text-xs dark:text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
        {/* Message */}
        <div className="space-y-3 text-center">
          <p className="font-medium text-muted-foreground text-lg dark:text-gray-200">
            {message}
            <span className="inline-block w-8 text-left">{dots}</span>
          </p>
          <p className="text-muted-foreground text-sm dark:text-muted-foreground">
            This will only take a moment
          </p>
        </div>
        {/* Animated dots */}
        <div className="flex space-x-2">
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-600" />
          <div
            className="h-3 w-3 animate-bounce rounded-full bg-purple-600"
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className="h-3 w-3 animate-bounce rounded-full bg-blue-600"
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// MINIMAL VARIANT
// ============================================

function MinimalLoader({
  logo,
  brandName,
}: {
  logo?: string;
  brandName: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        {logo ? (
          <div className="relative h-16 w-16">
            <Image
              alt={brandName}
              className="object-contain"
              fill
              priority
              src={logo}
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <span className="font-bold text-2xl text-white">
              {brandName.charAt(0)}
            </span>
          </div>
        )}
        <div className="h-1 w-32 overflow-hidden rounded-full bg-secondary dark:bg-gray-700">
          <div className="h-full w-1/2 animate-pulse bg-blue-600" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// CHURCH VARIANT
// ============================================

function ChurchLoader({
  logo,
  brandName,
  message,
}: {
  logo?: string;
  brandName: string;
  message: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>
      <div className="relative flex w-full max-w-md flex-col items-center space-y-6 p-8">
        {/* Cross icon backdrop */}
        <div className="-translate-x-1/2 absolute top-0 left-1/2 text-9xl text-white opacity-10">
          ✝
        </div>
        {/* Logo */}
        <div className="relative z-10">
          {logo ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full bg-background shadow-2xl ring-4 ring-white/20">
              <Image
                alt={brandName}
                className="object-cover"
                fill
                priority
                src={logo}
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-2xl ring-4 ring-white/20">
              <span className="font-bold text-3xl text-blue-900">
                {brandName.charAt(0)}
              </span>
            </div>
          )}
        </div>
        {/* Brand name */}
        <h1 className="text-center font-bold text-3xl text-white drop-shadow-lg">
          {brandName}
        </h1>
        {/* Spinner */}
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-white/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent" />
        </div>
        {/* Message */}
        <p className="text-center text-lg text-white/90">{message}</p>
        {/* Bible verse (optional) */}
        <div className="max-w-xs text-center text-sm text-white/70 italic">
          "Wait for the Lord; be strong and take heart"
          <div className="mt-1 text-xs">— Psalm 27:14</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODERN VARIANT
// ============================================

function ModernLoader({
  logo,
  brandName,
  message,
}: {
  logo?: string;
  brandName: string;
  message: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="relative flex flex-col items-center space-y-8 p-8">
        {/* Hexagon container */}
        <div className="relative">
          {/* Rotating hexagon */}
          <div className="absolute inset-0 animate-spin-slow">
            <svg
              className="text-blue-500"
              height="120"
              viewBox="0 0 100 100"
              width="120"
            >
              <polygon
                className="opacity-30"
                fill="none"
                points="50 5, 90 25, 90 75, 50 95, 10 75, 10 25"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          {/* Logo */}
          <div className="relative flex h-28 w-28 items-center justify-center">
            {logo ? (
              <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                <Image
                  alt={brandName}
                  className="object-contain"
                  fill
                  priority
                  src={logo}
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/50">
                <span className="font-bold text-2xl text-white">
                  {brandName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
        {/* Brand name with glitch effect */}
        <h1 className="relative font-bold text-4xl text-white tracking-wider">
          <span className="relative z-10">{brandName}</span>
          <span className="absolute top-0 left-0 animate-glitch text-blue-500 opacity-70">
            {brandName}
          </span>
        </h1>
        {/* Loading bar */}
        <div className="h-1 w-64 overflow-hidden rounded-full bg-gray-800">
          <div className="h-full animate-loading-bar bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500" />
        </div>
        {/* Message */}
        <p className="text-center text-muted-foreground text-sm uppercase tracking-widest">
          {message}
        </p>
      </div>
    </div>
  );
}

// ============================================
// EXPORT ALL VARIANTS
// ============================================

export { ChurchLoader, MinimalLoader, ModernLoader };

// // Default variant
// <BrandedLoader
//   logo="/logo.png"
//   brandName="Grace Fellowship"
//   message="Preparing your workspace..."
//   showProgress={true}
// />

// // Church variant
// <BrandedLoader
//   logo="/church-logo.png"
//   brandName="Grace Fellowship"
//   message="Loading ministry tools..."
//   variant="church"
// />

// // Modern variant
// <BrandedLoader
//   logo="/logo.png"
//   brandName="Church OS"
//   message="Initializing system..."
//   variant="modern"
// />

// // Minimal variant
// <BrandedLoader
//   logo="/logo.png"
//   brandName="My Church"
//   variant="minimal"
// />
