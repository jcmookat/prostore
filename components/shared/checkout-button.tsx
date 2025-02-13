'use client';

import { ArrowRight, Loader } from 'lucide-react';
import { Button } from '../ui/button';

const CheckoutButton = ({ isPending = false }: { isPending: boolean }) => {
	return (
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
	);
};
export default CheckoutButton;
