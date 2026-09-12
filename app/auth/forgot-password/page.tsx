'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle, Church, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setEmail(data.email);
      setIsSubmitted(true);
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: ignore console error
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardHeader className="pb-6 text-center">
            <div className="mb-6 flex items-center justify-center space-x-2">
              <div className="rounded-lg bg-blue-600 p-2">
                <Church className="h-8 w-8 text-white" />
              </div>
              <span className="font-bold text-2xl text-foreground">
                ChurchHub
              </span>
            </div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 p-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="font-bold text-2xl text-foreground">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              We've sent a password reset link to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                If you don't see the email in your inbox within a few minutes,
                please check your spam folder.
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false);
                  form.reset();
                }}
                variant="outline"
              >
                Try Different Email
              </Button>
              <Link className="block" href="/auth/member">
                <Button className="w-full" variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="pb-6 text-center">
          <div className="mb-6 flex items-center justify-center space-x-2">
            <div className="rounded-lg bg-blue-600 p-2">
              <Church className="h-8 w-8 text-white" />
            </div>
            <span className="font-bold text-2xl text-foreground">ChurchHub</span>
          </div>
          <CardTitle className="font-bold text-2xl text-foreground">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            No worries! Enter your email address and we'll send you a link to
            reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="Enter your email address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="h-11 w-full"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center">
            <Link
              className="inline-flex items-center font-medium text-blue-600 hover:text-blue-500"
              href="/auth/member"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
