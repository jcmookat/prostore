import { type ReactElement } from 'react';
import { Metadata } from 'next';
import ProductForm from '@/components/shared/admin/product-form';

export const metadata: Metadata = {
  title: 'Create Product',
};

export default function CreateProductPage(): ReactElement {
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">
        <ProductForm type="Create" />
      </div>
    </>
  );
}
