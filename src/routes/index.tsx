import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../utils/api";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	const { data: products, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: api.getProducts,
	});

	const mutation = useMutation({
		mutationFn: api.addToCart,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
	});

	return (
		<div>
			<div className="flex gap-2">
				{isLoading
					? "Loading..."
					: products?.map((product) => (
							<div className="flex flex-col gap-2 rounded-md border bg-neutral-100 p-2" key={product.id}>
								<img src={product.imageUrl} width={200} alt="" />
								<h3>{product.name}</h3>
								<p>${product.price}</p>
								<button
									className="rounded bg-black p-1 font-semibold text-white"
									type="button"
									onClick={() => mutation.mutate(product.id)}
								>
									Add to cart
								</button>
							</div>
						))}
			</div>
		</div>
	);
}
