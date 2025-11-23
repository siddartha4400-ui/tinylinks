"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface PopupProps {
          message: string;
          type: "success" | "error" | "info";
          duration?: number;
          onClose?: () => void;
}

export default function Popup({
          message,
          type,
          duration = 2500,
          onClose,
}: PopupProps) {
          useEffect(() => {
                    const timer = setTimeout(() => {
                              onClose?.();
                    }, duration);

                    return () => clearTimeout(timer);
          }, [duration, onClose]);

          const colors = {
                    success: "bg-green-600",
                    error: "bg-red-600",
                    info: "bg-blue-600",
          };

          const element = (
                    <div
                              className={`fixed top-5 inset-x-0 mx-auto  ${colors[type]} text-white px-6 py-3 rounded shadow-lg text-center w-3/5 animate-slide-in z-50`}
                    >
                              {message}
                    </div>
          );

          return typeof window !== "undefined"
                    ? createPortal(element, document.body)
                    : null;
}
