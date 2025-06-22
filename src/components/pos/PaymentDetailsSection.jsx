import React from "react";
import { ChevronDown } from "lucide-react";

const PaymentDetailsSection = ({ formData, handleFormChange }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Payment Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Payment Mode Select */}
      <div className="relative">
        <label
          htmlFor="PaymentMode"
          className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
        >
          Payment Mode
        </label>
        <select
          name="PaymentMode"
          id="PaymentMode"
          value={formData.PaymentMode}
          onChange={handleFormChange}
          className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3 appearance-none pr-10"
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Transfer">Transfer</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Split Payment */}
      <div className="relative">
        <label
          htmlFor="PaymentModeSplitStr"
          className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
        >
          Split Payment
        </label>
        <input
          type="text"
          name="PaymentModeSplitStr"
          id="PaymentModeSplitStr"
          value={formData.PaymentModeSplitStr}
          onChange={handleFormChange}
          placeholder="Cash=10000|Card=5000"
          className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
        />
      </div>
    </div>
  </div>
);

export default PaymentDetailsSection;
