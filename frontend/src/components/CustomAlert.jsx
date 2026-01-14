import React, { useEffect, useState } from "react";
let alerthandler;

export const showAlertHandler = (message) => {
  if (alerthandler) {
    alerthandler(message);
  }
};

function CustomAlert() {
  const [mess, setMess] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    alerthandler = (message) => {
      setMess(message);
      setVisible(true);
    };
  }, []);
  return (
    visible && (
      <div className="fixed inset-0 flex items-start justify-center bg-black/50 z-100">
        <div className="bg-[#202124] text-white rounded-2xl shadow-lg p-6 w-80 mt-0.5 md:w-100">
          <p className="text-md mt-2">{mess}</p>
          <div className="flex justify-end mt-5">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full flex items-center text-sm"
              onClick={() => setVisible(false)}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default CustomAlert;
