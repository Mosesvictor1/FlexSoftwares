export const salesOrderConfig = {
  transSource: "Sales Order",
  title: "Create New Sales Order",
  submitButtonText: "Save Sales Order",
  apiEndpoint: "/api/sales-orders",
  sections: ["customer", "general", "items", "totals"],
  fields: {
    PaymentMode: {
      options: ["Cash", "Card", "Transfer"],
      required: true,
    },
  },
};
