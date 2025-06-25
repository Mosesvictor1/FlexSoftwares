import React from "react";
import POSForm from "../../../components/pos/POSForm";
import { salesReturnsConfig } from "../../../components/pos/configs/salesReturnsConfig";
import { useTransactionDropdowns } from "../../../hooks/useTransactionDropdowns";

const CreateSalesReturns = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sales Returns" },
    { label: "Create Sales Return" },
  ];

  const { dropdownData, loading, error } = useTransactionDropdowns(
    salesReturnsConfig.transSource
  );

  const handleSubmit = (formData) => {
    console.log("Sales Return submitted:", formData);
    // Handle sales return-specific submission logic
    alert("Sales Return submitted successfully!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <POSForm
      config={salesReturnsConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
      dropdownData={dropdownData}
    />
  );
};

export default CreateSalesReturns;
