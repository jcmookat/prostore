'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactElement } from 'react';
import { Input } from '../ui/input';
import { useDebouncedCallback } from 'use-debounce';

export default function AdminSearch(): ReactElement {
  const pathname = usePathname();
  const { replace } = useRouter();

  // const formActionUrl = pathname.includes('/admin/orders')
  //   ? '/admin/orders'
  //   : pathname.includes('/admin/users')
  //     ? '/admin/users'
  //     : '/admin/products';

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get('query') || '');

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '');
  }, [searchParams]);

  // const handleSearch = useDebouncedCallback(
  //   (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const newQuery = e.target.value;
  //     setQueryValue(newQuery);
  //
  //     const params = new URLSearchParams(searchParams);
  //     if (newQuery) {
  //       params.set('query', newQuery);
  //     } else {
  //       params.delete('query');
  //     }
  //
  //     replace(`${pathname}?${params.toString()}`);
  //   },
  //   300,
  // );
  const updateSearchParams = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQueryValue(newQuery);
    updateSearchParams(newQuery);
  };
  return (
    <>
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={handleSearch}
        className="md:w-[100px] lg:w-[300px]"
      />
    </>
  );
}
