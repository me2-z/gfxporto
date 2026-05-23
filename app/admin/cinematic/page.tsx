"use client";

import { PortfolioManager } from "@/components/admin/PortfolioManager";

export default function AdminCinematic() {
  return (
    <PortfolioManager
      title="Cinematic"
      description="Manage cinematic thumbnails and publish them directly to the cinematic page."
      forceCategory="Cinematic"
      showFilters={false}
    />
  );
}
