import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import SectionsWrapper from "./SectionsWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Container from "@/components/ui/Container";

export const dynamic = "force-static";

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
const mapFeaturesData = [
  {
    alt: "Photo of search bar",
    caption: "Search places or access current location",
    src: "/search.png",
  },
  {
    alt: "Photo of How to add new place",
    caption: "right-click select place then left-click to add new place",
    src: "/add-location.png",
  },
  {
    alt: "Photo of place rating",
    caption: "Rate Selected Place",
    src: "/rate-place.png",
  },
  {
    alt: "Photo of User Reputation",
    caption: "Keep your Reputation to add and rate places",
    src: "/account.png",
  },
];

async function HomePage() {
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
                href={"#mosque-status"}
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
          <div className="grid  grid-cols-0  sm:grid-cols-2 sm:items-center gap-4">
            <ul className="flex flex-col space-y-4  text-secondary-foreground/75">
              {mosqueStatusData.map((m, idx) => (
                <li key={idx} className="space-y-4">
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4 ">
                    <Avatar>
                      <AvatarImage src={m.icon} alt={m.title} />
                      <AvatarFallback>{m.title}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-lg ">{m.title}</h4>
                      <p>{m.details}</p>
                    </div>
                  </div>
                  <Separator />
                </li>
              ))}
            </ul>

            <footer className="">
              <AspectRatio ratio={16 / 9} className="bg-muted">
                <Image
                  src="/mosque-status-screenshot.png"
                  alt="Mosques status on map"
                  fill
                  className="rounded-md object-cover"
                />
              </AspectRatio>
            </footer>
          </div>
        </article>
      </SectionsWrapper>
      <SectionsWrapper
        id="place-search"
        title=""
        sectionName="Places Search"
        customHeader={false}
      >
        <article className="">
          <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 py-4">
            {mapFeaturesData.map((data, idx) => (
              <li key={idx} className="drop-shadow-lg">
                <figure className=" text-background ">
                  <Image
                    className="w-full object-cover rounded-tl-lg rounded-tr-lg"
                    src={data.src}
                    alt={data.alt}
                    width={1366}
                    height={607}
                  />
                  <figcaption className=" bg-foreground px-5 py-1 sm:py-3 text-center text-xs sm:text-lg font-light sm:font-semibold rounded-bl-lg rounded-br-lg">
                    {data.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </article>
      </SectionsWrapper>
      <footer className="flex  h-20 items-center px-4 border-t ">
        <Container>
          <span className="block text-sm  sm:text-center ">
            © 2023{" "}
            <Link href="/" className="hover:underline">
              MyMosque™
            </Link>
            . All Rights Reserved.
          </span>
        </Container>
      </footer>
    </>
  );
}

export default HomePage;
