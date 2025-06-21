import React, { useMemo, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dynamic from "next/dynamic";
import Card from "./DashboardCard";
import { useProductStore } from "@/stores/productStore";
import { useAuthStore } from "@/stores/authStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DynamicBarChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  {
    ssr: false,
  }
);

/**
 * InventoryOverview Component
 *
 * Displays an overview of the inventory, including a chart of products by supplier
 * and top products by value.
 *
 * @component
 */
const InventoryOverview: React.FC = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const { profile } = useAuthStore();

  // Fetch products when component mounts
  useEffect(() => {
    if (profile?.organization_id) {
      fetchProducts(profile.organization_id);
    }
  }, [profile?.organization_id, fetchProducts]);

  const chartData = useMemo(() => {
    // Group products by supplier (for now, we'll use a simple grouping)
    // In a real app, you'd want to fetch suppliers separately
    const supplierGroups = products.reduce((acc, product) => {
      const supplierId = product.supplier_id || 'Unknown';
      acc[supplierId] = (acc[supplierId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      labels: Object.keys(supplierGroups),
      datasets: [
        {
          label: "Number of Products",
          data: Object.values(supplierGroups),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  }, [products]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Products by Supplier",
      },
    },
  };

  const topProducts = useMemo(() => {
    return products
      .sort((a, b) => (b.retail_price || 0) - (a.retail_price || 0))
      .slice(0, 5)
      .map((product) => ({
        name: product.name,
        value: `$${(product.retail_price || 0).toFixed(2)}`,
      }));
  }, [products]);

  if (loading) {
    return (
      <Card title="Inventory Overview" className="h-full">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading inventory data...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Inventory Overview" className="h-full">
      <div className="flex flex-col md:flex-row">
        <div className="w-full h-64 md:w-1/2">
          <DynamicBarChart data={chartData} options={chartOptions} />
        </div>
        <div className="w-full mt-4 md:w-1/2 md:mt-0 md:ml-4">
          <h3 className="mb-2 text-lg font-semibold">
            Top 5 Products by Value
          </h3>
          {topProducts.length > 0 ? (
            <ul>
              {topProducts.map((product, index) => (
                <li key={index} className="flex justify-between py-2 border-b">
                  <span>{product.name}</span>
                  <span className="font-medium">{product.value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InventoryOverview; 