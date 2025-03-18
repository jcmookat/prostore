'use server';
import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

// Get latest products
export async function getLatestProducts() {
	const products = await prisma.product.findMany({
		take: LATEST_PRODUCTS_LIMIT,
		orderBy: { createdAt: 'desc' },
	});

	if (!products || products.length === 0) {
		throw new Error('No products found');
	}
	return convertToPlainObject(products);
}

// Get single product by its slug
export async function getProductBySlug(slug: string) {
	const product = await prisma.product.findFirst({
		where: { slug: slug },
	});
	if (!product) throw new Error('Product not found');
	return convertToPlainObject(product);
}

// Get single product by id
export async function getProductById(productId: string) {
	const product = await prisma.product.findFirst({
		where: { id: productId },
	});
	if (!product) throw new Error('Product not found');
	return convertToPlainObject(product);
}

// Get all products
export async function getAllProducts({
	query,
	limit = PAGE_SIZE,
	page,
	category,
	price,
	rating,
	sort,
}: {
	query: string;
	limit?: number;
	page: number;
	category?: string;
	price?: string;
	rating?: string;
	sort?: string;
}) {
	try {
		// Query filter
		const queryFilter: Prisma.ProductWhereInput =
			query && query !== 'all'
				? {
						name: {
							contains: query,
							mode: 'insensitive',
						} as Prisma.StringFilter,
				  }
				: {};

		// Category filter
		const categoryFilter =
			category && category !== 'all' ? { category: category } : {};

		// Price filter
		const priceFilter: Prisma.ProductWhereInput =
			price && price !== 'all'
				? {
						price: {
							gte: Number(price.split('-')[0]),
							lte: Number(price.split('-')[1]),
						},
				  }
				: {};

		// Rating filter
		const ratingFilter =
			rating && rating !== 'all' ? { rating: { gte: Number(rating) } } : {};

		// Fetch products
		const data = await prisma.product.findMany({
			where: {
				...queryFilter,
				...categoryFilter,
				...priceFilter,
				...ratingFilter,
			},
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
		});

		const dataCount = await prisma.product.count();
		const totalPages = Math.ceil(dataCount / limit);

		return {
			data: convertToPlainObject(data),
			totalPages,
			success: true,
			message: 'Successfully fetched all products.',
		};
	} catch (error) {
		console.error('Error on fetching products.', error);
		throw new Error('Failed to fetch products. Try again later.');
	}
}

// Get product categories
export async function getAllCategories() {
	const categories = await prisma.product.groupBy({
		by: ['category'],
		_count: true,
	});

	if (!categories || categories.length === 0) {
		throw new Error('No categories found');
	}

	return convertToPlainObject(categories);
}

// Delete a product
export async function deleteProduct(id: string) {
	try {
		const productExists = await prisma.product.findFirst({
			where: { id },
		});

		if (!productExists) throw new Error('Product not found');

		await prisma.product.delete({ where: { id } });

		revalidatePath('/admin/products');

		return {
			success: true,
			message: 'Product deleted successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Create Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
	try {
		// Validate and create product
		const product = insertProductSchema.parse(data);
		await prisma.product.create({ data: product });

		revalidatePath('/admin/products');

		return {
			success: true,
			message: 'Product created successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Update Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
	try {
		// Validate and find product
		const product = updateProductSchema.parse(data);
		const productExists = await prisma.product.findFirst({
			where: { id: product.id },
		});

		if (!productExists) throw new Error('Product not found');

		// Update product
		await prisma.product.update({
			where: { id: product.id },
			data: product,
		});

		revalidatePath('/admin/products');

		return {
			success: true,
			message: 'Product updated successfully',
		};
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

// Get featured products
export async function getFeaturedProducts() {
	const products = await prisma.product.findMany({
		where: { isFeatured: true },
		orderBy: { createdAt: 'desc' },
		take: 4,
	});

	if (!products || products.length === 0) {
		throw new Error('No featured products found');
	}

	return convertToPlainObject(products);
}
