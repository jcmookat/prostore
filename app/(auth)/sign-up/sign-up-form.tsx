'use client';

import { Button } from '@/components/ui/button';
import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { startTransition, useActionState } from 'react';
// import { useFormStatus } from 'react-dom';
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

	const {
		formState: { isSubmitting }, // Get the isSubmitting state from React Hook Form
	} = form;

	const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
		console.log('Form values:', values); // Debug: Log form values

		// Create a FormData object and append the values
		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			formData.append(key, value);
		});
		formData.append('callbackUrl', callbackUrl);

		console.log('FormData:', formData); // Debug: Log FormData

		// Wrap the action call in startTransition
		startTransition(async () => {
			console.log('Form submission started'); // Debug: Log submission start
			await action(formData);
			console.log('Form submission completed'); // Debug: Log submission completion
		});
	};

	// const SignUpButton = () => {
	// 	const { pending } = useFormStatus();

	// 	return (
	// 		<Button type="submit" disabled={pending} className='w-full' variant='default'>
	// 			{pending ? 'Creating account...' : 'Sign Up'}
	// 		</Button>
	// 	);
	// };
	const SignUpButton = ({ isSubmitting }: { isSubmitting: boolean }) => {
		return (
			<Button
				type='submit'
				disabled={isSubmitting}
				className='w-full'
				variant='default'>
				{isSubmitting ? 'Creating account...' : 'Sign Up'}
			</Button>
		);
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
						<SignUpButton isSubmitting={isSubmitting} />{' '}
						{/* Button is inside the form */}
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
