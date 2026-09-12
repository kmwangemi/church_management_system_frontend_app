'use client';

import RenderApiError from '@/components/api-error';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  useSendLoginCode,
  useVerifyLoginCode,
} from '@/lib/hooks/auth/use-login-queries';
import { errorToastStyle, successToastStyle } from '@/lib/toast-styles';
import type {
  LoginPayload,
  SendLoginCodePayload,
} from '@/lib/validations/auth';
import { emailRegex, sendLoginCodeSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check, Mail, RefreshCw, Smartphone } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

enum LoginStep {
  EMAIL_PHONE_FORM = 1,
  CODE_VERIFICATION = 2,
  SUCCESS = 3,
}

export default function LoginWithVerificationPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const [step, setStep] = useState<LoginStep>(LoginStep.EMAIL_PHONE_FORM);
  const [verificationCode, setVerificationCode] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [hasInitialSendFailed, setHasInitialSendFailed] = useState(false);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>(
    'email'
  );
  // Hook for sending login code
  const {
    mutateAsync: sendLoginCodeMutation,
    isPending: isPendingSendCode,
    isError: isErrorSendCode,
    error: errorSendCode,
  } = useSendLoginCode();
  // Hook for verifying login code
  const {
    mutateAsync: verifyLoginCodeMutation,
    isPending: isPendingVerifyCode,
    isError: isErrorVerifyCode,
    error: errorVerifyCode,
  } = useVerifyLoginCode();
  // Email/Phone form
  const loginForm = useForm<SendLoginCodePayload>({
    resolver: zodResolver(sendLoginCodeSchema),
    mode: 'onChange',
    defaultValues: {
      emailOrPhoneNumber: '',
    },
  });
  const { watch: watchLoginForm, getValues: getLoginValues } = loginForm;
  const watchEmailPhoneValue = watchLoginForm('emailOrPhoneNumber');
  // Detect if input is email or phone number
  const detectContactMethod = (value: string) => {
    if (emailRegex.test(value)) {
      setContactMethod('email');
    } else {
      setContactMethod('phone');
    }
  };
  // Handle sending login code
  const handleSendLoginCode = async (payload: LoginPayload) => {
    try {
      await sendLoginCodeMutation(payload);
      setStep(LoginStep.CODE_VERIFICATION);
      setHasInitialSendFailed(false);
      const isEmail = contactMethod === 'email';
      toast.success(
        `We've sent a verification code to your ${isEmail ? 'email' : 'phone number'}`,
        {
          style: successToastStyle,
        }
      );
      startResendCooldown();
    } catch (_error) {
      // console.error('Failed to send login code:', error);
      setHasInitialSendFailed(true);
    }
  };
  // Handle code verification and login
  const handleVerifyCodeAndLogin = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code', {
        style: errorToastStyle,
      });
      return;
    }
    try {
      const result = await verifyLoginCodeMutation({
        email: getLoginValues('emailOrPhoneNumber'),
        verification_code: code,
      });
      if (!result?.user) {
        toast.error('Login failed. Please try again.', {
          style: errorToastStyle,
        });
        return;
      }
      setStep(LoginStep.SUCCESS);
      toast.success('Login successful!', {
        style: successToastStyle,
      });
      // Reset form before navigation
      loginForm.reset();
      // Determine redirect path based on user role
      let redirectPath = '/member';
      if (result.user.role === 'member') {
        redirectPath = '/member';
      }
      // Add more role-based redirects as needed
      // Use window.location for a hard redirect
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1500);
    } catch (error) {
      console.error('Code verification failed:', error);
      // Clear verification code on error
      setVerificationCode(['', '', '', '', '', '']);
    }
  };
  // Handle resend code
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    try {
      await sendLoginCodeMutation({
        email: getLoginValues('emailOrPhoneNumber'),
      });
      // If this was after an initial failure, move to verification step
      if (hasInitialSendFailed) {
        setStep(LoginStep.CODE_VERIFICATION);
        setHasInitialSendFailed(false);
      }
      toast.success('Verification code sent successfully!', {
        style: successToastStyle,
      });
      startResendCooldown();
    } catch (error) {
      console.error('Resend failed:', error);
      // Keep the failed state if we're still on the login form
      if (step === LoginStep.EMAIL_PHONE_FORM) {
        setHasInitialSendFailed(true);
      }
    }
  };
  // Start cooldown timer for resend button
  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  // Handle verification code input changes
  const handleVerificationCodeChange = (index: number, value: string) => {
    // Only allow digits
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    if (sanitizedValue.length > 1) return; // Prevent multiple characters
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = sanitizedValue;
    setVerificationCode(newVerificationCode);
    // Auto-focus next input
    if (sanitizedValue && index < 5) {
      const nextInput = document.getElementById(
        `verification-code-${index + 1}`
      );
      nextInput?.focus();
    }
  };
  // Handle backspace in verification code inputs
  const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(
        `verification-code-${index - 1}`
      );
      prevInput?.focus();
    }
  };
  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (
      step === LoginStep.CODE_VERIFICATION &&
      verificationCode.every((code) => code !== '')
    ) {
      handleVerifyCodeAndLogin();
    }
  }, [verificationCode, step]);
  // Handle session expiry message
  useEffect(() => {
    if (reason === 'expired') {
      toast.error('Your session has expired. Please log in again.', {
        style: errorToastStyle,
      });
    }
  }, [reason]);
  // Detect contact method when input changes
  useEffect(() => {
    if (watchEmailPhoneValue) {
      detectContactMethod(watchEmailPhoneValue);
    }
  }, [watchEmailPhoneValue]);
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          {step === LoginStep.EMAIL_PHONE_FORM &&
            'Enter your email or phone number to receive a login code'}
          {step === LoginStep.CODE_VERIFICATION &&
            'Enter the verification code to complete your login'}
          {step === LoginStep.SUCCESS && 'Login successful! Redirecting...'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Display errors */}
        {isErrorSendCode && <RenderApiError error={errorSendCode} />}
        {isErrorVerifyCode && <RenderApiError error={errorVerifyCode} />}
        {/* Step 1: Email/Phone Form */}
        {step === LoginStep.EMAIL_PHONE_FORM && (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit((data) => handleSendLoginCode({ email: data.emailOrPhoneNumber, password: '' }))}>
              <div className="grid gap-4">
                <FormField
                  control={loginForm.control}
                  name="emailOrPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Email Address or Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11"
                          placeholder="Enter your email or phone number"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="h-11 w-full"
                  disabled={isPendingSendCode || !loginForm.formState.isValid}
                  type="submit"
                >
                  {isPendingSendCode ? (
                    'Sending Code...'
                  ) : (
                    <>
                      Send Login Code
                      {contactMethod === 'email' ? (
                        <Mail className="ml-2 h-4 w-4" />
                      ) : (
                        <Smartphone className="ml-2 h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
                {/* Show resend option if initial send failed */}
                {hasInitialSendFailed && !isPendingSendCode && (
                  <Button
                    className="mt-2"
                    disabled={
                      resendCooldown > 0 ||
                      !watchEmailPhoneValue ||
                      isPendingSendCode
                    }
                    onClick={handleResendCode}
                    type="button"
                    variant="outline"
                  >
                    {resendCooldown > 0 ? (
                      `Try again in ${resendCooldown}s`
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Sending Again
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
        {/* Step 2: Code Verification */}
        {step === LoginStep.CODE_VERIFICATION && (
          <div className="grid gap-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                {contactMethod === 'email' ? (
                  <Mail className="h-6 w-6 text-primary" />
                ) : (
                  <Smartphone className="h-6 w-6 text-primary" />
                )}
              </div>
              <p className="mb-4 text-center text-muted-foreground text-sm">
                We've sent a verification code to your{' '}
                {contactMethod === 'email' ? 'email' : 'phone number'}{' '}
                <strong>{watchEmailPhoneValue}</strong>. Please enter the code
                below to sign in.
              </p>
              <div className="grid w-full max-w-sm grid-cols-6 gap-2">
                {verificationCode.map((code, index) => (
                  <Input
                    autoFocus={index === 0}
                    className="text-center text-lg"
                    disabled={isPendingVerifyCode}
                    id={`verification-code-${index}`}
                    key={index}
                    maxLength={1}
                    onChange={(e) =>
                      handleVerificationCodeChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleVerificationKeyDown(index, e)}
                    value={code}
                  />
                ))}
              </div>
            </div>
            <Button
              disabled={
                verificationCode.some((code) => !code) || isPendingVerifyCode
              }
              onClick={handleVerifyCodeAndLogin}
            >
              {isPendingVerifyCode ? (
                'Signing In...'
              ) : (
                <>
                  Sign In
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              className="mt-2"
              disabled={resendCooldown > 0 || isPendingSendCode}
              onClick={handleResendCode}
              variant="link"
            >
              {resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : "Didn't receive a code? Send again"}
            </Button>
          </div>
        )}
        {/* Step 3: Success */}
        {step === LoginStep.SUCCESS && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mb-2 font-semibold text-green-700 text-lg dark:text-green-300">
              Login Successful!
            </h3>
            <p className="mb-4 text-center text-muted-foreground text-sm">
              You have been successfully logged in. Redirecting to your
              dashboard...
            </p>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <div className="h-4 w-4 animate-spin rounded-full border-primary border-b-2" />
              Redirecting...
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4">
        {step === LoginStep.CODE_VERIFICATION && (
          <Button
            disabled={isPendingVerifyCode || isPendingSendCode}
            onClick={() => setStep(LoginStep.EMAIL_PHONE_FORM)}
            size="sm"
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Use Different Email/Phone
          </Button>
        )}
        <div className="text-center text-muted-foreground text-sm">
          Need help? Contact support
        </div>
      </CardFooter>
    </Card>
  );
}
