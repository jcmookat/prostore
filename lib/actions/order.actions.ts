'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { CartItem, PaymentResult, SalesDataType } from '@/types';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';
import { PAGE_SIZE } from '../constants';
import { Prisma } from '@prisma/client';

// Create order and create the order items
export async function createOrder() {
	try {
		const session = await auth();
		if (!session) throw new Error('User is not authenticated');

		const cart = await getMyCart();
		const userId = session?.user?.id;

		if (!userId) throw new Error('User not found');

		const user = await getUserById(userId);

		if (!cart || cart.items.length === 0) {
			return {
				success: false,
				message: 'Your cart is empty',
				redirectTo: '/cart',
			};
		}

		if (!user.address) {
			return {
				success: false,
				message: 'No shipping address',
				redirectTo: '/shipping-address',
			};
		}

		if (!user.paymentMethod) {
			return {
				success: false,
				message: 'No payment method',
				redirectTo: '/payment-method',
			};
		}

		// Create order object (validate with insertOrderSchema by parsing)
		const order = insertOrderSchema.parse({
			userId: user.id,
			shippingAddress: user.address,
			paymentMethod: user.paymentMethod,
			itemsPrice: cart.itemsPrice,
			shippingPrice: cart.shippingPrice,
			taxPrice: cart.taxPrice,
			totalPrice: cart.totalPrice,
		});

		// Create a transaction to create order and order items in database
		const insertedOrderId = await prisma.$transaction(async (tx) => {
			// Create order
			const insertedOrder = await tx.order.create({ data: order });
			// Create order items from the cart items
			for (const item of cart.items as CartItem[]) {
				await tx.orderItem.create({
					data: {
						...item,
						price: item.price,
						orderId: insertedOrder.id,
					},
				});
			}
			// Clear cart
			await tx.cart.update({
				where: { id: cart.id },
				data: {
					items: [],
					totalPrice: 0,
					taxPrice: 0,
					shippingPrice: 0,
					itemsPrice: 0,
				},
			});

			return insertedOrder.id;
		});
		if (!insertedOrderId) throw new Error('Order not created');

		return {
			success: true,
			message: 'Order created',
			redirectTo: `/order/${insertedOrderId}`,
		};
	} catch (error) {
		if (isRedirectError(error)) throw error;
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Get order by id
export async function getOrderById(orderId: string) {
	const data = await prisma.order.findFirst({
		where: { id: orderId },
		include: {
			// when we get the order, we want to include the items
			orderItems: true,
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
	});
	return {
		data: convertToPlainObject(data),
		success: true,
		message: 'Successfull fetched order by ID.',
	};
}

// Create new paypal order
// Get order id from database. Paypal order id is different from orderId. Paypal creates an order id and will be added to the paymentResult {}
export async function createPayPalOrder(orderId: string) {
	try {
		// Get order from database
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});

		if (order) {
			// Create a paypal order
			const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

			// Update the order with the paypal order id (paymentResult {})
			await prisma.order.update({
				where: { id: orderId },
				data: {
					paymentResult: {
						id: paypalOrder.id,
						email_address: '', // not completed at this point, so it will be empty
						status: '',
						pricePaid: 0,
					},
				},
			});

			// Return the paypal order id
			return {
				success: true,
				message: 'Paypal order created successfully',
				data: paypalOrder.id,
			};
		} else {
			throw new Error('Order not found');
		}
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Approve paypal order
// orderId -> Order Id (uuid)
// orderID -> Paypal order ID
export async function approvePayPalOrder(
	orderId: string,
	data: { orderID: string },
) {
	try {
		// Get order from database
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});

		if (!order) throw new Error('Order not found');

		// data.orderID -> Paypal order ID
		const captureData = await paypal.capturePayment(data.orderID);

		// Compare id from paypal and id from paymentResult database, check if status is COMPLETED

		if (
			!captureData ||
			captureData.id !== (order.paymentResult as PaymentResult)?.id ||
			captureData.status !== 'COMPLETED'
		) {
			throw new Error('Error in PayPal payment');
		}

		// Update order to paid (isPaid and paidAt)
		await updateOrderToPaid({
			orderId,
			paymentResult: {
				id: captureData.id,
				status: captureData.status,
				email_address: captureData.payer.email_address,
				pricePaid:
					captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
			},
		});

		// Revalidate
		revalidatePath(`/order/${orderId}`);

		return {
			success: true,
			message: 'Your order has been successfully paid by PayPal',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update order to paid
async function updateOrderToPaid({
	orderId,
	paymentResult,
}: {
	orderId: string;
	paymentResult?: PaymentResult;
}) {
	try {
		// Find the order in the database and include the order items
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
			include: {
				orderItems: true,
			},
		});

		if (!order) throw new Error('Order not found');

		if (order.isPaid) throw new Error('Order is already paid');

		// Transaction to update order and account for product stock
		await prisma.$transaction(async (tx) => {
			// Iterate over products and update stock
			for (const item of order.orderItems) {
				await tx.product.update({
					where: { id: item.productId },
					data: { stock: { increment: -item.qty } },
				});
			}

			// Set the order to paid
			await tx.order.update({
				where: { id: orderId },
				data: {
					isPaid: true,
					paidAt: new Date(),
					paymentResult: paymentResult,
				},
			});
		});

		// Get updated order after transaction
		const updatedOrder = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
			include: {
				orderItems: true,
				user: {
					select: { name: true, email: true },
				},
			},
		});

		if (!updatedOrder) {
			throw new Error('Order not found');
		}

		return {
			success: true,
			message: 'Successfully updated order to paid',
		};
	} catch (error) {
		console.error('Error in updating order to paid.', error);
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Get user's orders
export async function getMyOrders({
	limit = PAGE_SIZE,
	page,
}: {
	limit?: number;
	page: number;
}) {
	const session = await auth();
	if (!session) throw new Error('User is not authenticated');

	const userId = session?.user?.id;

	const data = await prisma.order.findMany({
		where: { userId: userId },
		orderBy: { createdAt: 'desc' },
		take: limit,
		skip: (page - 1) * limit, // for pagination, for example, you have 6 total orders and you are in the second page, you wanna skip the first 3
	});

	const dataCount = await prisma.order.count({
		where: { userId: userId },
	});
	const totalPages = Math.ceil(dataCount / limit);

	return {
		data,
		totalPages,
		success: true,
		message: 'Successfully fetched orders.',
	};
}

// Get sales data and order summary
export async function getOrderSummary() {
	// Get counts for each resource
	const ordersCount = await prisma.order.count();
	const productsCount = await prisma.product.count();
	const usersCount = await prisma.user.count();

	// Calculate total sales
	const totalSales = await prisma.order.aggregate({
		_sum: { totalPrice: true },
	});

	// Get monthly sales
	const salesDataRaw = await prisma.$queryRaw<
		Array<{ month: string; totalSales: Prisma.Decimal }>
	>`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY');`;
	// field - "createdAt", format - 'MM/YY', as alias of "month". "Order" - table
	const salesData: SalesDataType = salesDataRaw.map((entry) => ({
		month: entry.month,
		totalSales: Number(entry.totalSales), // Convert Decimal to number
	}));

	// Get latest sales
	const latestSales = await prisma.order.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			user: { select: { name: true } },
		},
		take: 6,
	});

	return {
		ordersCount,
		productsCount,
		usersCount,
		totalSales,
		latestSales,
		salesData,
	};
}

