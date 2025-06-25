import React from "react";
import POSForm from "../../../components/pos/POSForm";
import { proformaInvoiceConfig } from "../../../components/pos/configs/proformaInvoiceConfig";
import { useTransactionDropdowns } from "../../../hooks/useTransactionDropdowns";

const CreateProformaInvoice = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Proforma Invoice" },
    { label: "Create Proforma Invoice" },
  ];

  const { dropdownData, loading, error } = useTransactionDropdowns(
    proformaInvoiceConfig.transSource
  );

  const handleSubmit = (formData) => {
    console.log("Proforma Invoice submitted:", formData);
    // Handle proforma invoice-specific submission logic
    alert("Proforma Invoice submitted successfully!");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <POSForm
      config={proformaInvoiceConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
      dropdownData={dropdownData}
    />
  );
};

export default CreateProformaInvoice;
