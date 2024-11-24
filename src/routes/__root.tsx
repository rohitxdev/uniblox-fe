import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: RootComponent,
});

const queryClient = new QueryClient();

function RootComponent() {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="grid min-h-screen w-full bg-white">
				<Outlet />
			</div>
			<TanStackRouterDevtools position="bottom-right" />
		</QueryClientProvider>
	);
}
