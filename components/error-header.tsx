'use client';

import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import logo from '@/public/images/logo.svg';
import Link from 'next/link';

export default function ErrorHeader() {
	return (
		<header className='w-full border-b'>
			<div className='wrapper flex-between'>
				<div className='flex-start'>
					<Link href='/' className='flex-start ml-4'>
						<Image
							src={logo}
							alt={`${APP_NAME} logo`}
							height={48}
							width={48}
							priority={true}
						/>
						<span className='hidden lg:block font-bold text-2xl ml-3'>
							{APP_NAME}
						</span>
					</Link>
				</div>
			</div>
		</header>
	);
}
