import React, { Suspense } from "react";
import OrderEditor from "@/components/admin/OrderEditor";

export default async function OrderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-10 text-center font-bengali text-stone-500">লোড হচ্ছে...</div>}>
      <OrderEditor orderId={id} />
    </Suspense>
  );
}