// Get All Orders (Admin)
export async function getAllOrders({
	limit = PAGE_SIZE,
	page,
	query,
}: {
	limit?: number;
	page: number;
	query?: string;
}) {
	const queryFilter: Prisma.OrderWhereInput =
		query && query !== 'all'
			? {
					user: {
						name: {
							contains: query,
							mode: 'insensitive',
						} as Prisma.StringFilter,
					},
			  }
			: {};
	const data = await prisma.order.findMany({
		where: {
			...queryFilter,
		},
		orderBy: { createdAt: 'desc' },
		take: limit,
		skip: (page - 1) * limit,
		include: { user: { select: { name: true } } },
	});

	const dataCount = await prisma.order.count();
	const totalPages = Math.ceil(dataCount / limit);

	return {
		data,
		totalPages,
		success: true,
		message: 'Successfully fetced all orders.',
	};
}

// Delete an order
export async function deleteOrder(id: string) {
	try {
		await prisma.order.delete({ where: { id } });

		revalidatePath('/admin/orders');

		return {
			success: true,
			message: 'Order deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update COD order to paid
export async function updateOrderToPaidByCOD(orderId: string) {
	try {
		await updateOrderToPaid({ orderId });
		revalidatePath(`/order/${orderId}`);
		return {
			success: true,
			message: 'Order marked as paid',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update Order to delivered
export async function deliverOrder(orderId: string) {
	try {
		const order = await prisma.order.findFirst({
			where: {
				id: orderId,
			},
		});

		if (!order) throw new Error('Order not found');
		if (!order.isPaid) throw new Error('Order is not paid');

		await prisma.order.update({
			where: { id: orderId },
			data: {
				isDelivered: true,
				deliveredAt: new Date(),
			},
		});

		revalidatePath(`/order/${orderId}`);

		return {
			success: true,
			message: 'Order delivered successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}
