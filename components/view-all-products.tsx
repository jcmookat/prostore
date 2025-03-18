import { type ReactElement } from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

export default function ViewAllProductsButton(): ReactElement {
  return (
    <div className="flex justify-center items-center my-8">
      <Button asChild className="px-8 py-4 text-lg font-semibold">
        <Link href="/search">View All Products</Link>
      </Button>
    </div>
  );
}
