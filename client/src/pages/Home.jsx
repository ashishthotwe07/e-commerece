import React from "react";
import axios from "axios";
import HeroComponent from "../components/HeroComponent";
import CategoryDropdown from "../components/category/CategoryDropdown";
import SubcategoryGrid from "../components/subcategory/SubcategoryGrid";

export default function Home() {
  return (
    <div>
      <CategoryDropdown showImages={true} />
      <HeroComponent />
      <SubcategoryGrid />
    </div>
  );
}
