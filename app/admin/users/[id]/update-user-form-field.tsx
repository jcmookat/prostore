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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { UpdateUserFormFieldProps } from '@/types';

const UpdateUserFormField: React.FC<UpdateUserFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  disabled,
  formControl,
  dataArr,
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
                <span>{field.value ? 'Featured' : 'Not Featured'}</span>
              </div>
            ) : inputType === 'select' ? (
              <Select
                onValueChange={field.onChange}
                value={field.value.toString()}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {dataArr?.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : inputType === 'textarea' ? (
              // Handle multiline text input
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                value={
                  field.value === null || field.value === undefined
                    ? ''
                    : typeof field.value === 'boolean' ||
                        typeof field.value === 'number'
                      ? String(field.value)
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
                    : typeof field.value === 'boolean' ||
                        typeof field.value === 'number'
                      ? String(field.value)
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

export default UpdateUserFormField;
