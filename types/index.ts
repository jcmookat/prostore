import { z, ZodType } from 'zod';
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
  paymentMethodSchema,
} from '@/lib/validators';
import { FieldPath, Control } from 'react-hook-form';

// Base type for form field props
export type BaseFormFieldProps<TSchema extends ZodType> = {
  name: FieldPath<z.infer<TSchema>>;
  label: string;
  placeholder?: string;
  description?: string;
  inputType?: string;
  disabled?: boolean;
  dataArr?: string[];
  selectIcon?: boolean;
  disabledLabel?: string;
  enabledLabel?: string;
  formControl: Control<z.infer<TSchema>>;
};

export type SignInFormFieldProps = BaseFormFieldProps<typeof signInFormSchema>;
export type SignupFormFieldProps = BaseFormFieldProps<typeof signUpFormSchema>;
export type ShippingAddressFormFieldProps = BaseFormFieldProps<
  typeof shippingAddressSchema
>;
export type PaymentMethodFormFieldProps = BaseFormFieldProps<
  typeof paymentMethodSchema
>;
export type ProductFormFieldProps = BaseFormFieldProps<
  typeof insertProductSchema
>;

export type UpdateUserFormFieldProps = BaseFormFieldProps<
  typeof updateUserSchema
>;

export type ProfileFormFieldsProps = BaseFormFieldProps<
  typeof updateProfileSchema
>;

export type ReviewFormFieldProps = BaseFormFieldProps<
  typeof insertReviewSchema
>;

export type Product = z.infer<typeof insertProductSchema> & {
  id: string; // not inserted but created automatically in the DB
  rating: string;
  createdAt: Date; // not inserted but created automatically in the DB
};
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderItems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};

export type OrderItem = z.infer<typeof insertOrderItemSchema>;

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};
