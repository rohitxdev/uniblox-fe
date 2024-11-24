import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LuCheckCircle } from "react-icons/lu";
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
	const [showCheckEmailMessage, setShowCheckEmailMessage] = useState(false);

	const sendLogInEmail = useMutation({
		mutationFn: api.sendLogInEmail,
		onSuccess: () => {
			setShowCheckEmailMessage(true);
		},
	});

	useEffect(() => {
		if (!showCheckEmailMessage) return () => {};

		const id = setInterval(async () => {
			const user = await api.getMe();
			if (user) {
				location.href = "/";
				clearInterval(id);
			}
		}, 2000);
		return () => clearInterval(id);
	}, [showCheckEmailMessage]);

	return (
		<div className="grid place-content-center gap-2">
			<form
				className="flex flex-col gap-4 rounded-md border-2 bg-neutral-100 p-4"
				onSubmit={async (e) => {
					e.preventDefault();
					const form = new FormData(e.currentTarget);
					const email = form.get("email");
					sendLogInEmail.mutate(email?.toString()!);
				}}
			>
				<label className="flex w-80 flex-col gap-2">
					Enter your email address
					<input className="rounded border p-2" type="email" name="email" autoComplete="on" required />
				</label>
				<button className="rounded bg-black p-1 font-semibold text-white" type="submit">
					{sendLogInEmail.isPending ? "Sending..." : "Log In"}
				</button>
			</form>
			{showCheckEmailMessage && !sendLogInEmail.isPending && (
				<div className="flex items-center gap-2 rounded border bg-blue-100 p-2 text-blue-500">
					<LuCheckCircle /> Check your email for a link to log in.
				</div>
			)}
		</div>
	);
}
