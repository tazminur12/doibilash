import React, { Suspense } from "react";
import ProductEditor from "@/components/admin/ProductEditor";

export default function NewProductPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bengali text-stone-500">লোড হচ্ছে...</div>}>
      <ProductEditor />
    </Suspense>
  );
}
