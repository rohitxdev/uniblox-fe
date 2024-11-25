import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../../utils/api";

export const Route = createFileRoute("/auth/log-in")({
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
	const logIn = useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => api.logIn(email, password),
		onSuccess: () => {
			location.href = "/";
		},
		onError: (err) => {
			alert(err.message);
		},
	});
	return (
		<div className="grid place-content-center gap-2">
			<h1 className="text-center font-bold text-xl">Log In</h1>
			<form
				className="flex flex-col gap-4 rounded-md border-2 bg-neutral-100 p-4"
				onSubmit={async (e) => {
					e.preventDefault();
					const form = new FormData(e.currentTarget);
					const email = form.get("email");
					const password = form.get("password");
					logIn.mutate({ email: email?.toString()!, password: password?.toString()! });
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
					{logIn.isPending ? "Logging in..." : "Log In"}
				</button>
			</form>
			<p>
				Don't have an account?&nbsp;
				<Link to="/auth/sign-up" className="underline">
					Sign up
				</Link>
			</p>
		</div>
	);
}
