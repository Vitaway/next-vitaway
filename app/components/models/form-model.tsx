"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  width?: string;
  height?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FormModal: React.FC<ModalProps> = ({ width = 'max-w-xl', height = 'max-h-[90vh]', isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 bg-opacity-50 backdrop-blur-md py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <motion.div
              className={`relative w-full ${width} ${height} overflow-auto p-6 mx-4 bg-white sm:mx-6 md:mx-8 lg:mx-auto`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl border border-gray-200 rounded-xl px-2"
                aria-label="Close modal"
              >
                &times;
              </button>

              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormModal;
