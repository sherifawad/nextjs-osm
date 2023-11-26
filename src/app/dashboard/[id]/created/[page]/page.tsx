import PlacesTable from "@/components/data-table/places-table";
import { getUser } from "@/database/user";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function CreatedPlacesPage() {
	const session = await getServerSession(authOptions);
	const header = headers();
	const host = header.get("host");
	if (!session?.user) {
		redirect(`http://${host}/api/auth/signin?callbackUrl=http://${host}`);
	}

	const user = await getUser({ userId: session?.user.id, placesType: "CREATED" });
	if (user.status === "error") {
		redirect(`http://${host}/api/auth/signin?callbackUrl=http://${host}`);
	}

	return (
		<section className="max-w-4xl mx-auto">
			<PlacesTable data={user.data.placeCreated || []} />
		</section>
	);
}

export default CreatedPlacesPage;
