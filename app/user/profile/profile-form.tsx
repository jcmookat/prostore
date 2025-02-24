'use client';

import { useTransition, type ReactElement } from 'react';
import { useSession } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProfileSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import ProfileFormFields from './profile-form-field';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

export default function ProfileForm(): ReactElement {
  const { data: session, update } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '', // if session name doesn't exist, use ''
      email: session?.user?.email ?? '', // if session email doesn't exist, use ''
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof updateProfileSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      console.log(values);
      // const res = await updateUserAddress(values);
      // if (!res.success) {
      //   toast({
      //     variant: 'destructive',
      //     description: res.message,
      //   });
      //   return;
      // }
      // router.push('/payment-method');
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5 mb-6">
          <ProfileFormFields
            name="email"
            label="Email"
            placeholder="Email"
            formControl={form.control}
            disabled={true}
          />
          <ProfileFormFields
            name="name"
            label="Name"
            placeholder="Name"
            formControl={form.control}
          />
        </div>
        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
          variant="default"
        >
          {isPending ? (
            <>
              w
              <Loader className="w-4 h-4 animate-spin" /> Updating...
            </>
          ) : (
            <>Update Profile</>
          )}
        </Button>
      </form>
    </Form>
  );
}
