import React from "react";
import POSForm from "../../components/pos/POSForm";
import { salesConfig } from "../../components/pos/configs/salesConfig";

const Sales = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sales" },
    { label: "Create Sale" },
  ];

  const handleSubmit = (formData) => {
    console.log("Sale submitted:", formData);
    // Handle sales-specific submission logic
    alert("Sale submitted successfully!");
  };

  return (
    <POSForm
      config={salesConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default Sales;
