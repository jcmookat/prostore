'use client';
import { useState, type ReactElement } from 'react';
import { insertReviewSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { reviewFormDefaultValues } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { REVIEW_RATINGS } from '@/lib/constants';
import SubmitButton from '@/components/shared/submit-button';
import BaseFormField from '@/components/shared/base-form-field';
import { createUpdateReview } from '@/lib/actions/review.actions';

export default function ReviewForm({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted?: () => void;
}): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  // Form Open Handler
  const handleOpenForm = () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);
    setOpen(true);
  };

  // Form Submit Handler
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values,
  ) => {
    const res = await createUpdateReview({ ...values, productId });
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
      return;
    }

    setOpen(false);

    onReviewSubmitted?.();

    toast({
      description: res.message,
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default">
        Write a review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <BaseFormField<typeof insertReviewSchema>
                name="title"
                label="Title"
                placeholder="Enter title"
                formControl={form.control}
              />
              <BaseFormField<typeof insertReviewSchema>
                name="description"
                label="Description"
                placeholder="Enter description"
                inputType="textarea"
                formControl={form.control}
              />
              <BaseFormField<typeof insertReviewSchema>
                name="rating"
                label="Rating"
                placeholder="Select a rating"
                inputType="select"
                dataArr={REVIEW_RATINGS}
                formControl={form.control}
                selectIcon={true}
              />
            </div>
            <DialogFooter>
              <SubmitButton
                buttonLabel="Submit"
                isPendingLabel="Submitting..."
                isPending={form.formState.isSubmitting}
                withIcon={true}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
