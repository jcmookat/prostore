'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { paymentMethodSchema } from '@/lib/validators';
import { PaymentMethod } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import PaymentMethodFormField from './payment-method-form-field';
import { RadioGroup } from '@/components/ui/radio-group';
import CheckoutButton from '@/components/shared/checkout-button';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';

const PaymentMethodForm = ({
	prefferedPaymentMethod,
}: {
	prefferedPaymentMethod: PaymentMethod['type'];
}) => {
	const router = useRouter();
	const { toast } = useToast();

	// 1. Define your form.
	const form = useForm<z.infer<typeof paymentMethodSchema>>({
		resolver: zodResolver(paymentMethodSchema),
		defaultValues: {
			type: prefferedPaymentMethod || DEFAULT_PAYMENT_METHOD,
		},
	});

	const [isPending, startTransition] = useTransition();

	const onSubmit: SubmitHandler<z.infer<typeof paymentMethodSchema>> = async (
		values,
	) => {
		startTransition(async () => {
			// Update user's payment method in database
			const res = await updateUserPaymentMethod(values);
			if (!res.success) {
				toast({
					variant: 'destructive',
					description: res.message,
				});
				return;
			}
			router.push('/place-order');
		});
	};

	return (
		<>
			<div className='max-w-md mx-auto space-y-5'>
				<h1 className='h2-bold mt-4'>Payment Method</h1>
				<p className='text-sm text-muted-foreground'>
					Please select a payment method
				</p>
				<Form {...form}>
					<form
						method='post'
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-6'>
						<div className='flex flex-col md:flex-row gap-5'>
							<FormField
								control={form.control}
								name='type'
								render={({ field }) => (
									<FormItem className='space-y-3'>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												className='flex flex-col space-y-2'>
												{PAYMENT_METHODS.map((paymentMethod) => (
													<PaymentMethodFormField
														key={paymentMethod}
														value={paymentMethod}
														label={paymentMethod}
														checked={field.value === paymentMethod}
													/>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex gap-2 pt-3'>
							<CheckoutButton isPending={isPending} />
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};
export default PaymentMethodForm;
