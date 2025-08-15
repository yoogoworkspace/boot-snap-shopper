import React from "react";
import { X } from "lucide-react";

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
  if (!isOpen) return null; // Do not render if not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <button
        className="absolute top-4 right-4 text-white text-2xl"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </button>
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
      />
    </div>
  );
};
