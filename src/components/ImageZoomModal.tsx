import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ImageZoomModal = ({
  isOpen,
  onClose,
  imageUrl,
  alt,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}) => {
  if (typeof window === "undefined") return null; // SSR safety

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Center container */}
          <motion.div
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-white"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 w-full flex justify-end p-4 bg-gradient-to-b from-white/70 to-transparent z-10">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <X className="h-8 w-8" />
              </button>
            </div>

            {/* Image */}
            <div className="flex items-center justify-center bg-white">
              <motion.img
                key={imageUrl}
                src={imageUrl}
                alt={alt}
                className="max-h-[85vh] object-contain select-none"
                draggable={false}
              />
            </div>

            {/* Caption */}
            {alt && (
              <div className="bg-gray-100 text-gray-800 text-center text-sm py-3">
                {alt}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
