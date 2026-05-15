"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";

interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
}

export function ImageLightbox({ src, onClose }: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (src) {
      document.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [src, handleKeyDown]);

  if (!src) return null;

  return createPortal(
    <div
      role="dialog"
      style={{ pointerEvents: "auto" }}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 flex items-center justify-center size-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-10"
        style={{ pointerEvents: "auto" }}
      >
        <Icon icon="lucide:x" className="size-5" />
      </button>

      <img
        src={src}
        alt="Preview"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ pointerEvents: "auto" }}
      />
    </div>,
    document.body
  );
}
