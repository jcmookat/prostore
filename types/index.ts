import { z } from 'zod';
import {
	insertProductSchema,
	insertCartSchema,
	cartItemSchema,
	signUpFormSchema,
	shippingAddressSchema,
	paymentMethodSchema,
	insertOrderSchema,
	insertOrderItemSchema,
	paymentResultSchema,
} from '@/lib/validators';
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
export type ShippingAddressFormFieldProps = {
	name: FieldPath<z.infer<typeof shippingAddressSchema>>;
	label: string;
	placeholder: string;
	description?: string;
	inputType?: string;
	formControl: Control<z.infer<typeof shippingAddressSchema>, any>;
};

export type PaymentMethod = {
	type: string | null;
};
export type PaymentMethodFormFieldProps = {
	label: string;
	value: string;
	checked?: boolean;
};

export type Order = z.infer<typeof insertOrderSchema> & {
	id: string;
	createdAt: Date;
	isPaid: Boolean;
	paidAt: Date | null;
	isDelivered: Boolean;
	deliveredAt: Date | null;
	orderItems: OrderItem[];
	user: { name: string; email: string };
};
export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type PaymentResult = z.infer<typeof paymentResultSchema>;
