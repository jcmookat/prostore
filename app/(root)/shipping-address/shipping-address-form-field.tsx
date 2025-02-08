'use client';

import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ShippingAddressFormFieldProps } from '@/types';

const ShippingAddressFormField: React.FC<ShippingAddressFormFieldProps> = ({
	name,
	label,
	placeholder,
	description,
	inputType,
	formControl,
}) => {
	return (
		<FormField
			control={formControl}
			name={name}
			render={({ field }) => (
				<FormItem className='w-full'>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input
							placeholder={placeholder}
							type={inputType || 'text'}
							{...field}
						/>
					</FormControl>
					{description && <FormDescription>{description}</FormDescription>}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
export default ShippingAddressFormField;
