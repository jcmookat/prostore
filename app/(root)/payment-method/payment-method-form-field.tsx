'use client';

import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentMethodFormFieldProps } from '@/types';

const PaymentMethodFormField: React.FC<PaymentMethodFormFieldProps> = ({
	label,
	value,
	checked,
}) => {
	return (
		<FormItem className='flex items-center space-x-3 space-y-0'>
			<FormControl>
				<RadioGroupItem value={value} checked={checked} />
			</FormControl>
			<FormLabel className='font-normal'>{label}</FormLabel>
		</FormItem>
	);
};
export default PaymentMethodFormField;
