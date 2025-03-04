import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { auth } from '@/auth';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // Product images
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError('Unauthorized');
      return { userId: session?.user?.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),

  // Product banner for isFeatured
  bannerImageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new UploadThingError('Unauthorized');
      return { userId: session?.user?.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
