import React, { useState, useRef, useEffect } from "react";

const Popover = ({ buttonLabel, popoverContent, popoverId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  const handleButtonClick = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        data-popover-target={popoverId}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleButtonClick}
      >
        {buttonLabel}
      </button>

      <div
        ref={popoverRef}
        data-popover
        id={popoverId}
        role="tooltip"
        className={`absolute z-10 ${
          isVisible ? "visible opacity-100" : "invisible opacity-0"
        } inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800`}
      >
        <div className="px-3 py-2">{popoverContent}</div>
        <div data-popper-arrow></div>
      </div>
    </div>
  );
};

export default Popover;
