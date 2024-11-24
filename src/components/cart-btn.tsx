import { Link, useMatch } from "@tanstack/react-router";
import { LuShoppingCart } from "react-icons/lu";

export const CartBtn = () => {
	const matchCart = useMatch({ from: "/cart", shouldThrow: false });
	const matchAuth = useMatch({ from: "/auth/log-in", shouldThrow: false });

	if (matchCart || matchAuth) return null;
	return (
		<Link className="flex items-center gap-2 rounded border bg-black p-2 text-white" to="/cart">
			<LuShoppingCart className="size-5" />
		</Link>
	);
};
