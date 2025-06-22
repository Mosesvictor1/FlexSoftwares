export const salesReturnsConfig = {
  transSource: "Sales Returns",
  title: "Create New Sales Return",
  submitButtonText: "Save Sales Return",
  apiEndpoint: "/api/sales-returns",
  sections: [
    "customer",
    "general",
    "items",
    "payment",
    "returnReason",
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
