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
import { type Session } from "next-auth";
import { Button } from "../../ui/button";
import { signIn, signOut, useSession } from "next-auth/react";

function UserButton() {
	const { data: Session, status } = useSession();

	if (status !== "authenticated") {
		return (
			<Button variant={"outline"} onClick={() => signIn()}>
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
				<DropdownMenuLabel>{Session.user.name}</DropdownMenuLabel>
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
