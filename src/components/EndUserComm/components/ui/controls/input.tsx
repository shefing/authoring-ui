import * as React from "react";

import {cn} from "../utils";
import {FORM_INPUT_TEXT_SIZE, FORM_DISABLED} from "@/components/EndUserComm/lib/formStyles";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        disabled={disabled}
        data-slot="input"
        className={cn(
          `flex h-9 w-full min-w-0 rounded-md border px-3 py-1 ${FORM_INPUT_TEXT_SIZE} bg-white transition-[color,box-shadow] outline-none`,
          FORM_DISABLED,
          "disabled:pointer-events-none",
          "file:text-gray-900 placeholder:text-gray-500 selection:bg-purple-900 selection:text-white border-gray-300 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus:ring-2 focus:ring-purple-500 focus:border-transparent",
          className,
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };

