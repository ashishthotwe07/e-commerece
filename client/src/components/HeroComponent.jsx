import React from "react";

const HeroComponent = () => {
  return (
    <section className="bg-blue-400">
      <div className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-2 sm:py-16 lg:px-6">
        <img
          className="w-full rounded-lg shadow-lg "
          src="https://images.unsplash.com/photo-1621330396167-b3d451b9b83b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Smartphone discount"
        />
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 text-2xl sm:text-3xl md:text-4xl tracking-tight font-extrabold text-gray-900">
            Up to 40% Discount on Smartphones
          </h2>
          <p className="mb-6 flex  text-gray-900 md:text-lg">
            Don't miss out on our exclusive offer. Get the best deals on the
            latest smartphones and accessories. Shop now and save up to 40%.
          </p>
          <a
            href="#"
            className="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800  font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Shop Now
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
