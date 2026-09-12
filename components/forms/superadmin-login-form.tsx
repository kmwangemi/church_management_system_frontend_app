'use client';

import RenderBetterAuthError from '@/components/better-auth-error';
import { PasswordInput } from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/hooks/api/use-auth';
import { successToastStyle } from '@/lib/toast-styles';
import { type LoginPayload, loginSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SuperAdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: login } = useLogin();
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await login({
        email: payload.email,
        password: payload.password,
      });
      form.reset();
      toast.success('Signed in successfully!', {
        style: successToastStyle,
      });
    } catch (err) {
      // Handle unexpected errors
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {error && <RenderBetterAuthError error={error} />}
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email Address</FormLabel>
                <FormControl>
                  <Input
                    className="h-11"
                    placeholder="Enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="h-11 w-full"
            disabled={!form.formState.isValid || isLoading}
            type="submit"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center">
        <Link
          className="font-medium text-blue-600 text-sm hover:text-blue-500"
          href="/auth/forgot-password"
        >
          Forgot password?
        </Link>
      </div>
    </>
  );
}
