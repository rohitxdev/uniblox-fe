import { z } from "zod";

const userSchema = z.object({
	id: z.number(),
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

const cartItemSchema = z.object({
	id: z.number(),
	productId: z.number(),
	quantity: z.number(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

const couponSchema = z.object({
	id: z.number(),
	userId: z.number(),
	code: z.string(),
	discountPercent: z.number(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

const fetchApi = async (url: string, options?: RequestInit) => {
	return await fetch(import.meta.env.VITE_API_URL! + url, { credentials: "include", ...options });
};

export const api = {
	getMe: async () => {
		const res = await fetchApi("/me");
		const data = await res.json();
		return userSchema.parse(data);
	},
	getProducts: async () => {
		const res = await fetchApi("/products");
		const data = await res.json();
		return productSchema.array().parse(data?.products);
	},
	sendLogInEmail: async (email: string) => {
		const res = await fetchApi("/auth/log-in", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});
		const data = await res.json();
		return data;
	},
	logOut: async () => {
		const res = await fetchApi("/auth/log-out");
		const data = await res.json();
		return data;
	},
	getCart: async () => {
		const res = await fetchApi("/carts");
		const data = await res.json();
		return cartItemSchema.array().parse(data?.cart);
	},
	addToCart: async (productId: number) => {
		const res = await fetchApi(`/carts/${productId}`, {
			method: "POST",
		});
		const data = await res.json();
		return data;
	},
	updateCartItemQuantity: async (productId: number, quantity: number) => {
		const res = await fetchApi(`/carts/${productId}/${quantity}`, {
			method: "PUT",
		});
		const data = await res.json();
		return data;
	},
	deleteCartItem: async (productId: number) => {
		const res = await fetchApi(`/carts/${productId}`, {
			method: "DELETE",
		});
		const data = await res.json();
		return data;
	},
	getAvailableCoupons: async () => {
		const res = await fetchApi("/coupons");
		const data = await res.json();
		return couponSchema.array().parse(data?.coupons);
	},
	createOrder: async (couponCode?: string) => {
		const searchParams = new URLSearchParams();
		if (couponCode) {
			searchParams.set("couponCode", couponCode);
		}
		const res = await fetchApi(`/orders?${searchParams.toString()}`, {
			method: "POST",
		});
		const data = await res.json();
		return data;
	},
	getIsAdmin: async () => {
		const res = await fetchApi("/me");
		const data = await res.json();
		const user = userSchema.parse(data);
		return user.role === "admin";
	},
} as const;
