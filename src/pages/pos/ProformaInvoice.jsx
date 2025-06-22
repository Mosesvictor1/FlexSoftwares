import React from "react";
import POSForm from "../../components/pos/POSForm";
import { proformaInvoiceConfig } from "../../components/pos/configs/proformaInvoiceConfig";

const ProformaInvoice = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Proforma Invoice" },
    { label: "Create Proforma Invoice" },
  ];

  const handleSubmit = (formData) => {
    console.log("Proforma Invoice submitted:", formData);
    // Handle proforma invoice-specific submission logic
    alert("Proforma Invoice submitted successfully!");
  };

  return (
    <POSForm
      config={proformaInvoiceConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default ProformaInvoice;
