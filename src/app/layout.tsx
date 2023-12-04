import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { fontSans } from "@/components/ui/fonts";
import { cn } from "@/lib/utils";
import Header from "@/components/layouts/Header";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Find a Mosque 'Masjid' ابحث عن مسجد",
	description: "Find or add a place to pray for muslims prayers ابحث او اضف مكان للصلاه",
	icons: [
		{
			rel: "icon",
			type: "image/png",
			url: "/salat.png",
		},
	],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
				<Providers>
					<Header />
					{children}
				</Providers>
			</body>
		</html>
	);
}
