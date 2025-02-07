import { z } from 'zod';
import {
	insertProductSchema,
	insertCartSchema,
	cartItemSchema,
	shippingAddressSchema,
} from '@/lib/validators';
import { signUpFormSchema } from '@/lib/validators';
import { FieldPath, Control } from 'react-hook-form';

export type SignupFormFieldProps = {
	name: FieldPath<z.infer<typeof signUpFormSchema>>;
	label: string;
	placeholder: string;
	description?: string;
	inputType?: string;
	formControl: Control<z.infer<typeof signUpFormSchema>, any>;
};

export type Product = z.infer<typeof insertProductSchema> & {
	id: string; // not inserted but created automatically in the DB
	rating: string;
	createdAt: Date; // not inserted but created automatically in the DB
};

export type Cart = z.infer<typeof insertCartSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
