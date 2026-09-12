import ErrorBoundary from '@/components/error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Church Management System',
    default: 'Church Management System',
  },
  description: 'Church Management Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <QueryProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </QueryProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                backgroundColor: '#f9fafb',
                color: '#111827',
                border: '1px solid #e5e7eb',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
