import React from "react";
import HeroComponent from "../components/HeroComponent";
import CategoryGrid from "./CategoryPages/CategoryGrid";

export default function Home() {
  return (
    <div>
      <HeroComponent />
      <CategoryGrid />
    </div>
  );
}
