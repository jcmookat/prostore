'use client';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { formatError } from '@/lib/utils';

export default function ErrorContent({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Determine button text and action based on the route
  const getButtonConfig = () => {
    if (pathname?.includes('/admin/orders')) {
      return {
        text: 'Back to Orders',
        action: () => router.push('/admin/orders'),
      };
    }
    if (pathname?.includes('/admin/users')) {
      return {
        text: 'Back to Users',
        action: () => router.push('/admin/users'),
      };
    }
    if (pathname?.includes('/admin/products')) {
      return {
        text: 'Back to Products',
        action: () => router.push('/admin/products'),
      };
    }
    if (pathname?.includes('/product/')) {
      return {
        text: 'Back to Products',
        action: () => router.push('/search'),
      };
    }
    if (pathname?.includes('/order/')) {
      return {
        text: 'Back to Orders',
        action: () =>
          router.push(
            session?.user?.role === 'admin' ? '/admin/orders' : '/user/orders',
          ),
      };
    }
    // Default fallback
    return {
      text: 'Back to Home',
      action: () => router.push('/'),
    };
  };

  const buttonConfig = getButtonConfig();
  const errorMessage = formatError(error);

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <div className="p-6 w-1/3 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">{errorMessage}</h1>
        <p className="text-destructive">Something went wrong</p>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={buttonConfig.action}
        >
          {buttonConfig.text}
        </Button>
      </div>
    </div>
  );
}
