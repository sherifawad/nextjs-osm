"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LocateFixed, Menu, Moon, ShoppingCart, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import Container from "../ui/Container";

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

const Header = () => {
    const { theme, setTheme } = useTheme();
    const activeLink = usePathname();
    const router = useRouter();

    return (
        <header className="flex sm:justify-between h-20 items-center px-4 border-b ">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
                    <div className="flex items-center">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Menu className="h-6 md:hidden w-6 flex " />
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="w-[300px] sm:w-[400px]"
                            >
                                <nav className="flex flex-col gap-4">
                                    {routes.map((route, i) => (
                                        <Link
                                            key={i}
                                            prefetch={false}
                                            href={route.href}
                                            className={`block px-2 py-1 text-lg ${
                                                activeLink === route.href
                                                    ? "text-primary"
                                                    : ""
                                            }`}
                                        >
                                            {route.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                        <Link
                            href="/"
                            prefetch={false}
                            className="ml-4 lg:ml-0"
                        >
                            <h1 className="text-xl font-bold">STORE NAME</h1>
                        </Link>
                    </div>
                    <nav className="mx-6  items-center space-x-4 lg:space-x-6 hidden md:flex ">
                        {routes.map((route, i) => (
                            <Button key={i} asChild variant="ghost">
                                <Link
                                    key={i}
                                    prefetch={false}
                                    href={route.href}
                                    className={`text-sm font-medium transition-colors ${
                                        activeLink === route.href
                                            ? "text-primary"
                                            : ""
                                    }`}
                                >
                                    {route.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                    <div className="flex items-center">
                        {/* <Button
                            variant="ghost"
                            size="icon"
                            className="mr-2"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="h-6 w-6" />
                            <span className="sr-only">Shopping Cart</span>
                        </Button> */}
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle Theme"
                            className="mr-6"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle Theme</span>
                        </Button>

                        {/* <ProfileButton />  */}
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;
