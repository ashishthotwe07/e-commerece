import React from "react";

export default function Loading() {
  return (
    <div class="flex justify-center items-center h-full">
      <div class="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
    </div>
  );
}
