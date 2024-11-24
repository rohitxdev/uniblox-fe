import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "../utils/api";
import { CartBtn } from "./cart-btn";

export const NavBar = () => {
	const { data: user, isLoading } = useQuery({
		queryKey: ["user"],
		queryFn: api.getMe,
		retry: false,
	});

	if (isLoading) return null;

	return (
		<div className="absolute top-0 right-0 m-4 flex items-center gap-4">
			{!user ? (
				<Link className="flex items-center gap-2 rounded border bg-black p-2 text-white" to="/auth/log-in">
					Log In
				</Link>
			) : (
				<>
					{user?.role === "admin" && (
						<a className="underline" href="/admin">
							Admin
						</a>
					)}
					<button
						className="flex items-center gap-2 rounded border bg-black p-2 text-white"
						type="button"
						onClick={async () => {
							await api.logOut();
							location.reload();
						}}
					>
						Log Out
					</button>
				</>
			)}
			{user && <CartBtn />}
		</div>
	);
};
