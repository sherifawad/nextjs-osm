"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Container from "../ui/Container";
import DarkModeToggle from "./darkMode-toggle";
import UserButton from "./user-button";

const Header = () => {
  const { data: Session, status } = useSession();

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
                  <ul className="flex flex-col gap-4">
                    <li>
                      <Link
                        prefetch={false}
                        href={`/map`}
                        className={`block px-2 py-1 text-lg`}
                      >
                        Map
                      </Link>
                    </li>
                    <li>
                      <Link
                        prefetch={false}
                        href={`/dashboard/${Session?.user.id}/account`}
                        className={`block px-2 py-1 text-lg`}
                      >
                        Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        prefetch={false}
                        href={`/dashboard/${Session?.user.id}/my/places`}
                        className={`block px-2 py-1 text-lg`}
                      >
                        Places
                      </Link>
                    </li>
                    <li>
                      <Link
                        prefetch={false}
                        href={`/dashboard/${Session?.user.id}/users`}
                        className={`block px-2 py-1 text-lg`}
                      >
                        Users
                      </Link>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/" className="ml-4 lg:ml-0">
              <h1 className="text-xl font-bold whitespace-nowrap text-primary">
                My Mosque
              </h1>
            </Link>
          </div>
          <nav className="mx-6  items-center space-x-4 lg:space-x-6 hidden md:flex ">
            <ul className="items-center space-x-4 lg:space-x-6 hidden md:flex ">
              <li>
                <Link
                  prefetch={false}
                  href={`/map`}
                  className={`text-sm font-medium transition-colors`}
                >
                  Map
                </Link>
              </li>
              {Session && (
                <>
                  <li>
                    <Link
                      href={`/dashboard/${Session?.user.id}/account`}
                      className="text-sm font-medium transition-colors"
                    >
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      prefetch={false}
                      href={`/dashboard/${Session?.user.id}/my/places`}
                      className={`text-sm font-medium transition-colors`}
                    >
                      Places
                    </Link>
                  </li>
                  <li>
                    <Link
                      prefetch={false}
                      href={`/dashboard/${Session?.user.id}/users`}
                      className={`text-sm font-medium transition-colors`}
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className="flex items-center">
            <DarkModeToggle />
            <UserButton />

            {/* <ProfileButton />  */}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
