import type { ReactNode } from "react";
import clsx from "clsx";

export default function Marquee({
  children,
  reverse = false,
  slow = false,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  slow?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("overflow-hidden", className)}>
      <div
        className={clsx(
          "marquee-track",
          reverse && "marquee-reverse",
          slow && "marquee-slow",
        )}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
