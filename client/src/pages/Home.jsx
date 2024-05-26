import React from "react";
import HeroComponent from "../components/HeroComponent";
import CreateProduct from "./CreateProduct";

export default function Home() {
  return (
    <div>
      <HeroComponent />
      <CreateProduct />
    </div>
  );
}
