import React, { FC } from 'react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: string,
  children: ReactNode
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        <div className="bg-white rounded-lg shadow-lg max-w-md mx-auto z-10 p-4">
          {result}
        </div>
      </div>
    </div>
  );
};

export default Modal;