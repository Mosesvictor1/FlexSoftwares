import React from "react";
import POSForm from "../../../components/pos/POSForm";
import { salesConfig } from "../../../components/pos/configs/salesConfig";
import { useTransactionDropdowns } from "../../../hooks/useTransactionDropdowns";

const CreateSales = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sales" },
    { label: "Create Sale" },
  ];

  const { dropdownData, loading, error } = useTransactionDropdowns(
    salesConfig.transSource
  );

  const handleSubmit = (formData) => {
    console.log("Sale submitted:", formData);
    alert("Sale submitted successfully!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <POSForm
      config={salesConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
      dropdownData={dropdownData}
    />
  );
};

export default CreateSales;
