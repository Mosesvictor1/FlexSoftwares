import React from "react";
import POSForm from "../../../components/pos/POSForm";
import { invoiceConfig } from "../../../components/pos/configs/invoiceConfig";
import { createInvoice } from "../../../services/api";

const CreateInvoice = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Invoice", href: "/dashboard/pos/invoice/list" },
    { label: "Create Invoice" },
  ];

  const handleSubmit = async (formData) => {
    try {
      console.log("Submitting invoice:", formData);
      const response = await createInvoice(formData);
      console.log("Invoice created successfully:", response);
      alert("Invoice created successfully!");
      // You can redirect to invoice list or reset form here
    } catch (error) {
      console.error("Failed to create invoice:", error);
      alert("Failed to create invoice. Please try again.");
    }
  };

  return (
    <POSForm
      config={invoiceConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
    />
  );
};

export default CreateInvoice;
