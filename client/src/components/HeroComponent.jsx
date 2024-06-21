import React from "react";
import apple from "../../public/apple.png";
import { Link } from "react-router-dom";

const HeroComponent = () => {
  return (
    <section className="bg-blue-400 md:ml-0 ml-4">
      <div className="md:gap-8  items-center py-4 px-4 mx-auto max-w-screen-xl flex sm:py-8 lg:px-6">
        <img className="md:h-96 h-64" src={apple} alt="Smartphone discount" />
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 text-xl sm:text-3xl justify-between md:text-4xl tracking-tight font-extrabold text-gray-900">
            Up to 40% off on Apple Iphone
          </h2>
          <p className="mb-6 hidden md:flex text-gray-900 md:text-lg">
            Don't miss out on our exclusive offer. Get the best deals on the
            latest smartphones and accessories. Shop now and save up to 40%.
          </p>
          <button className="px-4 py-1 text-sm text-white border-2 bg-gray-700 border-gray-700">
            <Link to={"/"}>shop now</Link>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
