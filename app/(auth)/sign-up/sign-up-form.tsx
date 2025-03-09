'use client';

import { Button } from '@/components/ui/button';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState, useTransition } from 'react';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import SignUpFormField from './sign-up-form-field';
import { signUpFormSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Loader } from 'lucide-react';
import SubmitButton from '@/components/shared/submit-button';

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: signUpDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof signUpFormSchema>> = async (
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

        await action(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <SignUpFormField
            name="name"
            label="Name"
            placeholder="Name"
            formControl={form.control}
          />
          <SignUpFormField
            name="email"
            label="Email"
            placeholder="Email"
            inputType="email"
            formControl={form.control}
          />
          <SignUpFormField
            name="password"
            label="Password"
            placeholder="Password"
            inputType="password"
            formControl={form.control}
          />
          <SignUpFormField
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            inputType="password"
            formControl={form.control}
          />
          <div>
            <SubmitButton
              isPending={isPending}
              buttonLabel="Sign Up"
              isPendingLabel="Creating account..."
            />
          </div>
          {data && !data.success && (
            <div className="text-center text-destructive">{data.message}</div>
          )}
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/sign-in" target="self" className="link">
              Sign In
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
