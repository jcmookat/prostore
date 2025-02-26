import NextAuth from 'next-auth';
import { prisma } from '@/db/prisma';
import { compareSync } from 'bcrypt-ts-edge';
import { cookies } from 'next/headers';
import { authConfig } from './auth.config';
import CredentialsProvider from 'next-auth/providers/credentials';

export const config = {
	pages: {
		signIn: '/sign-in',
		error: '/sign-in',
	},
	session: {
		strategy: 'jwt' as const,
		maxAge: 60 * 60 * 24 * 30, // 30 days
	},
	providers: [
		CredentialsProvider({
			credentials: {
				email: { type: 'email' },
				password: { type: 'password' },
			},
			async authorize(credentials) {
				if (credentials == null) return null;

				// Find user in database
				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email as string,
					},
				});

				// Check if user exists and if the password matches
				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password,
					);
					// If password is correct, return user
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					}
				}
				// If user does not exist, or password does not much return null
				return null;
			},
		}),
	],
	callbacks: {
		async session({ session, user, trigger, token }: any) {
			// Set the user ID from the token
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;

			// If there is an update, set the user name
			if (trigger === 'update') {
				session.user.name = user.name;
			}

			return session;
		},
		async jwt({ token, user, trigger, session }: any) {
			// Assign user fields to token
			if (user) {
				token.id = user.id;
				token.role = user.role;

				// If user has no name, then use the first part of email (ex, google auth provider)
				if (user.name === 'NO_NAME') {
					token.name = user.email!.split('@')[0];

					// Update database to reflect token name
					await prisma.user.update({
						where: { id: user.id },
						data: { name: token.name },
					});
				}

				// Persist Session Cart - Check trigger
				if (trigger === 'signIn' || trigger === 'signUp') {
					// Get sessionCartId from cookies
					const cookiesObject = await cookies();
					const sessionCartId = cookiesObject.get('sessionCartId')?.value;

					if (sessionCartId) {
						// Get from DB
						const sessionCart = await prisma.cart.findFirst({
							where: { sessionCartId: sessionCartId },
						});

						if (sessionCart) {
							// Delete current user cart
							await prisma.cart.deleteMany({
								where: { userId: user.id },
							});

							// Assign new cart
							await prisma.cart.update({
								where: { id: sessionCart.id },
								data: { userId: user.id },
							});
						}
					}
				}
			}

			// Handle session updates
			if (session?.user.name && trigger === 'update') {
				token.name = session.user.name;
			}
			return token;
		},
		// Redirects users to /cart after sign-in
		// async redirect({ url, baseUrl }: any) {
		// 	return baseUrl + '/cart';
		// },
		...authConfig.callbacks,
	},
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
