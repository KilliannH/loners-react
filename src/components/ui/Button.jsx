import { cva } from "class-variance-authority";
import clsx from "clsx";

const button = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110",
        outline: "border border-gray-300 text-black hover:bg-gray-100",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ children, variant, size, className, ...props }) {
  return (
    <button className={clsx(button({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
}