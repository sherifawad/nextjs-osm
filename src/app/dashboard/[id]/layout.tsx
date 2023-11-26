import type { Metadata } from "next";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import Link from "next/link";

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
	return (
		<main>
			<section>
				<Tabs defaultValue="account" className="w-full mt-8">
					<TabsList className="max-w-md mx-auto inline-flex sm:grid w-full grid-cols-3 mb-8">
						<TabsTrigger value="account">
							<Link prefetch={false} href={`/dashboard/${params.id}/account`}>
								Account
							</Link>
						</TabsTrigger>
						<TabsTrigger value="createdPlaces">
							<Link prefetch={false} href={`/dashboard/${params.id}/created/1`}>
								Created Places
							</Link>
						</TabsTrigger>
						<TabsTrigger value="modifiedPlaces">
							<Link prefetch={false} href={`/dashboard/${params.id}/modified/1`}>
								Modified Places
							</Link>
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</section>
			{children}
		</main>
	);
}
