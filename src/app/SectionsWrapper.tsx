import { cn } from "@/lib/utils";
import Container from "@/ui/Container";
import { HTMLAttributes, ReactNode } from "react";

type SectionsWrapperProps = HTMLAttributes<HTMLElement> & {
	customHeader?: boolean;
	sectionName: string;
	headerClassName?: string;
	title: string;
	children: ReactNode | ReactNode[];
};

function SectionsWrapper({
	sectionName,
	title,
	children,
	customHeader = false,
	className,
	headerClassName,
	...props
}: SectionsWrapperProps) {
	return (
		<Container>
			<section className={cn("px-4 pt-4", className)} {...props}>
				{!customHeader && (
					<header className={cn("capitalize space-y-2", headerClassName)}>
						<h2 className="text-primary uppercase text-xl font-bold">{sectionName}</h2>
						<h3 className="text-secondary-foreground font-bold text-lg">{title}</h3>
					</header>
				)}
				{children}
			</section>
		</Container>
	);
}

export default SectionsWrapper;
