import { z } from "zod";

const API_URL = import.meta.env.VITE_API_URL!;

const userSchema = z.object({
	id: z.number(),
	fullName: z.string(),
	email: z.string(),
	role: z.enum(["admin", "user"]),
	accountStatus: z.enum(["active", "suspended", "deleted"]),
	isVerified: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

const productSchema = z.object({
	id: z.number(),
	name: z.string(),
	price: z.number(),
	imageUrl: z.string(),
	quantityLeft: z.number(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const api = {
	getMe: async () => {
		const res = await fetch(`${API_URL}/me`);
		const data = await res.json();
		return userSchema.parse(data);
	},
	getProducts: async () => {
		const res = await fetch(`${API_URL}/products`);
		const data = await res.json();
		return productSchema.array().parse(data?.products);
	},
	sendLogInEmail: async (email: string) => {
		const res = await fetch(`${API_URL}/auth/log-in`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});
		const data = await res.json();
		return data;
	},
	getCart: async () => {
		const res = await fetch(`${API_URL}/carts`);
		const data = await res.json();
		return data;
	},
	addToCart: async (productId: number) => {
		const res = await fetch(`${API_URL}/carts/${productId}`, {
			method: "POST",
		});
		const data = await res.json();
		return data;
	},
	updateCartItemQuantity: async (productId: number, quantity: number) => {
		const res = await fetch(`${API_URL}/carts/${productId}/${quantity}`, {
			method: "PUT",
		});
		const data = await res.json();
		return data;
	},
} as const;
