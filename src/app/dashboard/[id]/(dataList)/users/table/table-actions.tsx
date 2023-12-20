"use client";

import { type User } from "@/types";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "next-auth/react";
import { updateUserReputation, updateUserRole } from "../_actions";

type UserTableActionsProps = {
  user: User;
};
function UserTableActions({ user }: UserTableActionsProps) {
  const { data: Session, status } = useSession();

  return (
    <DropdownMenuContent align="end" className="w-[160px]">
      <DropdownMenuItem
        disabled={user.userReputation === 7}
        onClick={() =>
          updateUserReputation({
            changeType: "increment",
            loggedUserId: Session?.user.id || "",
            userId: user.id,
          })
        }
      >
        Rep_Increment
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={user.userReputation === 0}
        onClick={() =>
          updateUserReputation({
            changeType: "decrement",
            loggedUserId: Session?.user.id || "",
            userId: user.id,
          })
        }
      >
        Rep_Decrement
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>ChangeRole</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            disabled={user.role !== "OWNER"}
            onClick={() =>
              updateUserRole({
                newRole: "ADMIN",
                loggedUserId: Session?.user.id || "",
                userId: user.id,
              })
            }
          >
            Admin
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={user.role !== "OWNER"}
            onClick={() =>
              updateUserRole({
                newRole: "USER",
                loggedUserId: Session?.user.id || "",
                userId: user.id,
              })
            }
          >
            User
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuContent>
  );
}

export default UserTableActions;
