"use client";

import { cn } from "@/lib/utils/styles";
import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MainMenuItemVariants = cva("transition-colors", {
  variants: {
    variant: {
      desktop: "text-base font-normal ",
      mobile: "block px-2 py-1 text-lg",
    },
  },
  defaultVariants: {
    variant: "desktop",
  },
});

type Props = VariantProps<typeof MainMenuItemVariants> & {
  link: string;
  title: string;
  className?: string;
  onLinkClick?: () => void;
};

function MainMenuItem({
  className,
  link,
  title,
  variant,
  onLinkClick = () => {},
}: Props) {
  const currentPath = usePathname();

  return (
    <Link
      prefetch={false}
      href={link}
      onClick={onLinkClick}
      className={cn(
        MainMenuItemVariants({ variant, className }),
        `${currentPath === link ? "text-primary font-bold text-base" : ""}`
      )}
    >
      {title}
    </Link>
  );
}

export default MainMenuItem;
