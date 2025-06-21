// src/components/Modal.jsx
import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary-dark-violet bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-text-light-gray rounded-lg shadow-xl max-w-lg w-full mx-auto p-6 relative">
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-primary-dark-violet">{title}</h2>
          <button
            onClick={onClose}
            className="text-primary-dark-violet hover:text-accent-purple text-3xl leading-none"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        <div className="text-primary-dark-violet">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
