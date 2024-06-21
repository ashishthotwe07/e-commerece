import React, { useState } from "react";
import HeroComponent from "../components/HeroComponent";
import ProductGrid from "./Product/ProductGrid";
import mens from "../../public/mens.png";
import kids from "../../public/kids.png";
import Card from "../components/Cards";
import womens from "../../public/womens.png";
import NewArrival from "./Product/NewArrivals";

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <HeroComponent />

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-0 gap-3">
          <Card
            image={womens}
            title="Women's Wear"
            description="Upto 80% off"
            link="/product-listing/Women's Clothing"
          />
          <Card
            image={kids}
            title="Kid's Wear"
            description="Upto 80% off"
            link="/product-listing/Kid's Clothing"
          />
          <Card
            image={mens}
            title="Men's Wear"
            description="Upto 80% off"
            link="/product-listing/Men's Clothing"
          />
        </div>
      </div>

      <ProductGrid />
      <NewArrival />
    </div>
  );
}
