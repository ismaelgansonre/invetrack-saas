// app/inventory/layout.js

import React, { ReactNode } from "react";
import PageLayout from "@/layouts/PageLayout";

export default function InventoryLayout({ children }: { children: ReactNode }) {
  return <PageLayout>{children}</PageLayout>;
}
