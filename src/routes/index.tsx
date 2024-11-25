import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UpdateCartItemBtn } from "../components/update-cart-item-btn";
import { api } from "../utils/api";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: products, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: api.getProducts,
	});

	const { data: cart } = useQuery({
		queryKey: ["cart"],
		queryFn: api.getCart,
	});

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-3xl">Products</h1>
			<div className="flex flex-wrap gap-2 max-md:justify-center">
				{isLoading
					? "Loading..."
					: products?.map((product) => (
							<div className="relative flex flex-col gap-2 rounded-md border bg-neutral-100 p-2" key={product.id}>
								<img className="h-full" src={product.imageUrl} width={200} alt="" />
								<h3>{product.name}</h3>
								<p>¢{product.price}</p>
								<p>{product.quantityLeft} left</p>
								<UpdateCartItemBtn
									productId={product.id}
									quantity={cart?.find((item) => item.productId === product.id)?.quantity ?? 0}
									quantityLeft={product.quantityLeft}
								/>
								{product.quantityLeft === 0 && (
									<div className="absolute top-0 right-0 m-4 flex items-center gap-2 rounded border bg-black p-2 text-white">
										<p className="bg-black/50 p-2 text-white">Out of stock</p>
									</div>
								)}
							</div>
						))}
			</div>
		</div>
	);
}
