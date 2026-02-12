import * as React from "react";

import {cn} from "../utils";
import {FORM_INPUT_TEXT_SIZE, FORM_DISABLED} from "@/components/EndUserComm/lib/formStyles";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        data-slot="textarea"
        className={cn(
          `resize-none flex w-full rounded-md border bg-white px-3 py-2 ${FORM_INPUT_TEXT_SIZE} transition-[color,box-shadow] outline-none`,
          FORM_DISABLED,
          "border-gray-300 placeholder:text-gray-500 focus-visible:border-purple-500 focus-visible:ring-purple-500/50 field-sizing-content min-h-16 focus-visible:ring-[3px]",
          className,
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

