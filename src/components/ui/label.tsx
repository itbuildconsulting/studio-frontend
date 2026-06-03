import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-foreground leading-none mb-1.5",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
