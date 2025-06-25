import React from "react";
import POSForm from "../../../components/pos/POSForm";
import { salesOrderConfig } from "../../../components/pos/configs/salesOrderConfig";
import { useTransactionDropdowns } from "../../../hooks/useTransactionDropdowns";

const CreateSalesOrder = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sales Order" },
    { label: "Create Sales Order" },
  ];

  const { dropdownData, loading, error } = useTransactionDropdowns(
    salesOrderConfig.transSource
  );

  const handleSubmit = (formData) => {
    console.log("Sales Order submitted:", formData);
    // Handle sales order-specific submission logic
    alert("Sales Order submitted successfully!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <POSForm
      config={salesOrderConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
      dropdownData={dropdownData}
    />
  );
};

export default CreateSalesOrder;
