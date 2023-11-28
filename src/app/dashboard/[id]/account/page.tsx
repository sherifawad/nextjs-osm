import UserDataInput from "@/components/user-data-input";
import { getUser } from "@/database";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

async function AccountPage() {
	const session = await getServerSession(authOptions);
	const header = headers();
	const host = header.get("host");
	if (!session?.user) {
		redirect(`http://${host}/api/auth/signin?callbackUrl=http://${host}`);
	}

	const user = await getUser({ id: session?.user.id });
	if (user.status === "error") {
		redirect(`http://${host}/api/auth/signin?callbackUrl=http://${host}`);
	}

	return (
		<section className=" flex w-full max-w-4xl mx-auto flex-col sm:grid grid-cols-2 gap-4">
			<Image
				src={user.data.image || ""}
				height={100}
				width={100}
				alt={user.data.name || "user avatar"}
				className="rounded-full col-span-2 shadow-md mx-auto sm:mx-1"
			/>
			<UserDataInput name="name" value={user.data.name ?? ""} type="text" />
			<UserDataInput name="role" value={user.data.role ?? ""} type="text" />
			<UserDataInput name="email" value={user.data.email ?? ""} type="text" />
			<UserDataInput name="reputation" value={user.data.userReputation ?? ""} type="number" />
		</section>
	);
}

export default AccountPage;
