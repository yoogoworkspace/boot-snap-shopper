
import { useState } from "react";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt: string;
}

export const ImageZoomModal = ({ isOpen, onClose, imageUrl, alt }: ImageZoomModalProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Controls */}
          <div className="absolute top-4 right-4 z-50 flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={resetZoom}
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom level indicator */}
          <div className="absolute top-4 left-4 z-50">
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Image */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt={alt}
              className={`max-w-none transition-transform duration-200 ${
                zoom > 1 ? 'cursor-grab' : 'cursor-zoom-in'
              } ${isDragging ? 'cursor-grabbing' : ''}`}
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                maxHeight: zoom === 1 ? '90vh' : 'none',
                maxWidth: zoom === 1 ? '90vw' : 'none'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={zoom === 1 ? handleZoomIn : undefined}
              draggable={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
