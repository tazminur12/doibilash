import React, { Suspense } from "react";
import CorporateOrderEditor from "@/components/admin/CorporateOrderEditor";

export default function AdminNewCorporateOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-bengali text-stone-500">
          কর্পোরেট কোটেশন ফর্ম লোড হচ্ছে...
        </div>
      }
    >
      <CorporateOrderEditor />
    </Suspense>
  );
}
