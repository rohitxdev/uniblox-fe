import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { NavBar } from "../components/nav-bar";

export const Route = createRootRoute({
	component: RootComponent,
});
const queryClient = new QueryClient();

function RootComponent() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="relative grid min-h-screen w-full bg-white p-4">
				<NavBar />
				<Outlet />
			</div>
		</QueryClientProvider>
	);
}