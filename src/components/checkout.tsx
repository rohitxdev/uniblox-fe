import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LuXCircle } from "react-icons/lu";
import { api } from "../utils/api";

export const Checkout = () => {
	const queryClient = useQueryClient();
	const { data: coupons } = useQuery({
		queryKey: ["coupons"],
		queryFn: api.getAvailableCoupons,
	});

	const { data: cart } = useQuery({
		queryKey: ["cart"],
		queryFn: api.getCart,
	});

	const { data: products } = useQuery({
		queryKey: ["products"],
		queryFn: api.getProducts,
	});

	const createOrder = useMutation({
		mutationFn: api.createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
			queryClient.invalidateQueries({ queryKey: ["products"] });
			alert("Order created successfully");
			location.href = "/";
		},
	});

	const cartWithProducts = cart?.map((item) => ({
		...item,
		product: products?.find((product) => product.id === item.productId),
	}));

	const preTotalPrice = useMemo(
		() => cartWithProducts?.reduce((acc, item) => acc + (item.product?.price ?? 0) * item.quantity, 0) ?? 0,
		[cartWithProducts],
	);
	const [totalPrice, setTotalPrice] = useState(preTotalPrice);
	const [couponCode, setCouponCode] = useState("");
	const [couponInput, setCouponInput] = useState("");

	return (
		<div className="flex flex-col gap-2 max-md:mx-auto">
			<p className="text-xl">
				Total Price: <span className="font-bold">${totalPrice}</span>
			</p>
			<button className="rounded bg-black p-1 font-semibold text-white" type="button" onClick={() => createOrder.mutate(couponCode)}>
				{createOrder.isPending ? "Processing..." : "Checkout"}
			</button>
			<div className="flex w-80 flex-col gap-2 bg-neutral-100 p-2">
				<h4>Apply coupon code</h4>
				{couponCode ? (
					<p className="flex w-fit items-center gap-2 rounded border border-indigo-500 bg-indigo-100 px-2 py-1 text-indigo-500 text-sm">
						{couponCode}{" "}
						<button
							type="button"
							onClick={() => {
								setCouponCode("");
								setTotalPrice(preTotalPrice);
							}}
						>
							<LuXCircle className="size-4" />
						</button>
					</p>
				) : (
					<>
						<input
							type="text"
							onInput={(e) => {
								setCouponInput(e.currentTarget.value);
							}}
						/>
						<button
							className="rounded bg-black p-1 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-80"
							type="button"
							onClick={() => {
								const currentCoupon = coupons?.find((item) => item.code === couponInput);
								if (currentCoupon) {
									setCouponCode(currentCoupon.code);
									setTotalPrice(preTotalPrice - (preTotalPrice * currentCoupon.discountPercent) / 100);
								} else {
									alert("Invalid coupon code");
								}
							}}
							disabled={couponInput === ""}
						>
							Apply
						</button>
					</>
				)}
			</div>
			<div>
				<h2>Coupons</h2>
				<div className="flex flex-col gap-2">
					{coupons?.map((item) => (
						<div className="rounded border bg-neutral-100 p-2" key={item.id}>
							<p>{item.code}</p>
							<p>{item.discountPercent}% off</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
