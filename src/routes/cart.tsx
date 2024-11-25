import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Checkout } from "../components/checkout";
import { UpdateCartItemBtn } from "../components/update-cart-item-btn";
import { api } from "../utils/api";

export const Route = createFileRoute("/cart")({
	component: RouteComponent,
	loader: async () => {
		try {
			await api.getMe();
		} catch (error) {
			return redirect({ to: "/auth/log-in" });
		}
	},
});

function RouteComponent() {
	const { data: cart, isLoading } = useQuery({
		queryKey: ["cart"],
		queryFn: api.getCart,
	});

	const { data: products } = useQuery({
		queryKey: ["products"],
		queryFn: api.getProducts,
	});

	const cartWithProducts = cart?.map((item) => ({
		...item,
		product: products?.find((product) => product.id === item.productId),
	}));

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-3xl">Cart</h1>
			<div className="flex flex-wrap justify-between gap-4">
				<div className="flex flex-wrap justify-center gap-2">
					{isLoading
						? "Loading..."
						: cartWithProducts?.map((item) => (
								<div className="flex flex-col gap-2 rounded-md border bg-neutral-100 p-2" key={item.id}>
									<img className="h-full" src={item.product?.imageUrl} width={200} alt="" />
									<h3>{item.product?.name}</h3>
									<p>¢{item.product?.price}</p>
									{item.product && (
										<UpdateCartItemBtn
											productId={item.productId}
											quantity={item.quantity}
											quantityLeft={item.product?.quantityLeft}
										/>
									)}
								</div>
							))}
				</div>
				{!isLoading && cartWithProducts!.length > 0 ? <Checkout /> : <p className="w-full text-center">Cart is empty</p>}
			</div>
		</div>
	);
}
