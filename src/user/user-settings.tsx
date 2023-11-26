import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAccount from "./user-account";
import { FetchedUser } from "@/database/user";
// import UserCreatedPlaces from "./user-createdPlaces";
import { Suspense, lazy } from "react";

const UserCreatedPlaces = lazy(() => import("./user-createdPlaces"));
type UserSettingsProps = {
	userData: FetchedUser;
};

function UserSettings({ userData }: UserSettingsProps) {
	const { placeCreated, placeModified, ...user } = userData;
	return (
		<Tabs defaultValue="account" className="max-w-4xl mt-8 mx-16">
			<TabsList className="max-w-md inline-flex sm:grid w-full grid-cols-3 mb-8">
				<TabsTrigger value="account">Account</TabsTrigger>
				<TabsTrigger value="createdPlaces">Created Places</TabsTrigger>
				<TabsTrigger value="modifiedPlaces">Modified Places</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<UserAccount user={user} />
			</TabsContent>
			<TabsContent value="createdPlaces">
				<Suspense fallback={<>Loading...</>}>
					<UserCreatedPlaces places={placeCreated ?? []} />
				</Suspense>
			</TabsContent>
		</Tabs>
	);
}

export default UserSettings;
