'use client';

import { type ReactElement } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProfileSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { updateProfile } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';
import BaseFormField from '@/components/shared/base-form-field';
import SubmitButton from '@/components/shared/submit-button';

export default function ProfileForm(): ReactElement {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof updateProfileSchema>> = async (
    values,
  ) => {
    const res = await updateProfile(values);
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
      return;
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    };
    await update(newSession);

    router.refresh();

    toast({
      description: res.message,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mb-6">
          <BaseFormField<typeof updateProfileSchema>
            name="email"
            label="Email"
            placeholder="Email"
            formControl={form.control}
            disabled={true}
          />
          <BaseFormField<typeof updateProfileSchema>
            name="name"
            label="Name"
            placeholder="Name"
            formControl={form.control}
          />
        </div>
        <SubmitButton
          isPending={form.formState.isSubmitting}
          buttonLabel="Update Profile"
          isPendingLabel="Updating..."
          withIcon={false}
        />
      </form>
    </Form>
  );
}
