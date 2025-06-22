import React from "react";
import POSForm from "../../components/pos/POSForm";
import { salesOrderConfig } from "../../components/pos/configs/salesOrderConfig";

const SalesOrder = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sales Order" },
    { label: "Create Sales Order" },
  ];

  const handleSubmit = (formData) => {
    console.log("Sales Order submitted:", formData);
    // Handle sales order-specific submission logic
    alert("Sales Order submitted successfully!");
  };

  return (
    <POSForm
      config={salesOrderConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default SalesOrder;
