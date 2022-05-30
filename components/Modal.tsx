import { ReactNode } from "react";

type ModalProps = {
  id: string;
  children?: ReactNode;
  onClose?: () => void;
};

export default function Modal({ id, children, onClose }: ModalProps) {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor={id} className="btn btn-sm btn-circle absolute right-2 top-2" onClick={onClose}>
            ✕
          </label>
          {children}
        </div>
      </div>
    </>
  );
}
