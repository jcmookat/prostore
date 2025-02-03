'use server';

import { cookies } from 'next/headers';

import { CartItem } from '@/types';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema } from '../validators';

export async function addItemToCart(data: CartItem) {
	try {
		// Check for the cart cookie
		// we wanna use the cookies.get method, which is now asynchronous so we have to use await. Wrap in parentheses. For the get, we put the name of the cookie we want. We want to get the value, we use the optional '?' so that it will not throw an error
		const sessionCartId = (await cookies()).get('sessionCartId')?.value;
		if (!sessionCartId) throw new Error('Cart session not found');

		// Get session and user ID. Get them with the auth function
		const session = await auth();
		const userId = session?.user?.id ? (session.user.id as string) : undefined;

		// Get cart
		const cart = await getMyCart();

		// Parse and validate item
		const item = cartItemSchema.parse(data);

		// Get Product from database
		const product = await prisma.product.findFirst({
			where: { id: item.productId }, // 'id' is the product ID in the DB, 'productId' is the requested item's id (based on cartItemSchema)
		});

		// TESTING
		console.log({
			'Session Cart ID': sessionCartId,
			'User ID': userId,
			'Item Requested': item,
			'Product Found': product,
		});
		return {
			success: true,
			message: 'Item added to cart',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getMyCart() {
	// Check for the cart cookie
	const sessionCartId = (await cookies()).get('sessionCartId')?.value;
	if (!sessionCartId) throw new Error('Cart session not found');

	// Get session and user ID. Get them with the auth function
	const session = await auth();
	const userId = session?.user?.id ? (session.user.id as string) : undefined;

	// Get users cart by the userId from database, if guest by sessionID
	const cart = await prisma.cart.findFirst({
		where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
	});

	if (!cart) return undefined;

	// Convert decimals and return
	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
}
