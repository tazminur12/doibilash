import React from "react";
import CorporateDetailView from "@/components/admin/CorporateDetailView";

export default async function CorporateOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CorporateDetailView orderId={id} />;
}
