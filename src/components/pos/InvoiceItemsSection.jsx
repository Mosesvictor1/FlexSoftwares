import React, { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";

const defaultItem = {
  SerialNo: 1,
  ItemCode: "",
  ItemQty: 1,
  UnitPrice: 0,
  AltSellingPrice: 0,
  LocationCode: "MAIN",
  ItemAmount: 0,
  BulkRetFactor: 1,
  ItemType: "",
  ItemSize: "",
  ItemColour: "",
  DiscountRate: 0,
};

const InvoiceItemsSection = ({ formData, setFormData }) => {
  const [currentItem, setCurrentItem] = useState(defaultItem);

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => {
      const updatedItem = { ...prev, [name]: value };
      const qty = parseFloat(updatedItem.ItemQty || 0);
      const price = parseFloat(updatedItem.UnitPrice || 0);
      updatedItem.ItemAmount = (qty * price).toFixed(2);
      return updatedItem;
    });
  };

  const addItem = () => {
    if (
      currentItem.ItemCode &&
      currentItem.ItemQty > 0 &&
      currentItem.UnitPrice > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        RecordItems: [
          ...prev.RecordItems,
          { ...currentItem, ItemAmount: parseFloat(currentItem.ItemAmount) },
        ],
      }));
      setCurrentItem({
        ...defaultItem,
        SerialNo: formData.RecordItems.length + 2, // +2 for next serial
      });
    } else {
      alert(
        "Please fill in Item Code, Quantity, and Unit Price for the invoice item."
      );
    }
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      RecordItems: prev.RecordItems.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Invoice Items
      </h2>

      {/* Add Item Form */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end mb-6 border-b pb-6 border-gray-200 dark:border-gray-700">
        <div className="relative w-full">
          <label
            htmlFor="itemCode"
            className="absolute -top-2 left-3 px-1 text-xs bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            Item Code
          </label>
          <input
            type="text"
            name="ItemCode"
            id="itemCode"
            value={currentItem.ItemCode}
            onChange={handleItemChange}
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
          />
        </div>

        <div className="relative w-full">
          <label
            htmlFor="itemQty"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            Quantity
          </label>
          <input
            type="number"
            name="ItemQty"
            id="itemQty"
            value={currentItem.ItemQty}
            onChange={handleItemChange}
            min="1"
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
          />
        </div>

        <div className="relative w-full mt-4">
          <label
            htmlFor="unitPrice"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            Unit Price
          </label>
          <input
            type="number"
            name="UnitPrice"
            id="unitPrice"
            value={currentItem.UnitPrice}
            onChange={handleItemChange}
            min="0"
            step="0.01"
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
          />
        </div>

        <div className="relative w-full mt-4">
          <label
            htmlFor="altSellingPrice"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            Alt Selling Price
          </label>
          <input
            type="number"
            name="AltSellingPrice"
            id="altSellingPrice"
            value={currentItem.AltSellingPrice}
            onChange={handleItemChange}
            min="0"
            step="0.01"
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
          />
        </div>

        <div className="relative w-full mt-4">
          <label
            htmlFor="discountRate"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          >
            Discount Rate (%)
          </label>
          <input
            type="number"
            name="DiscountRate"
            id="discountRate"
            value={currentItem.DiscountRate}
            onChange={handleItemChange}
            min="0"
            max="100"
            step="0.01"
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
          />
        </div>

        <div className="relative w-full mt-4">
          <label className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            Total Amount
          </label>
          <p className="text-sm font-semibold border border-gray-300 dark:border-gray-600 h-10 pl-3 pt-1.5 rounded-md text-gray-900 dark:text-white bg-white dark:bg-gray-800">
            {parseFloat(currentItem.ItemAmount).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Additional Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Item Type */}
        <div className="relative">
          <label
            htmlFor="itemType"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Item Type
          </label>
          <select
            name="ItemType"
            id="itemType"
            value={currentItem.ItemType}
            onChange={handleItemChange}
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm py-2 pt-4 px-3 appearance-none pr-8"
          >
            <option value="">Select Type</option>
            <option value="Gadget">Gadget</option>
            <option value="Electronics">Electronics</option>
            <option value="Apparel">Apparel</option>
            <option value="Food & Beverages">Food & Beverages</option>
            <option value="Books">Books</option>
            <option value="Home Goods">Home Goods</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Item Size */}
        <div className="relative">
          <label
            htmlFor="itemSize"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Item Size
          </label>
          <input
            type="text"
            name="ItemSize"
            id="itemSize"
            value={currentItem.ItemSize}
            onChange={handleItemChange}
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm py-2 pt-4 px-3"
          />
        </div>

        {/* Item Colour */}
        <div className="relative">
          <label
            htmlFor="itemColour"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Item Colour
          </label>
          <select
            name="ItemColour"
            id="itemColour"
            value={currentItem.ItemColour}
            onChange={handleItemChange}
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm py-2 pt-4 px-3 appearance-none pr-8"
          >
            <option value="">Select Colour</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Gray">Gray</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Bulk Ret Factor */}
        <div className="relative">
          <label
            htmlFor="bulkRetFactor"
            className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
          >
            Bulk Ret Factor
          </label>
          <input
            type="number"
            name="BulkRetFactor"
            id="bulkRetFactor"
            value={currentItem.BulkRetFactor}
            onChange={handleItemChange}
            min="1"
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm py-2 pt-4 px-3"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={addItem}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium"
        >
          Add Item
        </button>
      </div>

      {/* Items List */}
      {formData.RecordItems.length > 0 && (
        <div className="mt-8 space-y-4">
          {formData.RecordItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-blue-50 dark:bg-gray-700 rounded p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end"
            >
              {/* Item Code */}
              <div className="relative flex flex-col w-full">
                <label
                  htmlFor={`item-code-${idx}`}
                  className="absolute -top-2 left-3 px-1 text-xs bg-blue-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                >
                  Item Code
                </label>
                <input
                  id={`item-code-${idx}`}
                  type="text"
                  className="block w-full rounded-md border border-gray-300 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3"
                  value={item.ItemCode}
                  onChange={(e) => {
                    const newItems = [...formData.RecordItems];
                    newItems[idx].ItemCode = e.target.value;
                    setFormData((f) => ({ ...f, RecordItems: newItems }));
                  }}
                />
              </div>
              {/* Quantity */}
              <div className="relative flex flex-col w-full">
                <label
                  htmlFor={`item-qty-${idx}`}
                  className="absolute -top-2 left-3 px-1 text-xs bg-blue-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                >
                  Qty
                </label>
                <input
                  id={`item-qty-${idx}`}
                  type="number"
                  min="1"
                  className="block w-full rounded-md border border-gray-300 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-left"
                  value={item.ItemQty}
                  onChange={(e) => {
                    const newItems = [...formData.RecordItems];
                    newItems[idx].ItemQty = e.target.value;
                    setFormData((f) => ({ ...f, RecordItems: newItems }));
                  }}
                />
              </div>
              {/* Bulk Ret */}
              <div className="relative flex flex-col w-full">
                <label
                  htmlFor={`item-bulkret-${idx}`}
                  className="absolute -top-2 left-3 px-1 text-xs bg-blue-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                >
                  Bulk Ret
                </label>
                <input
                  id={`item-bulkret-${idx}`}
                  type="number"
                  min="1"
                  className="block w-full rounded-md border border-gray-300 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-right"
                  value={item.BulkRetFactor}
                  onChange={(e) => {
                    const newItems = [...formData.RecordItems];
                    newItems[idx].BulkRetFactor = e.target.value;
                    setFormData((f) => ({ ...f, RecordItems: newItems }));
                  }}
                />
              </div>
              {/* Total (read-only) */}
              <div className="flex flex-col w-24">
                <label className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10">
                  Total
                </label>
                <div className="block w-full rounded-md border border-gray-200 bg-gray-100 dark:bg-gray-800 px-2 py-2 text-xs md:text-sm text-right font-semibold pt-4">
                  {parseFloat(item.ItemAmount || 0).toFixed(2)}
                </div>
              </div>
              {/* Remove button */}
              <div className="flex flex-col w-16 items-end justify-end">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
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

export default InvoiceItemsSection;
