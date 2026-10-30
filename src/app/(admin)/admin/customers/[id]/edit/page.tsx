import React, { Suspense } from "react";
import CustomerEditor from "@/components/admin/CustomerEditor";

export default async function AdminCustomerEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-bengali text-stone-500">
          গ্রাহক ফর্ম লোড হচ্ছে...
        </div>
      }
    >
      <CustomerEditor customerId={id} />
    </Suspense>
  );
}
