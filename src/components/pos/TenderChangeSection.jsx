import React from "react";

const TenderChangeSection = ({ formData, handleFormChange }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
      Tender and Change
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Tender Amount */}
      <div className="relative w-full">
        <label
          htmlFor="Tender"
          className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          Tender Amount
        </label>
        <input
          type="number"
          name="Tender"
          id="Tender"
          value={formData.Tender}
          onChange={handleFormChange}
          className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
        />
      </div>
      {/* Change */}
      <div className="relative w-full">
        <label
          htmlFor="Change"
          className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          Change
        </label>
        <input
          type="number"
          name="Change"
          id="Change"
          value={formData.Change}
          onChange={handleFormChange}
          className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
        />
      </div>
    </div>
  </div>
);

export default TenderChangeSection;
