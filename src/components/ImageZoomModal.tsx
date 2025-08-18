import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ImageZoomModal = ({
  isOpen,
  onClose,
  imageUrl,
  alt
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // background click closes
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition"
            onClick={onClose}
          >
            <X className="h-7 w-7" />
          </button>

          {/* Image */}
          <motion.img
            key={imageUrl}
            src={imageUrl}
            alt={alt}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-zoom-in"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()} // prevent closing on image click
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
