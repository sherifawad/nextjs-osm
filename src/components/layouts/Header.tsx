import Link from "next/link";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LocateFixed, Menu, Moon, ShoppingCart, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import UserButton from "@/components/user-button";
import DarkModeToggle from "../darkMode-toggle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { headers } from "next/headers";

const routes = [
	{
		href: "/leafletMap",
		label: "LeafletMap",
	},
	// {
	//     href: "/GeoJsonLayerMap",
	//     label: "GeoJsonLayerMap",
	// },
];

const Header = async () => {
	// const activeLink = usePathname();

	const session = await getServerSession(authOptions);

	return (
		<header className="flex sm:justify-between h-20 items-center px-4 border-b ">
			<Container>
				<div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
					<div className="flex items-center">
						<Sheet>
							<SheetTrigger asChild>
								<Menu className="h-6 md:hidden w-6 flex " />
							</SheetTrigger>
							<SheetContent side="left" className="w-[300px] sm:w-[400px]">
								<nav className="flex flex-col gap-4">
									{routes.map((route, i) => (
										<Link key={i} prefetch={false} href={route.href} className={`block px-2 py-1 text-lg `}>
											{route.label}
										</Link>
									))}
								</nav>
							</SheetContent>
						</Sheet>
						<Link href="/" prefetch={false} className="ml-4 lg:ml-0">
							<h1 className="text-xl font-bold whitespace-nowrap">STORE NAME</h1>
						</Link>
					</div>
					<nav className="mx-6  items-center space-x-4 lg:space-x-6 hidden md:flex ">
						{session && (
							<Button asChild variant="ghost">
								<Link
									prefetch={false}
									href={`/dashboard/${session?.user.id}`}
									className={`text-sm font-medium transition-colors`}
								>
									Dashboard
								</Link>
							</Button>
						)}
						{routes.map((route, i) => (
							<Button key={i} asChild variant="ghost">
								<Link key={i} prefetch={false} href={route.href} className={`text-sm font-medium transition-colors`}>
									{route.label}
								</Link>
							</Button>
						))}
					</nav>
					<div className="flex items-center">
						<DarkModeToggle />
						<UserButton session={session} />

						{/* <ProfileButton />  */}
					</div>
				</div>
			</Container>
		</header>
	);
};

export default Header;
