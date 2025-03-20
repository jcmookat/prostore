'use client';
import { useState, useTransition, type ReactElement } from 'react';
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
import { useForm } from 'react-hook-form';
import ReviewFormField from './review-form-field';
import { Form } from '@/components/ui/form';
import { REVIEW_RATINGS } from '@/lib/constants';
import SubmitButton from '@/components/shared/submit-button';

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

  // const [isPending, startTransition] = useTransition();

  const handleOpenForm = () => {
    setOpen(true);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default">
        Write a review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form method="POST">
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <ReviewFormField
                name="title"
                label="Title"
                placeholder="Enter title"
                formControl={form.control}
              />
              <ReviewFormField
                name="description"
                label="Description"
                placeholder="Enter description"
                inputType="textarea"
                formControl={form.control}
              />
              <ReviewFormField
                name="rating"
                label="Rating"
                placeholder="Select a rating"
                inputType="select"
                dataArr={REVIEW_RATINGS}
                formControl={form.control}
              />
            </div>
            <DialogFooter>
              <SubmitButton
                buttonLabel="Submit"
                isPendingLabel="Submitting..."
                isPending={form.formState.isSubmitting}
                withIcon={false}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
