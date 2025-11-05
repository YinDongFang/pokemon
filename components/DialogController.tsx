import useDialogStore from "@/store/dialogStore";
import React, { isValidElement, useEffect } from "react";

interface DialogControllerProps {
  id: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function DialogController({
  id,
  children,
  onOpenChange,
}: DialogControllerProps) {
  const { ids, close } = useDialogStore();
  const child = React.Children.only(children);

  if (!isValidElement(child))
    throw new Error("DialogController must have a single child");

  useEffect(() => {
    onOpenChange?.(!!ids[id]);
  }, [!!ids[id]]);

  return React.cloneElement(child, {
    ...(child.props as any),
    open: !!ids[id],
    onOpenChange: (open: boolean) => {
      if (!open) close(id);
      (child.props as any)?.onOpenChange?.(open);
    },
  });
}
