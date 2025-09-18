import React from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & { className?: string };

export default function Container({
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <div className={`mx-auto max-w-6xl px-4 ${className}`} {...rest}>
      {children}
    </div>
  );
}
