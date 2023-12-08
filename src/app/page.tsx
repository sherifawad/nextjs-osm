import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import SectionsWrapper from "./SectionsWrapper";
import { Badge } from "@/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Separator } from "@/ui/separator";
import { AspectRatio } from "@/ui/aspect-ratio";

const mosqueStatusData = [
	{
		title: "Verified Place",
		details: "A place that has been verified to exist",
		icon: "./mosque-verified.svg",
	},
	{
		title: "Not Verified Place",
		details: "A place that has not been verified yet",
		icon: "./mosque-unVerified.svg",
	},
	{
		title: "Hidden Place",
		details: "A place that has been set hidden waiting for more details",
		icon: "./mosque-hidden.svg",
	},
];

async function HomePage() {
	const header = headers();
	const host = header.get("host");
	return (
		<>
			<section className="bg-neutral-50 px-6 py-12 text-center dark:bg-neutral-900 md:px-12 lg:text-left">
				<div className="w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
					<div className="grid items-center gap-12 lg:grid-cols-2">
						<div className="mt-12 lg:mt-0">
							<h1 className="mt-2 mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
								<span className="text-primary">Find Mosque</span>
								<br />
								<span className="text-md font-normal tracking-tight md:text-lg xl:text-xl">
									Use the map to find a mosque near you
								</span>
							</h1>
							<Link
								prefetch={false}
								className="mb-2 inline-block rounded bg-primary px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] md:mr-2 md:mb-0"
								data-te-ripple-init
								data-te-ripple-color="light"
								href="/map"
								role="button"
							>
								Map
							</Link>
							<Link
								className="inline-block rounded px-12 pt-4 pb-3.5 text-sm font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:hover:bg-neutral-800 dark:hover:bg-opacity-60"
								data-te-ripple-init
								data-te-ripple-color="light"
								href={"#!"}
								role="button"
							>
								Learn more
							</Link>
						</div>
						<div className="mb-12 lg:mb-0">
							<Image
								src="/Hassan_2_Mosque.jpeg"
								className="w-full rounded-lg shadow-lg dark:shadow-black/20"
								alt=""
								width={1024}
								height={660}
							/>
						</div>
					</div>
				</div>
			</section>
			<SectionsWrapper
				id="mosque-status"
				title="There are different status to a place"
				sectionName="Mosque Status"
				customHeader={false}
			>
				<article className="">
					<div className="grid grid-rows-2 grid-cols-0 sm:grid-rows-0 sm:grid-cols-2 sm:items-center gap-4">
						<ul className="flex flex-col space-y-4  text-secondary-foreground/75">
							{mosqueStatusData.map((m, idx) => (
								<>
									<li key={idx} className="grid grid-cols-[auto_1fr] items-center gap-4">
										<Avatar>
											<AvatarImage src={m.icon} alt={m.title} />
											<AvatarFallback>{m.title}</AvatarFallback>
										</Avatar>
										<div className="flex flex-col">
											<h4 className="font-bold text-lg ">{m.title}</h4>
											<p>{m.details}</p>
										</div>
									</li>
									<Separator />
								</>
							))}
						</ul>

						<footer className="">
							<AspectRatio ratio={16 / 9} className="bg-muted">
								<Image
									src="/mosque-status-screenshot.png"
									alt="Photo by Drew Beamer"
									fill
									className="rounded-md object-cover"
								/>
							</AspectRatio>
						</footer>
					</div>
				</article>
			</SectionsWrapper>
		</>
	);
}

export default HomePage;
