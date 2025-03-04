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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ProductFormFieldProps } from '@/types';

const ProductFormField: React.FC<ProductFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  disabled,
  formControl,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {inputType === 'checkbox' ? (
              <div className="flex items-center gap-2">
                <Switch
                  //checked={!!field.value} // Coerce value to boolean to satisfy type
                  checked={
                    typeof field.value === 'boolean' ? field.value : false // stricter type check
                  }
                  onCheckedChange={field.onChange}
                  disabled={disabled}
                />
                <span>{field.value ? 'Enabled' : 'Disabled'}</span>
              </div>
            ) : inputType === 'textarea' ? (
              // Handle multiline text input
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                value={
                  field.value === null || field.value === undefined
                    ? ''
                    : typeof field.value === 'boolean'
                      ? field.value.toString()
                      : field.value
                }
                onChange={field.onChange}
                className="resize-none"
              />
            ) : (
              <Input
                placeholder={placeholder}
                type={inputType || 'text'}
                disabled={disabled}
                value={
                  field.value === null || field.value === undefined
                    ? ''
                    : typeof field.value === 'boolean'
                      ? field.value.toString()
                      : field.value
                }
                onChange={(e) =>
                  inputType === 'number'
                    ? field.onChange(
                        e.target.value === '' ? null : Number(e.target.value),
                      )
                    : field.onChange(e.target.value)
                }
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ProductFormField;
