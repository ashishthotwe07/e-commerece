import React from "react";
import { Link } from "react-router-dom";
const Card = ({ image, title, description, link }) => {
  return (
    <div className="py-8 px-8 h-40 md:h-56 w-96  max-w-sm mx-auto bg-yellow-200 shadow-lg space-y-2 flex justify-around items-center">
      <img
        className="block mx-auto h-32 md:h-48  sm:mx-0 sm:shrink-0"
        src={image}
        alt="Woman's Face"
      />
      <div className="text-center space-y-2 sm:text-left">
        <div className="space-y-0.5">
          <p className="text-md text-black whitespace-nowrap font-semibold">
            {title}
          </p>
          <p className="text-slate-500 font-medium">{description}</p>
        </div>
        <button className="px-4 py-1 text-sm text-gray-600 border-2 border-gray-700">
          <Link to={link}>shop now</Link>
        </button>
      </div>
    </div>
  );
};

export default Card;
