import React, { Suspense } from "react";
import PackageEditor from "@/components/admin/PackageEditor";

export default function AdminNewPackagePage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-bengali text-stone-500">
          প্যাকেজ এডিটর লোড হচ্ছে...
        </div>
      }
    >
      <PackageEditor />
    </Suspense>
  );
}
