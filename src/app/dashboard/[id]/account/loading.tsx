import { Skeleton } from "@/ui/skeleton";
import React from "react";

function LoadingPage() {
	return (
		<div className="flex w-full max-w-4xl mx-auto flex-col sm:grid grid-cols-2 gap-4">
			<Skeleton className="h-28 w-28 rounded-full col-span-2 shadow-md mx-auto sm:mx-1" />
			<Skeleton className="h-16 " />
			<Skeleton className="h-16 " />
			<Skeleton className="h-16 " />
			<Skeleton className="h-16 " />
		</div>
	);
}

export default LoadingPage;
