import type { Metadata } from "next";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import Link from "next/link";
import { headers } from "next/headers";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from "react";

export const metadata: Metadata = {
	title: "Dashboard App",
};

export default function DashboardLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: {
		id: string;
	};
}) {
	const pathname = (children as ReactElement)?.props?.childProp?.segment;
	const value = pathname === "places" ? "places" : pathname === "users" ? "users" : "account";
	return (
		<main>
			<section>
				<Tabs defaultValue={value} className="w-full mt-8">
					<TabsList className="max-w-md mx-auto inline-flex xs:grid w-full grid-cols-2 mb-8">
						<TabsTrigger value="places">
							<Link prefetch={false} href={`/dashboard/${params.id}/places`}>
								Places
							</Link>
						</TabsTrigger>
						<TabsTrigger value="users">
							<Link prefetch={false} href={`/dashboard/${params.id}/users`}>
								Users
							</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</section>
			{children}
		</main>
	);
}
