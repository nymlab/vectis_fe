import { ReactNode } from "react";
import { IconError, IconSuccess } from "./Icon";

type AlertProps = {
  children: ReactNode;
};

export function AlertSuccess({ children }: AlertProps) {
  return (
    <div className="alert alert-success shadow-lg">
      <div className="flex-1 items-center">
        <span>
          <IconSuccess />
        </span>
        <span className="flex-grow break-all">{children}</span>
      </div>
    </div>
  );
}

export function AlertError({ children }: AlertProps) {
  return (
    <div className="alert alert-error shadow-lg">
      <div className="flex-1 items-center">
        <span>
          <IconError />
        </span>
        <span className="flex-grow break-all">{children}</span>
      </div>
    </div>
  );
}
