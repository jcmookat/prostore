'use client';

import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState, useTransition } from 'react';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import SubmitButton from '@/components/shared/submit-button';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInFormSchema } from '@/lib/validators';
import { z } from 'zod';
import SignInFormField from './credentials-signin-form-field';
import { useToast } from '@/hooks/use-toast';
const CredentialsSignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: signInDefaultValues,
  });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<z.infer<typeof signInFormSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
          // Convert non-string values to strings
          formData.append(
            key,
            typeof value === 'object' ? JSON.stringify(value) : String(value),
          );
        });
        if (callbackUrl) {
          formData.append('callbackUrl', callbackUrl);
        }
        action(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
        toast({
          variant: 'destructive',
          description: (error as Error).message,
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <SignInFormField
            name="email"
            label="Email"
            placeholder="Enter email"
            formControl={form.control}
          />
          <SignInFormField
            name="password"
            label="Password"
            placeholder="Enter password"
            inputType="password"
            formControl={form.control}
          />
          <div>
            <SubmitButton
              isPending={isPending}
              buttonLabel="Sign In"
              isPendingLabel="Signing In..."
            />
          </div>
          {data && !data.success && (
            <div className="text-center text-destructive">{data.message}</div>
          )}
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="link">
              Sign Up
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CredentialsSignInForm;
