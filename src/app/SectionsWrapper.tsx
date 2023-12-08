import { cn } from "@/lib/utils";
import Container from "@/ui/Container";
import { HTMLAttributes, ReactNode } from "react";

type SectionsWrapperProps = HTMLAttributes<HTMLElement> & {
	customHeader?: boolean;
	sectionName: string;
	title: string;
	children: ReactNode | ReactNode[];
};

function SectionsWrapper({
	sectionName,
	title,
	children,
	customHeader = false,
	className,
	...props
}: SectionsWrapperProps) {
	return (
		<Container>
			<section className={cn("px-4 pt-24", className)} {...props}>
				{!customHeader && (
					<header className="capitalize space-y-2 mb-4">
						<h2 className="text-primary uppercase text-lg">{sectionName}</h2>
						<h3 className="text-secondary-foreground font-bold text-xl">{title}</h3>
					</header>
				)}
				{children}
			</section>
		</Container>
	);
}

export default SectionsWrapper;
