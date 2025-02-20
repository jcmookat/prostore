import { Metadata } from 'next';
import { getOrderById } from '@/lib/actions/order.actions';
import { notFound, redirect } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';
import { auth } from '@/auth';

export const metadata: Metadata = {
	title: 'Order Details',
};

const OrderDetailsPage = async (props: {
	params: Promise<{
		id: string;
	}>;
}) => {
	// Get order ID
	const { id } = await props.params;
	const order = await getOrderById(id);
	if (!order) notFound();

	// Get session
	const session = await auth();
	const userId = session?.user?.id;
	if (!userId) throw new Error('No User ID');

	// Redirect the user if they don't own the order
	if (order.userId !== session?.user?.id) {
		return redirect('/unauthorized');
	}

	return (
		<>
			<OrderDetailsTable
				order={{
					...order,
					shippingAddress: order.shippingAddress as ShippingAddress,
				}}
				paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
			/>
		</>
	);
};

export default OrderDetailsPage;
