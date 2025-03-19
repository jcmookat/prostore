import Pagination from '@/components/shared/pagination';
import ProductCard from '@/components/shared/product/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  getAllCategories,
  getAllProducts,
} from '@/lib/actions/product.actions';
import Link from 'next/link';
import { type ReactElement } from 'react';

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $100',
    value: '51-100',
  },
  {
    name: '$101 to $200',
    value: '101-200',
  },
  {
    name: '$201 to $500',
    value: '201-500',
  },
  {
    name: '$501 to $1000',
    value: '501-1000',
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ''}
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating} stars` : ''}
      `,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}
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

  // Construct filter URL
  const getFilterUrl = ({
    c,
    p,
    r,
    s,
    pg,
  }: {
    c?: string;
    p?: string;
    r?: string;
    s?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (s) params.sort = s;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const { data: products, totalPages } = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className="mb-4">
          {/* Category Links */}
          <div className="text-xl mt-3 mb-2">Department</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === 'all' || category === '') && 'font-bold'
                }`}
                href={getFilterUrl({ c: 'all' })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${x.category === category && 'font-bold'}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          {/* Price Links */}
          <div className="text-xl mt-3 mb-2">Price</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === 'all' && 'font-bold'}`}
                href={getFilterUrl({ p: 'all' })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  className={`${p.value === price && 'font-bold'}`}
                  href={getFilterUrl({ p: p.value })}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          {/* Rating Links */}
          <div className="text-xl mt-3 mb-2">Customer Ratings</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${rating === 'all' && 'font-bold'}`}
                href={getFilterUrl({ r: 'all' })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  className={`${r.toString() === rating && 'font-bold'}`}
                  href={getFilterUrl({ r: `${r}` })}
                >
                  {`${r} ${r > 1 ? 'stars' : 'star'} and up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== 'all' && q !== '' && (
              <Badge variant="secondary" className="mr-1">
                Query: {q}
              </Badge>
            )}
            {category !== 'all' && category !== '' && (
              <Badge variant="secondary" className="mr-1">
                Category: {category}
              </Badge>
            )}
            {price !== 'all' && (
              <Badge variant="secondary" className="mr-1">
                Price: {price}
              </Badge>
            )}
            {rating !== 'all' && (
              <Badge variant="secondary" className="mr-1">
                Rating: {rating} {Number(rating) > 1 ? 'stars' : 'star'} and up
              </Badge>
            )}{' '}
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            rating !== 'all' ||
            price !== 'all' ? (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search">Clear</Link>
              </Button>
            ) : null}
          </div>
          <div>
            <span className="text-sm">Sort by</span>{' '}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-1 ${sort === s && 'font-bold'}`}
                href={getFilterUrl({ s: s })}
              >
                <Badge variant={sort === s ? 'secondary' : 'outline'}>
                  {s}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
