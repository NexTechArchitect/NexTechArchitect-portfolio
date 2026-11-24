import React from "react";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export default function Link({
  href,
  rel,
  target,
  children,
  ...rest
}: LinkProps) {
  const safeRel = target === "_blank" ? rel || "noopener noreferrer" : rel;
  return (
    <a href={href} target={target} rel={safeRel} {...rest}>
      {children}
    </a>
  );
}