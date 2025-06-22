export const salesConfig = {
  transSource: "Sales",
  title: "Create New Sale",
  submitButtonText: "Save Sale",
  apiEndpoint: "/api/sales",
  sections: ["customer", "general", "items", "payment", "totals", "tender"],
  fields: {
    PaymentMode: {
      options: ["Cash", "Card", "Transfer", "Credit"],
      required: true,
    },
  },
};
