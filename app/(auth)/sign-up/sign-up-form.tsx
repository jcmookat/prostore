'use client';

import { Button } from '@/components/ui/button';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { startTransition, useActionState, useState } from 'react';

import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import SignUpFormField from './sign-up-form-field';
import { signUpFormSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';

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

	// State to handle pending status manually
	const [isPending, setIsPending] = useState(false);

	const SignUpButton = () => {
		return (
			<Button
				type='submit'
				disabled={isPending}
				className='w-full'
				variant='default'>
				{isPending ? 'Creating account...' : 'Sign Up'}
			</Button>
		);
	};

	const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
		console.log('Form values:', values); // Debug: Log form values

		// Create a FormData object and append the values
		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			formData.append(key, value);
		});
		formData.append('callbackUrl', callbackUrl);

		setIsPending(true);

		// Call the server action
		startTransition(async () => {
			await action(formData);
		});
	};
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<input type='hidden' name='callbackUrl' value={callbackUrl} />
				<div className='space-y-6'>
					<SignUpFormField
						name='name'
						label='Name'
						placeholder='Name'
						formControl={form.control}
					/>
					<SignUpFormField
						name='email'
						label='Email'
						placeholder='Email'
						inputType='email'
						formControl={form.control}
					/>
					<SignUpFormField
						name='password'
						label='Password'
						placeholder='Password'
						inputType='password'
						formControl={form.control}
					/>
					<SignUpFormField
						name='confirmPassword'
						label='Confirm Password'
						placeholder='Confirm Password'
						inputType='password'
						formControl={form.control}
					/>
					<div>
						<SignUpButton />
					</div>
					{data && !data.success && (
						<div className='text-center text-destructive'>{data.message}</div>
					)}
					<div className='text-sm text-center text-muted-foreground'>
						Already have an account?{' '}
						<Link href='/sign-in' target='self' className='link'>
							Sign In
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default SignUpForm;
