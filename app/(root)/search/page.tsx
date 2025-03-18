import Pagination from '@/components/shared/pagination';
import ProductCard from '@/components/shared/product/product-card';
import { getAllProducts } from '@/lib/actions/product.actions';
import { type ReactElement } from 'react';

export default async function SearchPage(props: {
	searchParams?: Promise<{
		q?: string;
		category?: string;
		price?: string;
		rating?: string;
		sort?: string;
		page?: string;
	}>;
}): Promise<ReactElement> {
	const searchParams = (await props.searchParams) ?? {};
	const {
		q = 'all',
		category = 'all',
		price = 'all',
		rating = 'all',
		sort = 'newest',
		page = '1',
	} = searchParams;

	const { data: products, totalPages } = await getAllProducts({
		query: q,
		category,
		price,
		rating,
		sort,
		page: Number(page),
	});
	return (
		<div className='grid md:grid-cols-5 md:gap-5'>
			<div className='filter-links'>Filters</div>
			<div className='md:col-span-4 space-y-4'>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
					{products.length === 0 && <div>No product found</div>}
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
					{totalPages > 1 && <Pagination page={page} totalPages={totalPages} />}
				</div>
			</div>
		</div>
	);
}
