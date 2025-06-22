import React from "react";
import POSForm from "../../components/pos/POSForm";
import { salesReturnsConfig } from "../../components/pos/configs/salesReturnsConfig";

const SalesReturns = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sales Returns" },
    { label: "Create Sales Return" },
  ];

  const handleSubmit = (formData) => {
    console.log("Sales Return submitted:", formData);
    // Handle sales return-specific submission logic
    alert("Sales Return submitted successfully!");
  };

  return (
    <POSForm
      config={salesReturnsConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default SalesReturns;
