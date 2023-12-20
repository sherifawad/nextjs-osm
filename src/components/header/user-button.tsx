"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

function UserButton() {
  const { data: Session, status } = useSession();

  if (status !== "authenticated") {
    return (
      <Button variant={"outline"} onClick={() => signIn("google")}>
        Signin
      </Button>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar name={Session.user.name} image={Session.user.image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <Link href={`/dashboard/${Session.user.id}/account`}>
            {Session.user.name}
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer justify-center bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserButton;
