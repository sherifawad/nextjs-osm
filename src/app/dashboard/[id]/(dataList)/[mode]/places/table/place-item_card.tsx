import { Card, CardContent } from "@/components/ui/card";
import { Place, userPlacesDTOSchema } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PlaceTableActions from "./table-actions";
import { CheckCircle2, CircleSlash, Eye, EyeOff, Timer } from "lucide-react";

type Props = {
  data: unknown;
};

export const PlaceItemCard = ({ data }: Props) => {
  const place = userPlacesDTOSchema.safeParse(data);
  if (!place.success) {
    return null;
  }
  const { rating, ...rest } = place.data;
  return (
    <Card>
      <CardContent>
        <div className="flex items-center space-x-3 pt-6">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-3">
              <p className="truncate text-sm font-medium">{place.data.name}</p>

              <>
                {place.data.rating > 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal bg-green-300 dark:bg-green-600"
                  >
                    +{place.data.rating}
                  </Badge>
                )}
                {place.data.rating < 0 && (
                  <Badge
                    variant="destructive"
                    className="rounded-sm px-1 font-normal"
                  >
                    -{place.data.rating}
                  </Badge>
                )}
                {place.data.rating === 0 && (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {place.data.rating}
                  </Badge>
                )}
              </>
            </div>
            <p className="flex items-center  mt-1 text-sm ">
              <Timer className="mr-2 h-4 w-4 " />
              <time suppressHydrationWarning className="text-muted-foreground">
                {new Intl.DateTimeFormat("en-GB").format(place.data.modifiedAt)}
              </time>
            </p>
            <p className="flex items-center  mt-1 text-sm space-x-3 ">
              <span>
                {place.data.hidden ? (
                  <EyeOff className="mr-2 h-4 w-4 text-destructive" />
                ) : (
                  <Eye className="mr-2 h-4 w-4 text-green-500" />
                )}
              </span>
              <span>
                {place.data.verified ? (
                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                ) : (
                  <CircleSlash className="mr-2 h-4 w-4 text-destructive" />
                )}
              </span>
            </p>
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
            <PlaceTableActions place={rest as Place} />
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceItemCard;
