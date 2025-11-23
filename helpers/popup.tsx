"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";

interface MessageProps {
          message: string;
          type?: "success" | "error" | "info";
          duration?: number;
          onClose?: () => void;
}

const Message = ({ message, type = "success", duration = 3000, onClose }: MessageProps) => {
          const [visible, setVisible] = useState(true);

          useEffect(() => {
                    const timer = setTimeout(() => {
                              setVisible(false);
                              onClose?.();
                    }, duration);

                    return () => clearTimeout(timer);
          }, [duration, onClose]);

          if (!visible) return null;

          const bgColor =
                    type === "success" ? "bg-green-600" :
                              type === "error" ? "bg-red-600" :
                                        "bg-blue-600";

          return createPortal(
                    <div
                              className={`fixed top-5 inset-x-0 mx-auto ${bgColor} text-white px-6 py-3 rounded shadow-lg text-center w-3/5 animate-slide-in z-50`}
                    >
                              {message}
                    </div>,
                    document.body
          );
};

// ✅ Updated for React 18+
const customAlert = (
          message: string,
          type: "success" | "error" | "info" = "success",
          duration: number = 3000
) => {
          const container = document.createElement("div");
          document.body.appendChild(container);

          const root = createRoot(container); // <-- use createRoot
          const remove = () => {
                    root.unmount();
                    if (container.parentNode) container.parentNode.removeChild(container);
          };

          root.render(<Message message={message} type={type} duration={duration} onClose={remove} />);
};
export default customAlert;