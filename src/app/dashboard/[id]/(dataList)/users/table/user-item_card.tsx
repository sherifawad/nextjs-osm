import { Card, CardContent } from "@/components/ui/card";
import { User, UserDbSchema } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import UserTableActions from "./table-actions";

type Props = {
  data: unknown;
};

export const UserItemCard = ({ data }: Props) => {
  const user = UserDbSchema.safeParse(data);
  if (!user.success) {
    return null;
  }
  return (
    <Card>
      <CardContent>
        <div className="flex items-center space-x-3 pt-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3">
              <p className="truncate text-sm font-medium">{user.data.name}</p>
              <Badge
                variant={"outline"}
                className="bg-green-100 text-green-800"
              >
                {user.data.role}
              </Badge>
              <>
                {user.data.userReputation > 5 && (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal bg-green-300 dark:bg-green-600"
                  >
                    +{user.data.userReputation}
                  </Badge>
                )}
                {user.data.userReputation < 3 && (
                  <Badge
                    variant="destructive"
                    className="rounded-sm px-1 font-normal"
                  >
                    {user.data.userReputation}
                  </Badge>
                )}
                {user.data.userReputation >= 3 &&
                  user.data.userReputation <= 5 && (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {user.data.userReputation}
                    </Badge>
                  )}
              </>
            </div>
            <p className="mt-1 truncate text-sm ">{user.data.email}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                Edit
              </Button>
            </DropdownMenuTrigger>
            <UserTableActions user={user.data} />
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserItemCard;
