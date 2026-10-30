import React, { Suspense } from "react";
import PackageEditor from "@/components/admin/PackageEditor";

export default async function PackageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-bengali text-stone-500">
          প্যাকেজ এডিটর লোড হচ্ছে...
        </div>
      }
    >
      <PackageEditor packageId={id} />
    </Suspense>
  );
}
