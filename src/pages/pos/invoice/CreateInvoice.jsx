import React from "react";
import POSForm from "../../../components/pos/POSForm";
import { invoiceConfig } from "../../../components/pos/configs/invoiceConfig";
import { useTransactionDropdowns } from "../../../hooks/useTransactionDropdowns";
import Spinner from "../../../components/ui/Spinner";

const CreateInvoice = () => {
  const breadcrumbs = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Invoice", href: "/dashboard/pos/invoice/list" },
    { label: "Create Invoice" },
  ];

  const { dropdownData, loading, error } = useTransactionDropdowns(
    invoiceConfig.transSource
  );

  const handleSubmit = async (formData) => {
    try {
      console.log("Submitting invoice:", formData);
      // const response = await createInvoice(formData);
      alert("Invoice created successfully!");
    } catch {
      alert("Failed to create invoice. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="flex flex-1 h-60 items-center justify-center gap-6">
        <Spinner />
        <h2 className="font-bold">Loading Data...</h2>
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <POSForm
      config={invoiceConfig}
      onSubmit={handleSubmit}
      breadcrumbs={breadcrumbs}
      dropdownData={dropdownData}
    />
  );
};

export default CreateInvoice;
