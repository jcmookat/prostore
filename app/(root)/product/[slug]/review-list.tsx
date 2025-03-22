'use client';
import { useState, type ReactElement } from 'react';
import { Review } from '@/types';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, Check, User } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import ReviewForm from './review-form';

export default function ReviewList({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}): ReactElement {
  const [reviews, setReviews] = useState<Review[]>([]);

  const reload = async () => {
    console.log('review submitted');
  };
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={reload}
        />
      ) : (
        <div>
          Please{' '}
          <Link
            className="text-blue-700 px-1"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>{' '}
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">Reviews here</div>
    </div>
  );
}
