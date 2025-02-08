'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { shippingAddressDefaultValues } from '@/lib/constants';
import ShippingAddressFormField from './shipping-address-form-field';
import { ArrowRight, Loader } from 'lucide-react';

const ShippingAddressForm = ({ address }: { address: ShippingAddress }) => {
	const router = useRouter();
	const { toast } = useToast();

	// 1. Define your form.
	const form = useForm<z.infer<typeof shippingAddressSchema>>({
		resolver: zodResolver(shippingAddressSchema),
		defaultValues: address || shippingAddressDefaultValues,
	});

	const [isPending, startTransition] = useTransition();

	// State to handle pending status manually
	// const [isPending, setIsPending] = useState(false);

	// const SignUpButton = () => {
	// 	return (
	// 		<Button
	// 			type='submit'
	// 			disabled={isPending}
	// 			className='w-full'
	// 			variant='default'>
	// 			{isPending ? 'Submitting...' : 'Submit'}
	// 		</Button>
	// 	);
	// };

	const onSubmit = (values: any) => {
		console.log(values);
	};

	return (
		<>
			<div className='max-w-md mx-auto space-y-5'>
				<h1 className='h2-bold mt-4'>Shipping Address</h1>
				<p className='text-sm text-muted-foreground'>
					Please enter an address to ship to
				</p>
				<Form {...form}>
					<form
						method='post'
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'>
						<div className='flex flex-col md:flex-row gap-5'>
							<ShippingAddressFormField
								name='fullName'
								label='Full Name'
								placeholder='Enter Full Name'
								formControl={form.control}
							/>
						</div>
						<div className='flex flex-col md:flex-row gap-5'>
							<ShippingAddressFormField
								name='streetAddress'
								label='Street Address'
								placeholder='Enter Address'
								formControl={form.control}
							/>
						</div>
						<div className='flex flex-col md:flex-row gap-5'>
							<ShippingAddressFormField
								name='city'
								label='City'
								placeholder='Enter City'
								formControl={form.control}
							/>
						</div>
						<div className='flex flex-col md:flex-row gap-5'>
							<ShippingAddressFormField
								name='postalCode'
								label='Postal Code'
								placeholder='Enter Postal Code'
								formControl={form.control}
							/>
						</div>
						<div className='flex flex-col md:flex-row gap-5'>
							<ShippingAddressFormField
								name='country'
								label='Country'
								placeholder='Enter Country'
								formControl={form.control}
							/>
						</div>
						<div className='flex gap-2'>
							{/* <SignUpButton /> */}
							<Button
								type='submit'
								disabled={isPending}
								className='w-full'
								variant='default'>
								{isPending ? (
									<Loader className='w-4 h-4 animate-spin' />
								) : (
									<ArrowRight className='w-4 h-4' />
								)}
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</>
	);
};

export default ShippingAddressForm;
