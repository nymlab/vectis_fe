import { PropsWithChildren, ReactNode } from "react";

type ModalProps = {
  id: string;
  children?: ReactNode;
  onClose?: () => void;
};

import React from "react";

const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ id, onClose, children, ...rest }) => {
  return (
    <>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative overflow-y-visible">
          <label htmlFor={id} className="btn btn-sm btn-circle absolute right-2 top-2" onClick={onClose}>
            ✕
          </label>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
