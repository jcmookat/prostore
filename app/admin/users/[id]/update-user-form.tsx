'use client';

import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { updateUserSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition, type ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import BaseFormField from '@/components/shared/base-form-field';
import SubmitButton from '@/components/shared/submit-button';
import { USER_ROLES } from '@/lib/constants';
import { updateUser } from '@/lib/actions/user.actions';

export default function UpdateUserForm({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}): ReactElement {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      try {
        const res = await updateUser({ ...values, id: user.id });
        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          });
          return;
        }

        toast({
          description: res.message,
        });
        form.reset(values);
        router.push('/admin/users');
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          variant: 'destructive',
          description: (error as Error).message,
        });
      }
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-full">
          <BaseFormField<typeof updateUserSchema>
            name="email"
            label="Email"
            disabled={true}
            placeholder="Enter email"
            formControl={form.control}
          />
        </div>
        <div className="w-full">
          <BaseFormField<typeof updateUserSchema>
            name="name"
            label="Name"
            placeholder="Enter name"
            formControl={form.control}
          />
        </div>
        <div className="w-full">
          <BaseFormField<typeof updateUserSchema>
            name="role"
            label="Role"
            placeholder="Enter role"
            inputType="select"
            dataArr={USER_ROLES}
            formControl={form.control}
          />
        </div>
        <div className="flex-between">
          <SubmitButton
            buttonLabel="Update User"
            isPending={isPending}
            isPendingLabel="Updating..."
          />
        </div>
      </form>
    </Form>
  );
}
