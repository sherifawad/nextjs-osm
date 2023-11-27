import { UserPlacesType, getUserPlaces, getUserPlacesCount } from "@/database/place";

export const getPlacesResult = async ({
	userId,
	placeType,
	page,
	size,
}: {
	userId: string;
	placeType: UserPlacesType;
	page: number;
	size: number;
}) => {
	const start = (Number(page) - 1) * Number(size); // 0, 5, 10 ...
	// const end = start + Number(size); // 5, 10, 15 ...
	const countResult = await getUserPlacesCount({
		id: userId,
		placeType,
	});
	if (countResult.status === "success") {
		const placesResult = await getUserPlaces({
			id: userId,
			placeType,
			skip: start,
			take: size,
		});
		if (placesResult.status === "success") {
			return { data: placesResult.data, count: countResult.data };
		}
	}
	return { data: [], count: 0 };
};
