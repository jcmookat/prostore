import { Metadata } from 'next';
import { getMyOrders } from '@/lib/actions/order.actions';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
	title: 'My Orders',
};

const OrdersPage = async (props: {
	searchParams?: Promise<{ page?: string }>;
}) => {
	const searchParams = await props.searchParams;
	const page = Number(searchParams?.page) || 1;
	const orders = await getMyOrders({
		page,
	});
	const { data, totalPages } = orders;

	return (
		<div className='space-y-2'>
			<h2 className='h2-bold'>Orders</h2>
			<div className='overflow-x-auto'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>DATE</TableHead>
							<TableHead>TOTAL</TableHead>
							<TableHead>PAYMENT METHOD</TableHead>
							<TableHead>PAID</TableHead>
							<TableHead>DELIVERED</TableHead>
							<TableHead>ACTIONS</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((order) => (
							<TableRow key={order.id}>
								<TableCell>{formatId(order.id)}</TableCell>
								<TableCell>
									{formatDateTime(order.createdAt).dateTime}
								</TableCell>
								<TableCell>{formatCurrency(order.totalPrice)}</TableCell>
								<TableCell>{order.paymentMethod}</TableCell>
								<TableCell>
									{order.isPaid && order.paidAt ? (
										<>
											<Badge variant='default' className='mr-1'>
												Paid
											</Badge>{' '}
											{formatDateTime(order.paidAt).dateTime}
										</>
									) : (
										<Badge variant='secondary'>Not paid</Badge>
									)}
								</TableCell>
								<TableCell>
									{order.isDelivered && order.deliveredAt ? (
										<>
											<Badge variant='default' className='mr-1'>
												Delivered
											</Badge>{' '}
											{formatDateTime(order.deliveredAt).dateTime}
										</>
									) : (
										<Badge variant='secondary'>Not delivered</Badge>
									)}
								</TableCell>
								<TableCell>
									<Button asChild variant='outline' size='sm'>
										<Link href={`/order/${order.id}`}>Details</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{totalPages > 1 && (
					<Pagination
						page={page}
						totalPages={totalPages}
						pathName='/user/orders'
					/>
				)}
			</div>
		</div>
	);
};

export default OrdersPage;
