"use client";

import { type User } from "@/types";
import { DropdownMenuContent, DropdownMenuItem } from "@/ui/dropdown-menu";
import { useSession } from "next-auth/react";

type UserTableActionsProps = {
	user: User;
};
function UserTableActions({ user }: UserTableActionsProps) {
	const { data: Session, status } = useSession();

	return (
		<DropdownMenuContent align="end" className="w-[160px]">
			<DropdownMenuItem>Rep_Increment</DropdownMenuItem>
			<DropdownMenuItem>Rep_Decrement</DropdownMenuItem>
			<DropdownMenuItem>ChangeRole</DropdownMenuItem>
		</DropdownMenuContent>
	);
}

export default UserTableActions;
