'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { paymentMethodSchema } from '@/lib/validators';
import { PaymentMethod } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD } from '@/lib/constants';
const PaymentMethodForm = ({
	prefferedPaymentMethod,
}: {
	prefferedPaymentMethod: PaymentMethod;
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

	return <div>PaymentMethodForm</div>;
};
export default PaymentMethodForm;
