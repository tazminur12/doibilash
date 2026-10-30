import React, { Suspense } from "react";
import CategoryEditor from "@/components/admin/CategoryEditor";

export default function NewCategoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bengali text-stone-500">লোড হচ্ছে...</div>}>
      <CategoryEditor />
    </Suspense>
  );
}
