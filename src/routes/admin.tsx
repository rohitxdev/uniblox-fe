import { createFileRoute, redirect } from "@tanstack/react-router";
import { api } from "../utils/api";

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
	beforeLoad: async () => {
		const isAdmin = await api.getIsAdmin();
		if (!isAdmin) redirect({ to: "/", throw: true });
	},
});

function RouteComponent() {
	return "Hello /admin!";
}
