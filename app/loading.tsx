import Image from 'next/image';
import loader from '@/assets/loader.gif';

const LoadingPage = () => {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<Image
				src={loader}
				height='0'
				width='0'
				alt='Loading...'
				style={{ width: '150px', height: 'auto' }}
				priority={true}
			/>
		</div>
	);
};
export default LoadingPage;
