'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { shippingAddressDefaultValues } from '@/lib/constants';
import BaseFormField from '@/components/shared/base-form-field';
import { updateUserAddress } from '@/lib/actions/user.actions';
import SubmitButton from '@/components/shared/submit-button';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
  const router = useRouter();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues, // address - from user.address
  });

  const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (
    values,
  ) => {
    const res = await updateUserAddress(values);
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
      return;
    }
    router.push('/payment-method');
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-5">
        <h1 className="h2-bold mt-4">Shipping Address</h1>
        <p className="text-sm text-muted-foreground">
          Please enter an address to ship to
        </p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-5">
              <BaseFormField<typeof shippingAddressSchema>
                name="fullName"
                label="Full Name"
                placeholder="Enter Full Name"
                formControl={form.control}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <BaseFormField<typeof shippingAddressSchema>
                name="streetAddress"
                label="Street Address"
                placeholder="Enter Address"
                formControl={form.control}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <BaseFormField<typeof shippingAddressSchema>
                name="city"
                label="City"
                placeholder="Enter City"
                formControl={form.control}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <BaseFormField<typeof shippingAddressSchema>
                name="postalCode"
                label="Postal Code"
                placeholder="Enter Postal Code"
                formControl={form.control}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <BaseFormField<typeof shippingAddressSchema>
                name="country"
                label="Country"
                placeholder="Enter Country"
                formControl={form.control}
              />
            </div>
            <div className="flex gap-2 pt-3">
              <SubmitButton
                isPending={form.formState.isSubmitting}
                buttonLabel="Continue"
              />
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ShippingAddressForm;
