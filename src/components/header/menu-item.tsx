"use client";

import { cn } from "@/lib/utils/styles";
import { VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
};

function MainMenuItem({ className, link, title, variant }: Props) {
  const currentPath = usePathname();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(link)}
      className={cn(
        MainMenuItemVariants({ variant, className }),
        `${currentPath === link ? "text-primary font-bold text-base" : ""}`
      )}
    >
      {title}
    </button>
  );
}

export default MainMenuItem;
