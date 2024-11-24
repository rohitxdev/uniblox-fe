import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../../utils/api";

export const Route = createFileRoute("/auth/sign-up")({
	component: RouteComponent,
	loader: async () => {
		try {
			const user = await api.getMe();
			if (user) return redirect({ to: "/" });
		} catch (err) {
			return;
		}
		redirect({
			to: "/",
		});
	},
});

function RouteComponent() {
	const signUp = useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => api.signUp(email, password),
		onSuccess: () => {
			location.href = "/";
		},
		onError: (err) => {
			alert(err.message);
		},
	});
	return (
		<div className="grid place-content-center gap-2">
			<h1 className="text-center text-xl font-bold">Sign Up</h1>
			<form
				className="flex flex-col gap-4 rounded-md border-2 bg-neutral-100 p-4"
				onSubmit={async (e) => {
					e.preventDefault();
					const form = new FormData(e.currentTarget);
					const email = form.get("email");
					const password = form.get("password");
					signUp.mutate({
						email: email?.toString()!,
						password: password?.toString()!,
					});
				}}
			>
				<label className="flex w-80 flex-col gap-2">
					Email address
					<input className="rounded border p-2" type="email" name="email" autoComplete="on" required />
				</label>
				<label className="flex w-80 flex-col gap-2">
					Password
					<input className="rounded border p-2" type="password" name="password" autoComplete="on" required />
				</label>
				<button className="rounded bg-black p-1 font-semibold text-white" type="submit">
					{signUp.isPending ? "Signing up..." : "Sign up"}
				</button>
			</form>
			<p>
				Already have an account?&nbsp;
				<Link to="/auth/log-in" className="underline">
					Log in
				</Link>
			</p>
		</div>
	);
}
