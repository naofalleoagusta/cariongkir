import NextLink from "next/link";
import { type ReactNode } from "react";

type LinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

const Link = ({ href, className, children }: LinkProps) => {
  return (
    <NextLink href={href} className={className ? className : ""}>
      {children}
    </NextLink>
  );
};

export default Link;
