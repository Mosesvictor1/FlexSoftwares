export const proformaInvoiceConfig = {
  transSource: "Proforma Invoice",
  title: "Create New Proforma Invoice",
  submitButtonText: "Save Proforma Invoice",
  apiEndpoint: "/api/proforma-invoices",
  sections: ["customer", "general", "items", "payment", "totals"],
  fields: {
    PaymentMode: {
      options: ["Cash", "Card", "Transfer"],
      required: true,
    },
  },
};
