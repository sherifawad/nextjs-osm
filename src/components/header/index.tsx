"use client";

import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Container from "../ui/Container";
import DarkModeToggle from "./darkMode-toggle";
import UserButton from "./user-button";
import MainMenuItem from "./menu-item";

const Header = () => {
  const { data: Session, status } = useSession();

  return (
    <header className="flex sm:justify-between h-20 items-center px-2 xs:px-4 border-b ">
      <Container>
        <div className="relative xs:px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between w-full">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Menu className="h-6 md:hidden w-6 flex " />
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <ul className="flex flex-col gap-4">
                    <li>
                      <SheetClose>
                        <MainMenuItem
                          link="/map"
                          title="Map"
                          variant={"mobile"}
                        />
                      </SheetClose>
                    </li>
                    {status === "authenticated" && (
                      <>
                        <li>
                          <SheetClose>
                            <MainMenuItem
                              link={`/dashboard/${Session?.user.id}/account`}
                              title="Account"
                              variant={"mobile"}
                            />
                          </SheetClose>
                        </li>
                        <li>
                          <SheetClose>
                            <MainMenuItem
                              link={`/dashboard/${Session?.user.id}/my/places`}
                              title="Places"
                              variant={"mobile"}
                            />
                          </SheetClose>
                        </li>
                        <li>
                          <SheetClose>
                            <MainMenuItem
                              link={`/dashboard/${Session?.user.id}/users`}
                              title="Users"
                              variant={"mobile"}
                            />
                          </SheetClose>
                        </li>
                      </>
                    )}
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
                <MainMenuItem link="/map" title="Map" />
              </li>
              {status === "authenticated" && (
                <>
                  <li>
                    <MainMenuItem
                      link={`/dashboard/${Session?.user.id}/account`}
                      title="Account"
                    />
                  </li>
                  <li>
                    <MainMenuItem
                      link={`/dashboard/${Session?.user.id}/my/places`}
                      title="Places"
                    />
                  </li>
                  <li>
                    <MainMenuItem
                      link={`/dashboard/${Session?.user.id}/users`}
                      title="Users"
                    />
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
