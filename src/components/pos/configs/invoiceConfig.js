export const invoiceConfig = {
  transSource: "Invoice",
  title: "Create New Invoice",
  submitButtonText: "Save Invoice",
  apiEndpoint: "/api/invoices",
  sections: [
    "customer",
    "general",
    "items",
    "payment",
    "empties",
    "totals",
    "tender",
  ],
  fields: {
    PaymentMode: {
      options: ["Cash", "Card", "Transfer"],
      required: true,
    },
  },
};
