import * as React from "react";
import {cva, type VariantProps} from "class-variance-authority";
import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

import {cn} from "../utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../overlay/dialog";
import { Button } from "../controls/button";

// Message Dialog with Status – dynamic status colors (theme-aligned)
const statusColors = {
  info: "#2563eb",
  success: "#16a34a",
  warning: "#d97706",
  error: "#d4183d",
} as const;

const statusConfig = {
  info: { icon: Info, color: statusColors.info, bgClass: "bg-blue-100", textClass: "text-blue-600" },
  success: { icon: CheckCircle, color: statusColors.success, bgClass: "bg-green-100", textClass: "text-green-600" },
  warning: { icon: AlertTriangle, color: statusColors.warning, bgClass: "bg-orange-100", textClass: "text-orange-600" },
  error: { icon: XCircle, color: statusColors.error, bgClass: "bg-red-100", textClass: "text-red-600" },
} as const;

type StatusType = keyof typeof statusConfig;

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "default" | "destructive";
  className?: string;
  type?: "confirmation" | "alert";
  /** When set, renders as a status message dialog with icon and colored top border */
  status?: StatusType;
}

function AlertDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    confirmVariant = "default",
    className,
    type = "confirmation",
    status,
  }: AlertDialogProps) {
    const handleConfirm = () => {
      if (onConfirm) {
        onConfirm();
      }
      onClose();
    };

    const handleCancel = () => {
      onClose();
    };

    const isAlert = type === "alert";
    const finalConfirmLabel = isAlert ? confirmLabel || "OK" : confirmLabel;
    const showCancel = !isAlert;

    const useStatusLayout = status != null;
    const config = useStatusLayout ? statusConfig[status] : null;
    const StatusIcon = config?.icon;

    return (
      <Dialog open={open} onOpenChange={(isOpen: boolean) => !isOpen && onClose()}>
        <DialogContent
          className={cn(className || "max-w-md", useStatusLayout && "sm:max-w-[450px]")}
          style={config ? { borderTop: `6px solid ${config.color}` } : undefined}
        >
          {useStatusLayout && config && StatusIcon ? (
            <>
              <div className="flex items-start gap-4 mb-4">
                <div className={cn("rounded-full p-2 shrink-0", config.bgClass)}>
                  <StatusIcon className={cn("w-5 h-5", config.textClass)} />
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg mb-1">{title}</DialogTitle>
                  <DialogDescription>{description}</DialogDescription>
                </div>
              </div>
              <DialogFooter className="gap-2">
                {showCancel && (
                  <Button variant="outline" onClick={handleCancel}>
                    {cancelLabel}
                  </Button>
                )}
                <Button
                  variant="purple"
                  onClick={handleConfirm}
                >
                  {finalConfirmLabel}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                {showCancel && (
                  <Button variant="outline" onClick={handleCancel}>
                    {cancelLabel}
                  </Button>
                )}
                <Button
                  variant="purple"
                  onClick={handleConfirm}
                >
                  {finalConfirmLabel}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    );
  }

export { Alert, AlertDialog };

