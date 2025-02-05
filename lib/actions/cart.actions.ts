'use server';

import { cookies } from 'next/headers';

import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';

// Calculate cart prices
const calcPrice = (items: CartItem[]) => {
	const itemsPrice = round2(
			items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0),
		),
		shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
		taxPrice = round2(0.15 * itemsPrice),
		totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

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

		// Find product from database
		const product = await prisma.product.findFirst({
			where: { id: item.productId }, // 'id' is the product ID in the DB, 'productId' is the requested item's id (based on cartItemSchema)
		});
		if (!product) throw new Error('Product not found');

		if (!cart) {
			// Create new cart object
			const newCart = insertCartSchema.parse({
				userId: userId,
				items: [item], // when we are adding an item to cart, it is a single item but items is an array, so we can just pass the item inside a bracket [item]
				sessionCartId: sessionCartId,
				...calcPrice([item]),
			});
			// Add cart to database
			await prisma.cart.create({
				data: newCart,
			});

			// Revalidate product page
			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} added to cart`,
			};
		} else {
			// Check if item is already in cart. getting value,
			const existItem = (cart.items as CartItem[]).find(
				(thisItem) => thisItem.productId === item.productId,
			);
			// then check
			if (existItem) {
				// Check stock
				if (product.stock < existItem.qty + 1) {
					throw new Error('Not enough stock');
				}

				// Increase the quantity
				(cart.items as CartItem[]).find(
					(thisItem) => thisItem.productId === item.productId,
				)!.qty = existItem.qty + 1;
			} else {
				// If item does not exist in cart
				// Check stock
				if (product.stock < 1) throw new Error('Not enough stock');

				// Add item to the cart.items
				cart.items.push(item);
			}
			// Save to database
			await prisma.cart.update({
				where: { id: cart.id },
				data: {
					items: cart.items,
					...calcPrice(cart.items),
				},
			});

			// Revalidate page
			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: `${product.name} ${
					existItem ? 'updated in' : 'added to'
				} cart`,
			};
		}
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
