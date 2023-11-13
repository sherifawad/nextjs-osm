import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

type UserAvatarProps = {
    name?: string | null;
    image?: string | null;
    className?: string;
};

function UserAvatar({ name, image, className }: UserAvatarProps) {
    return (
        <Avatar className={cn("bg-background text-foreground", className)}>
            {image && (
                <Image
                    src={image || ""}
                    height={40}
                    width={40}
                    alt={name || "use avatar"}
                    className="rounded-full"
                />
            )}
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>
                {name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
            </AvatarFallback>
        </Avatar>
    );
}

export default UserAvatar;
