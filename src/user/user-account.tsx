import UserDataInput from "@/components/user-data-input";
import { User } from "@/database/user";
import { Input } from "@/ui/input";
import Image from "next/image";
type UserAccountProps = {
	user: User;
};

function UserAccount({ user }: UserAccountProps) {
	return (
		<div className=" flex w-full flex-col sm:grid grid-cols-2 gap-4">
			<Image
				src={user.image || ""}
				height={100}
				width={100}
				alt={user.name || "use avatar"}
				className="rounded-full col-span-2 shadow-md mx-auto sm:mx-1"
			/>
			<UserDataInput name="name" value={user.name ?? ""} type="text" />
			<UserDataInput name="role" value={user.role ?? ""} type="text" />
			<UserDataInput name="email" value={user.email ?? ""} type="email" />
			<UserDataInput name="reputation" value={user.userReputation ?? ""} type="number" />
		</div>
	);
}

export default UserAccount;
