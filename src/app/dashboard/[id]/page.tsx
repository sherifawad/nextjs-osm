import { getUser } from "@/database/user";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

interface DashboardPage {
	params: {
		id: string;
	};
}
async function DashboardPage({ params }: DashboardPage) {
	const session = await getServerSession(authOptions);
	if (!session?.user.id) return notFound();
	const user = await getUser({ userId: session.user.id });

	return <div>{JSON.stringify(user, null, 2)}</div>;
}

export default DashboardPage;
