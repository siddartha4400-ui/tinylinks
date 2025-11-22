"use client";
import showPopup from "../../../helpers/showPopup";

export default function Page() {
          return (
                    <div className="p-6">
                              <button
                                        className="bg-blue-600 text-white px-4 py-2 rounded"
                                        onClick={() => showPopup("Deleted link!", "success", 2000)}
                              >
                                        Show Popup
                              </button>
                    </div >
          );
}
