import React from "react";
import HeroComponent from "../components/HeroComponent";
import CategoryGridComponent from "../components/category/CategoryGridComponent";

export default function Home() {
  return (
    <div>
      <HeroComponent />
      <CategoryGridComponent />
    </div>
  );
}
