import React from "react";

const TotalSummarySection = ({
  formData,
  handleFormChange,
  calculateTotalPayable,
}) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 sm:p-8 mt-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Total Summary
    </h2>
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Sub Total:
        </span>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {parseFloat(formData.TotalAmountItems).toFixed(2)}
        </span>
      </div>
      {/* VAT Amount */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <label
          htmlFor="VATAmount"
          className="text-sm md:text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          VAT Amount:
        </label>
        <input
          type="number"
          name="VATAmount"
          id="VATAmount"
          value={formData.VATAmount}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
        />
      </div>
      {/* Discount Amount */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <label
          htmlFor="DiscountAmount"
          className="text-sm md:text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          Discount Amount:
        </label>
        <input
          type="number"
          name="DiscountAmount"
          id="DiscountAmount"
          value={formData.DiscountAmount}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
        />
      </div>
      {/* Commission */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <label
          htmlFor="Commission"
          className="text-sm md:text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          Commission:
        </label>
        <input
          type="number"
          name="Commission"
          id="Commission"
          value={formData.Commission}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
        />
      </div>
      {/* Extra Charges */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <label
          htmlFor="ExtraChargeAmount"
          className="text-sm md:text-lg font-medium text-gray-700 dark:text-gray-300"
        >
          Extra Charges:
        </label>
        <input
          type="number"
          name="ExtraChargeAmount"
          id="ExtraChargeAmount"
          value={formData.ExtraChargeAmount}
          onChange={handleFormChange}
          min="0"
          step="0.01"
          className="w-full sm:w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
        />
      </div>
      {/* Total Payable */}
      <div className="flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-700">
        <span className="text-md md:text-xl font-semibold text-gray-900 dark:text-white">
          Total Payable:
        </span>
        <span className="text-md md:text-xl font-bold text-blue-600 dark:text-blue-400">
          {calculateTotalPayable().toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

export default TotalSummarySection;
