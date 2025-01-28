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
import { SignupFormFieldProps } from '@/types';

const SignUpFormField: React.FC<SignupFormFieldProps> = ({
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
				<FormItem>
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
export default SignUpFormField;
