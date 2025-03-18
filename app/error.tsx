'use client';

import ErrorContent from '@/components/error-content';
import ErrorHeader from '@/components/error-header';
import Footer from '@/components/shared/footer';

export default function Error({
	error,
}: {
	error: Error & { digest?: string };
}) {
	return (
		<>
			<ErrorHeader />
			<main className='flex-1'>
				<ErrorContent error={error} />
			</main>
			<Footer />
		</>
	);
}
