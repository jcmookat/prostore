'use server';

import { z } from 'zod';
import { insertReviewSchema } from '../validators';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>,
) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    // Validate and store review data and userId
    const review = insertReviewSchema.parse({
      ...data,
      userId: session?.user?.id,
    });

    // Get the product being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });

    if (!product) throw new Error('Product not found');

    // Check if use has already reviewed this product
    const reviewExists = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    // If review exists, update it, otherwise create a new one
    await prisma.$transaction(async (tx) => {
      let message = '';
      if (reviewExists) {
        // Update the review
        await tx.review.update({
          where: { id: reviewExists.id },
          data: {
            description: review.description,
            title: review.title,
            rating: review.rating,
          },
        });
        message = 'Review updated successfully';
      } else {
        // Create a new review
        await tx.review.create({ data: review });
        message = 'Review submitted successfully';
      }

      // Get the average rating
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      // Get the number of reviews
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      // Update rating and number of reviews (product table)
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews: numReviews,
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message,
      };
    });
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
