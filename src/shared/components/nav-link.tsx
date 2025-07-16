"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

namespace NavLink {
  export interface Props extends Omit<PropsOf<typeof Link>, "aria-current"> {
    href: string;
  }
}

export function NavLink({ href, ...props }: NavLink.Props) {
  const pathname = usePathname();

  const isActive = href === "/" ? pathname === href : pathname.startsWith(href);

  return <Link href={href} aria-current={isActive && "page"} {...props} />;
}
