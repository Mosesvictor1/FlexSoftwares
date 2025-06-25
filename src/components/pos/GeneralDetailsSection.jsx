import React, { useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";

const GeneralDetailsSection = ({
  formData,
  handleFormChange,
  dropdownData = {},
}) => {
  // Set default location if not set
  useEffect(() => {
    if (
      dropdownData &&
      dropdownData.DefaultLocation &&
      (!formData.LocationCode || formData.LocationCode === "MAIN") &&
      dropdownData.Locations?.some(
        (loc) => loc.EntryCode === dropdownData.DefaultLocation
      )
    ) {
      handleFormChange({
        target: {
          name: "LocationCode",
          value: dropdownData.DefaultLocation,
        },
      });
    }
    // eslint-disable-next-line
  }, [dropdownData?.DefaultLocation, dropdownData?.Locations]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        General Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voucher Number */}
        <div className="relative">
          <label
            htmlFor="Vno"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Voucher Number
          </label>
          <input
            type="text"
            name="Vno"
            id="Vno"
            value={formData.Vno}
            onChange={handleFormChange}
            className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
          />
        </div>

        {/* Transaction Date */}
        <div className="relative">
          <label
            htmlFor="TransDate"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Transaction Date
          </label>
          <input
            type="date"
            name="TransDate"
            id="TransDate"
            value={formData.TransDate}
            onChange={handleFormChange}
            className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Account Year */}
        {/* <div className="relative">
          <label
            htmlFor="AcctYear"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Account Year
          </label>
          <input
            type="text"
            name="AcctYear"
            id="AcctYear"
            value={formData.AcctYear}
            onChange={handleFormChange}
            className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
          />
        </div> */}

        {/* Location Code */}
        <div className="relative">
          <label
            htmlFor="LocationCode"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Location Code
          </label>
          <select
            name="LocationCode"
            id="LocationCode"
            value={formData.LocationCode || dropdownData.DefaultLocation || ""}
            onChange={handleFormChange}
            className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3 appearance-none pr-8"
          >
            {dropdownData?.Locations?.map((loc) => (
              <option key={loc.EntryCode} value={loc.EntryCode}>
                {loc.Description || loc.EntryCode}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sales Order Dropdown */}
        {dropdownData?.SalesOrders?.length > 0 && (
          <div className="relative">
            <label
              htmlFor="SalesOrder"
              className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
            >
              Sales Order
            </label>
            <select
              name="SalesOrder"
              id="SalesOrder"
              value={formData.SalesOrder || ""}
              onChange={handleFormChange}
              className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3 appearance-none pr-8"
            >
              <option value="">Select Sales Order</option>
              {dropdownData.SalesOrders.map((order) => (
                <option key={order.VoucherNumber} value={order.VoucherNumber}>
                  {order.VoucherNumberStr}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralDetailsSection;
