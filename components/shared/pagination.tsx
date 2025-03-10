'use client';
import { type ReactElement } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

export default function Pagination({
  page,
  totalPages,
  urlParamName,
}: PaginationProps): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };
  return (
    <div className="flex gap-2 justify-center mt-5">
      <Button
        variant="outline"
        className="w-10"
        disabled={Number(page) <= 1}
        onClick={() => onClick('prev')}
      >
        <ChevronLeft />
      </Button>
      {[...new Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <Button
            asChild
            key={pageNumber}
            variant={Number(page) === pageNumber ? 'default' : 'outline'}
            className="w-10"
            disabled={Number(page) === pageNumber}
          >
            <Link
              href={{
                pathname: pathName,
                query: {
                  page: pageNumber,
                },
              }}
            >
              {pageNumber}
            </Link>
          </Button>
        );
      })}
      <Button
        variant="outline"
        className="w-10"
        disabled={Number(page) >= totalPages}
        onClick={() => onClick('next')}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
