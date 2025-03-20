import { z } from 'zod';
import {
  insertProductSchema,
  insertCartSchema,
  cartItemSchema,
  signUpFormSchema,
  shippingAddressSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  paymentResultSchema,
  updateProfileSchema,
  updateUserSchema,
  signInFormSchema,
  insertReviewSchema,
} from '@/lib/validators';
import { FieldPath, Control } from 'react-hook-form';

export type SignInFormFieldProps = {
  name: FieldPath<z.infer<typeof signInFormSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<z.infer<typeof signInFormSchema>>;
};
export type SignupFormFieldProps = {
  name: FieldPath<z.infer<typeof signUpFormSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<z.infer<typeof signUpFormSchema>>;
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
  placeholder?: string;
  description?: string;
  inputType?: string;
  formControl: Control<z.infer<typeof shippingAddressSchema>>;
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
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
};
export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type ProfileFormFieldsProps = {
  name: FieldPath<z.infer<typeof updateProfileSchema>>;
  label: string;
  placeholder?: string;
  description?: string;
  inputType?: string;
  disabled?: boolean;
  formControl: Control<z.infer<typeof updateProfileSchema>>;
};

export type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export type ProductFormFieldProps = {
  name: FieldPath<z.infer<typeof insertProductSchema>>;
  label: string;
  placeholder?: string;
  description?: string;
  inputType?: string;
  disabled?: boolean;
  checked?: boolean;
  formControl: Control<z.infer<typeof insertProductSchema>>;
};

export type UpdateUserFormFieldProps = {
  name: FieldPath<z.infer<typeof updateUserSchema>>;
  label: string;
  placeholder?: string;
  description?: string;
  inputType?: string;
  disabled?: boolean;
  checked?: boolean;
  dataArr?: string[];
  formControl: Control<z.infer<typeof updateUserSchema>>;
};

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};

export type ReviewFormFieldProps = {
  name: FieldPath<z.infer<typeof insertReviewSchema>>;
  label: string;
  placeholder?: string;
  description?: string;
  inputType?: string;
  disabled?: boolean;
  checked?: boolean;
  dataArr?: string[];
  formControl: Control<z.infer<typeof insertReviewSchema>>;
};
