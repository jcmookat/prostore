'use client';
import { type ReactElement } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { formUrlQuery } from '@/lib/utils';
import Link from 'next/link';

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

	const onClick = (btnType: string) => {
		const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: urlParamName || 'page',
			value: pageValue.toString(),
		});

		router.push(newUrl);
	};
	// Generate an array of page numbers to display
	const pageNumbers = [];
	for (let i = 1; i <= Number(totalPages); i++) {
		pageNumbers.push(i);
	}

	return (
		<div className='flex gap-2'>
			<Button
				variant='outline'
				className='w-28'
				disabled={Number(page) <= 1}
				onClick={() => onClick('prev')}>
				Previous
			</Button>
			{/* Render page numbers */}
			{pageNumbers.map((pageNumber) => (
				<Button
					asChild
					key={pageNumber}
					variant={Number(page) === pageNumber ? 'secondary' : 'outline'}
					className='w-10'
					disabled={Number(page) === pageNumber}>
					<Link href={`/user/orders/?page=${pageNumber}`}>{pageNumber}</Link>
				</Button>
			))}

			{/* Loop through totalPages and render buttons */}
			{/* {(() => {
        const buttons = [];
        for (let i = 1; i <= Number(totalPages); i++) {
          buttons.push(
            <Button
              key={i}
              variant={Number(page) === i ? 'secondary' : 'outline'}
              className="w-10"
              disabled={Number(page) === i}
            >
              <Link href={`/user/orders/?page=${i}`}>{i}</Link>
            </Button>,
          );
        }
        return buttons;
      })()} */}
			<Button
				variant='outline'
				className='w-28'
				disabled={Number(page) >= totalPages}
				onClick={() => onClick('next')}>
				Next
			</Button>
		</div>
	);
}
