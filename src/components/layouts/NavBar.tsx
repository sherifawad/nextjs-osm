"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavBar() {
    const activeLink = usePathname();
    return (
        <header>
            <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200  backdrop-blur-lg transition-all">
                <ul className="flex h-14 items-center justify-between border-b border-zinc-200 mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
                    <li>
                        <Link href="/" prefetch={false}>
                            <span
                                className={`${
                                    activeLink === "/" ? "text-red-500" : ""
                                }`}
                            >
                                Home
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/map1" prefetch={false}>
                            <span
                                className={`${
                                    activeLink === "/map1" ? "text-red-500" : ""
                                }`}
                            >
                                Map1
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/GeoJsonLayerMap" prefetch={false}>
                            <span
                                className={`${
                                    activeLink === "/GeoJsonLayerMap"
                                        ? "text-red-500"
                                        : ""
                                }`}
                            >
                                GeoJsonLayerMap
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/leafletMap" prefetch={false}>
                            <span
                                className={`${
                                    activeLink === "/leafletMap"
                                        ? "text-red-500"
                                        : ""
                                }`}
                            >
                                leafletMap
                            </span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default NavBar;
