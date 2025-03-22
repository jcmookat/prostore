'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { productDefaultValues } from '@/lib/constants';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import { Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { type ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import BaseFormField from '../shared/base-form-field';
import { Button } from '@/components/ui/button';
import slugify from 'slugify';
import ProductButton from './product-button';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { UploadDropzone } from '@/lib/uploadthing';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function ProductForm({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}): ReactElement {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver:
      type === 'Update'
        ? zodResolver(updateProductSchema)
        : zodResolver(insertProductSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    const handleResponse = (res: { success: boolean; message: string }) => {
      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
      } else {
        toast({ description: res.message });
        router.push('/admin/products');
      }
    };
    if (type === 'Create') {
      const res = await createProduct(values);
      handleResponse(res);
    }

    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }
      const res = await updateProduct({ ...values, id: productId });
      handleResponse(res);
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form
        method="post"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Name */}
          <div className="w-full">
            <BaseFormField<typeof insertProductSchema>
              name="name"
              label="Name"
              placeholder="Enter a product name"
              formControl={form.control}
            />
          </div>
          {/* Slug */}
          <div className="w-full">
            <BaseFormField<typeof insertProductSchema>
              name="slug"
              label="Slug"
              placeholder="Enter slug"
              formControl={form.control}
            />
            <Button
              type="button"
              className="bg-gray-600 text-white px-4 py-1 mt-2 hover:bg-gray-700"
              onClick={() =>
                form.setValue(
                  'slug',
                  slugify(form.getValues('name'), { lower: true }),
                )
              }
            >
              Generate Slug
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Category */}
          <BaseFormField<typeof insertProductSchema>
            name="category"
            label="Category"
            placeholder="Enter category"
            formControl={form.control}
          />
          {/* Brand */}
          <BaseFormField<typeof insertProductSchema>
            name="brand"
            label="Brand"
            placeholder="Enter product brand"
            formControl={form.control}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price */}
          <BaseFormField<typeof insertProductSchema>
            name="price"
            label="Price"
            placeholder="Enter price"
            formControl={form.control}
          />
          {/* Stock */}
          <BaseFormField<typeof insertProductSchema>
            name="stock"
            label="Stock"
            inputType="number"
            placeholder="Enter product stock"
            formControl={form.control}
          />
        </div>
        <div className="upload-field flex flex-col gap-5 md:flex-row">
          {/* Images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 min-h-48 p-3">
                    <div className="flex-center gap-3 w-full bg-gray-100 dark:bg-gray-700 mb-4 rounded-md">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover m-3 object-center rounded-md mr-0 ml-0"
                          width={100}
                          height={100}
                        />
                      ))}
                    </div>
                    <FormControl>
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res: { url: string }[]) => {
                          const newImageUrls = res.map((file) => file.url);
                          form.setValue('images', [...images, ...newImageUrls]);
                        }}
                        onUploadError={(error: Error) => {
                          toast({
                            variant: 'destructive',
                            description: `ERROR! ${error.message}`,
                          });
                        }}
                        appearance={{
                          container:
                            'w-full flex-row rounded-md pt-5 pb-8 border-2 border-dashed dark:border-gray-700 border-gray-300 text-gray-500 dark:text-white',
                          button: 'bg-gray-600 hover:bg-gray-700 w-[150px]',
                          allowedContent: 'text-gray-500 dark:text-white',
                          label:
                            'text-gray-500 dark:text-white text-[1.2rem] mb-2',
                        }}
                      />
                    </FormControl>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="upload-field">
          {/* Is Featured */}
          <BaseFormField<typeof insertProductSchema>
            name="isFeatured"
            label="Featured Product"
            inputType="checkbox"
            formControl={form.control}
            disabledLabel="Not featured"
            enabledLabel="Featured"
          />

          {isFeatured && banner && (
            <div className="flex-center p-3 w-full bg-gray-100 mt-4 rounded-md dark:bg-gray-700">
              <Image
                src={banner}
                alt="banner image"
                className="w-full object-cover object-center rounded-md"
                width={1920}
                height={680}
              />
            </div>
          )}

          {isFeatured && (
            <Card className="mt-4">
              <CardContent className="space-y-2 min-h-48 p-3">
                <UploadDropzone
                  endpoint="bannerImageUploader"
                  onClientUploadComplete={(res: { url: string }[]) => {
                    form.setValue('banner', res[0]?.url);
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: 'destructive',
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                  appearance={{
                    container:
                      'mt-0 w-full flex-row rounded-md pt-5 pb-8 border-2 border-dashed dark:border-gray-700 border-gray-300 text-gray-500 dark:text-white',
                    button: 'bg-gray-600 hover:bg-gray-700 w-[150px]',
                    allowedContent: 'text-gray-500 dark:text-white',
                    label: 'text-gray-500 dark:text-white text-[1.2rem] mb-2',
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <div>
          {/* Description */}
          <BaseFormField<typeof insertProductSchema>
            name="description"
            label="Description"
            inputType="textarea"
            placeholder="Enter product description"
            formControl={form.control}
          />
        </div>
        <div>
          {/* Submit */}
          <ProductButton
            isPending={form.formState.isSubmitting}
            formType={type}
          />
        </div>
      </form>
    </Form>
  );
}
