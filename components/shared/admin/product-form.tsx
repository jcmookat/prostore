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
import { useTransition, type ReactElement } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import ProductFormField from './product-form-field';
import { Button } from '@/components/ui/button';
import slugify from 'slugify';
import ProductButton from './product-button';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { UploadButton, UploadDropzone } from '@/lib/uploadthing';
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

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      // On create
      if (type === 'Create') {
        const res = await createProduct(values);

        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          });
        } else {
          toast({
            description: res.message,
          });
          router.push('/admin/products');
        }
      }

      // On update
      if (type === 'Update') {
        if (!productId) {
          router.push('/admin/products');
          return;
        }
        const res = await updateProduct({ ...values, id: productId });

        if (!res.success) {
          toast({
            variant: 'destructive',
            description: res.message,
          });
        } else {
          toast({
            description: res.message,
          });
          router.push('/admin/products');
        }
      }
    });
  };

  const images = form.watch('images');

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
            <ProductFormField
              name="name"
              label="Name"
              placeholder="Enter a product name"
              formControl={form.control}
            />
          </div>
          {/* Slug */}
          <div className="w-full">
            <ProductFormField
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

          {/* <ProductFormField
            name="isFeatured"
            label="Featured Product"
            inputType="checkbox"
            formControl={form.control}
          />
*/}
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Category */}
          <ProductFormField
            name="category"
            label="Category"
            placeholder="Enter category"
            formControl={form.control}
          />
          {/* Brand */}
          <ProductFormField
            name="brand"
            label="Brand"
            placeholder="Enter product brand"
            formControl={form.control}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Price */}
          <ProductFormField
            name="price"
            label="Price"
            placeholder="Enter price"
            formControl={form.control}
          />
          {/* Stock */}
          <ProductFormField
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
                  <CardContent className="space-y-2 mt-2 pt-2 min-h-48">
                    <div className="flex-center pb-2 gap-2 w-full">
                      {images.map((image: string) => (
                        <Image
                          key={image}
                          src={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm mt-1"
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
                        onUploadBegin={(name) => {
                          // Do something once upload begins
                          console.log('Uploading: ', name);
                        }}
                        onChange={(acceptedFiles) => {
                          // Do something with the accepted files
                          console.log('Accepted files: ', acceptedFiles);
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

        <div className="upload-field">{/* Is Featured */}</div>
        <div>
          {/* Description */}
          <ProductFormField
            name="description"
            label="Description"
            inputType="textarea"
            placeholder="Enter product description"
            formControl={form.control}
          />
        </div>
        <div>
          {/* Submit */}
          <ProductButton isPending={isPending} formType={type} />
        </div>
      </form>
    </Form>
  );
}
