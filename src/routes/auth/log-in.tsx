import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/log-in")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<form
				className="flex flex-col gap-4 rounded-md border-2 p-4"
				onSubmit={(e) => {
					e.preventDefault();
					const form = new FormData(e.currentTarget);
					const email = form.get("email");
					alert(email);
				}}
			>
				<label>
					Enter your email address
					<input type="email" name="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
				</label>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
