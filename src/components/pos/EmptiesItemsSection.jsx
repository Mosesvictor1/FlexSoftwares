import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const defaultEmptyItem = {
  SerialNo: 1,
  ItemCode: "",
  ItemQty: 1,
  BulkRetFactor: 1,
};

const EmptiesItemsSection = ({ formData, setFormData }) => {
  const [currentEmptyItem, setCurrentEmptyItem] = useState(defaultEmptyItem);

  const handleEmptyItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmptyItem((prev) => ({ ...prev, [name]: value }));
  };

  const addEmptyItem = () => {
    if (currentEmptyItem.ItemCode && currentEmptyItem.ItemQty > 0) {
      setFormData((prev) => ({
        ...prev,
        EmptiesItems: [...prev.EmptiesItems, { ...currentEmptyItem }],
      }));
      setCurrentEmptyItem({
        ...defaultEmptyItem,
        SerialNo: formData.EmptiesItems.length + 2, // +2 for next serial
      });
    } else {
      alert("Please fill in Item Code and Quantity for the empty item.");
    }
  };

  const removeEmptyItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      EmptiesItems: prev.EmptiesItems.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Empties Items
      </h2>

      {/* Add Empty Item Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4 border-b pb-4 border-gray-200 dark:border-gray-700">
        {/* Item Code */}
        <div className="relative">
          <label
            htmlFor="emptyItemCode"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Item Code
          </label>
          <input
            type="text"
            name="ItemCode"
            id="emptyItemCode"
            value={currentEmptyItem.ItemCode}
            onChange={handleEmptyItemChange}
            className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
          />
        </div>

        {/* Quantity */}
        <div className="relative">
          <label
            htmlFor="emptyItemQty"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Quantity
          </label>
          <input
            type="number"
            name="ItemQty"
            id="emptyItemQty"
            min="1"
            value={currentEmptyItem.ItemQty}
            onChange={handleEmptyItemChange}
            className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
          />
        </div>

        {/* Bulk Ret Factor */}
        <div className="relative">
          <label
            htmlFor="emptyBulkRetFactor"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Bulk Ret Factor
          </label>
          <input
            type="number"
            name="BulkRetFactor"
            id="emptyBulkRetFactor"
            min="1"
            value={currentEmptyItem.BulkRetFactor}
            onChange={handleEmptyItemChange}
            className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
          />
        </div>

        {/* Add Button */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={addEmptyItem}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Empty
          </button>
        </div>
      </div>

      {/* Empties Items List */}
      {formData.EmptiesItems.length > 0 && (
        <div className="mt-8 space-y-4">
          {formData.EmptiesItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-blue-50 dark:bg-gray-700 rounded p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
            >
              {/* Item Code */}
              <div className="relative flex flex-col w-full">
                <label
                  htmlFor={`empty-item-code-${idx}`}
                  className="absolute -top-2 left-3 px-1 text-xs bg-blue-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                >
                  Item Code
                </label>
                <input
                  id={`empty-item-code-${idx}`}
                  type="text"
                  className="block w-full rounded-md border border-gray-300 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3"
                  value={item.ItemCode}
                  onChange={(e) => {
                    const newItems = [...formData.EmptiesItems];
                    newItems[idx].ItemCode = e.target.value;
                    setFormData((f) => ({ ...f, EmptiesItems: newItems }));
                  }}
                />
              </div>
              {/* Quantity */}
              <div className="relative flex flex-col w-full">
                <label
                  htmlFor={`empty-item-qty-${idx}`}
                  className="absolute -top-2 left-3 px-1 text-xs bg-blue-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                >
                  Qty
                </label>
                <input
                  id={`empty-item-qty-${idx}`}
                  type="number"
                  min="1"
                  className="block w-full rounded-md border border-gray-300 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-left"
                  value={item.ItemQty}
                  onChange={(e) => {
                    const newItems = [...formData.EmptiesItems];
                    newItems[idx].ItemQty = e.target.value;
                    setFormData((f) => ({ ...f, EmptiesItems: newItems }));
                  }}
                />
              </div>
              {/* Bulk Ret */}
              <div className="relative flex flex-col w-full">
                <label
                  htmlFor={`empty-item-bulkret-${idx}`}
                  className="absolute -top-2 left-3 px-1 text-xs bg-blue-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                >
                  Bulk Ret
                </label>
                <input
                  id={`empty-item-bulkret-${idx}`}
                  type="number"
                  min="1"
                  className="block w-full rounded-md border border-gray-300 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-right"
                  value={item.BulkRetFactor}
                  onChange={(e) => {
                    const newItems = [...formData.EmptiesItems];
                    newItems[idx].BulkRetFactor = e.target.value;
                    setFormData((f) => ({ ...f, EmptiesItems: newItems }));
                  }}
                />
              </div>
              {/* Remove button */}
              <div className="flex flex-col w-16 items-end justify-end">
                <button
                  type="button"
                  onClick={() => removeEmptyItem(idx)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mt-5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmptiesItemsSection;
