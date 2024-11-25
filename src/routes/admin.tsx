import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "../utils/api";

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
	loader: async () => {
		const isAdmin = await api.getIsAdmin();
		if (!isAdmin) {
			return redirect({ to: "/" });
		}
	},
});

function PageControls({
	page,
	pageSize,
	onSubmit,
}: {
	page: number;
	pageSize: number;
	onSubmit: (page: number, pageSize: number) => void;
}) {
	const [inputPage, setInputPage] = useState(page.toString());
	const [inputPageSize, setInputPageSize] = useState(pageSize.toString());

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const newPage = Math.max(0, Number.parseInt(inputPage) || 0);
		const newPageSize = Math.max(1, Number.parseInt(inputPageSize) || 10);
		onSubmit(newPage, newPageSize);
	};

	return (
		<form onSubmit={handleSubmit} className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
				<label className="text-sm">Page:</label>
				<input
					type="number"
					min="0"
					value={inputPage}
					onChange={(e) => setInputPage(e.target.value)}
					className="w-16 rounded border px-2 py-1 text-sm"
				/>
			</div>
			<div className="flex items-center gap-2">
				{/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
				<label className="text-sm">Size:</label>
				<input
					type="number"
					min="1"
					value={inputPageSize}
					onChange={(e) => setInputPageSize(e.target.value)}
					className="w-16 rounded border px-2 py-1 text-sm"
				/>
			</div>
			<button type="submit" className="rounded border bg-neutral-100 px-3 py-1 text-sm hover:bg-neutral-200">
				Fetch
			</button>
		</form>
	);
}

function RouteComponent() {
	const [ordersParams, setOrdersParams] = useState({ page: 0, pageSize: 10 });
	const [couponsParams, setCouponsParams] = useState({ page: 0, pageSize: 10 });

	const orders = useQuery({
		queryKey: ["orders-all", ordersParams],
		queryFn: () => api.getAllOrders(ordersParams.page, ordersParams.pageSize),
	});

	const coupons = useQuery({
		queryKey: ["coupons-all", couponsParams],
		queryFn: () => api.getAllCoupons(couponsParams.page, couponsParams.pageSize),
	});

	return (
		<div className="container mx-auto p-4">
			<h1 className="mb-8 font-bold text-3xl">Admin Dashboard</h1>

			<div className="mb-8">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-semibold text-xl">Orders</h2>
					<PageControls
						page={ordersParams.page}
						pageSize={ordersParams.pageSize}
						onSubmit={(page, pageSize) => {
							setOrdersParams({ page, pageSize });
							orders.refetch();
						}}
					/>
				</div>
				{orders.isLoading ? (
					<p>Loading orders...</p>
				) : orders.error ? (
					<p className="text-red-500">Error loading orders</p>
				) : (
					<div className="rounded border">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b bg-neutral-50">
										<th className="p-3 text-left">ID</th>
										<th className="p-3 text-left">User ID</th>
										<th className="p-3 text-left">Status</th>
										<th className="p-3 text-left">Total Amount</th>
										<th className="p-3 text-left">Discounted</th>
										<th className="p-3 text-left">Coupon ID</th>
										<th className="p-3 text-left">Created At</th>
									</tr>
								</thead>
								<tbody>
									{orders.data?.map((order) => (
										<tr key={order.id} className="border-b">
											<td className="p-3">{order.id}</td>
											<td className="p-3">{order.userId}</td>
											<td className="p-3">
												<span
													className={`rounded-full px-2 py-1 text-sm ${
														order.status === "completed" ? "bg-green-100 text-green-800" : "bg-neutral-100"
													}`}
												>
													{order.status}
												</span>
											</td>
											<td className="p-3">¢{order.totalAmount}</td>
											<td className="p-3">¢{order.discountedAmount}</td>
											<td className="p-3">{order.couponId || "-"}</td>
											<td className="p-3">{order.createdAt.toLocaleString()}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>

			<div className="mb-8">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="font-semibold text-xl">Coupons</h2>
					<PageControls
						page={couponsParams.page}
						pageSize={couponsParams.pageSize}
						onSubmit={(page, pageSize) => {
							setCouponsParams({ page, pageSize });
							coupons.refetch();
						}}
					/>
				</div>
				{coupons.isLoading ? (
					<p>Loading coupons...</p>
				) : coupons.error ? (
					<p className="text-red-500">Error loading coupons</p>
				) : (
					<div className="rounded border">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b bg-neutral-50">
										<th className="p-3 text-left">ID</th>
										<th className="p-3 text-left">User ID</th>
										<th className="p-3 text-left">Code</th>
										<th className="p-3 text-left">Discount %</th>
										<th className="p-3 text-left">Used</th>
										<th className="p-3 text-left">Created At</th>
										<th className="p-3 text-left">Updated At</th>
									</tr>
								</thead>
								<tbody>
									{coupons.data?.map((coupon) => (
										<tr key={coupon.id} className="border-b">
											<td className="p-3">{coupon.id}</td>
											<td className="p-3">{coupon.userId}</td>
											<td className="p-3">
												<span className="rounded bg-neutral-100 px-2 py-1 text-sm">{coupon.code}</span>
											</td>
											<td className="p-3">{coupon.discountPercent}%</td>
											<td className="p-3">{coupon.isUsed ? "Yes" : "No"}</td>
											<td className="p-3">{coupon.createdAt.toLocaleString()}</td>
											<td className="p-3">{coupon.updatedAt.toLocaleString()}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default RouteComponent;
