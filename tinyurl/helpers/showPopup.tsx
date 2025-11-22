"use client";

import { createRoot } from "react-dom/client";
import Popup from "../pages/components/Popup";

export default function showPopup(
  message: string,
  type: "success" | "error" | "info" = "success",
  duration = 2500
) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const root = createRoot(container);

  const remove = () => {
    root.unmount();
    container.remove();
  };

  root.render(

    <Popup message={message} type={type} duration={duration} onClose={remove} />
  );
}
