"use client";

import { PortfolioManager } from "@/components/admin/PortfolioManager";

export default function AdminPortfolio() {
  return (
    <PortfolioManager
      title="Portfolio"
      description="Manage your gallery and publish work into each category page."
      showFilters
    />
  );
}
