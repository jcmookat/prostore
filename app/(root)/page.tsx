import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';

const Homepage = async () => {
	// async - we can do this because it is a server component
	const latestProducts = await getLatestProducts();
	return (
		<>
			<ProductList data={latestProducts} title='Newest Arrivals' limit={4} />
		</>
	);
};
export default Homepage;
