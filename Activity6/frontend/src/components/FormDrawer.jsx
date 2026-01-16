import React from "react";
import { X } from "react-feather";

const FormDrawer = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />
      {/* Drawer Panel */}
      <div 
        className="absolute right-0 top-0 h-full w-full sm:w-[500px] bg-gradient-to-br from-[#1a1a1a] to-[#121212] text-gray-100 shadow-2xl flex flex-col border-l border-gray-800"
        style={{ animation: 'slideIn 0.3s ease-out' }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-transparent">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all duration-200 hover:scale-110"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default FormDrawer;
