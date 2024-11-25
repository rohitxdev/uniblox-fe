import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { api } from "../utils/api";

interface UpdateCartItemBtnProps {
	productId: number;
	quantity: number;
	quantityLeft: number;
}

export const UpdateCartItemBtn = ({ productId, quantity, quantityLeft }: UpdateCartItemBtnProps) => {
	const queryClient = useQueryClient();
	const [value, setValue] = useState(quantity);

	const addToCart = useMutation({
		mutationFn: api.addToCart,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
		onMutate: () => {
			setValue(1);
		},
	});

	const updateCartItemQuantity = useMutation({
		mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => api.updateCartItemQuantity(productId, quantity),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
		onError: () => {
			// Revert local state on error
			setValue(quantity);
		},
	});

	const deleteCartItem = useMutation({
		mutationFn: api.deleteCartItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
		onError: () => {
			// Revert local state on error
			setValue(quantity);
		},
	});

	const user = useQuery({
		queryKey: ["user"],
		queryFn: api.getMe,
		retry: false,
	});

	useEffect(() => {
		setValue(quantity);
	}, [quantity]);

	const handleDecrease = () => {
		if (value > 1) {
			setValue(value - 1);
			updateCartItemQuantity.mutate({
				productId,
				quantity: value - 1,
			});
		} else {
			deleteCartItem.mutate(productId);
		}
	};

	const handleIncrease = () => {
		if (quantityLeft < value + 1) return;

		setValue(value + 1);
		updateCartItemQuantity.mutate({
			productId,
			quantity: value + 1,
		});
	};

	const isLoading = addToCart.isPending || updateCartItemQuantity.isPending || deleteCartItem.isPending;

	return (
		<div className="flex justify-evenly rounded bg-black p-1 font-semibold text-white">
			{!user.isLoading && !user.data ? (
				<button type="button">Log In to add to cart</button>
			) : value === 0 ? (
				<button
					onClick={() => addToCart.mutate(productId)}
					type="button"
					disabled={quantityLeft === 0 || isLoading || !user.data}
					className="disabled:opacity-50"
				>
					{isLoading ? "Adding..." : "Add to cart"}
				</button>
			) : (
				<>
					<button type="button" onClick={handleDecrease} disabled={isLoading || !user.data} className="disabled:opacity-50">
						<LuMinus />
					</button>
					<p>{value}</p>
					<button
						type="button"
						onClick={handleIncrease}
						disabled={quantityLeft <= value || isLoading || !user.data}
						className="disabled:opacity-50"
					>
						<LuPlus />
					</button>
				</>
			)}
		</div>
	);
};
