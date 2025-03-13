import ProductList from '@/components/shared/product/product-list';
import {
	getLatestProducts,
	getFeaturedProducts,
} from '@/lib/actions/product.actions';
import ProductCarousel from '@/components/shared/product/product-carousel';

const Homepage = async () => {
	// async - we can do this because it is a server component
	const { data: latestProducts } = await getLatestProducts();
	const { data: featuredProducts } = await getFeaturedProducts();
	return (
		<>
			{featuredProducts.length > 0 && (
				<ProductCarousel data={featuredProducts} />
			)}
			<ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
		</>
	);
};
export default Homepage;
