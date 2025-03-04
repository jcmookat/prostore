'use client';

import { ArrowRight, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ProductButton = ({
  isPending = false,
  formType,
}: {
  isPending: boolean;
  formType: 'Create' | 'Update';
}) => {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="button col-span-2 w-full"
      size="lg"
      variant="default"
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <ArrowRight className="w-4 h-4" />
      )}
      {formType} Product
    </Button>
  );
};
export default ProductButton;
