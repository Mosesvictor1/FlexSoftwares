import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Printer,
  Calendar,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";

const CreateInvoice = () => {
  const [formData, setFormData] = useState({
    TransSource: "Sales",
    AcctYear: new Date().getFullYear().toString(),
    Vno: "",
    TransDate: new Date().toISOString().split("T")[0],
    ReturnReason: "",
    TotalAmountItems: 0,
    VATAmount: 0,
    DiscountAmount: 0,
    Commission: 0,
    CustomerType: "Retail",
    CustomerCode: "",
    BaseCurrencyCode: "NGN",
    ExchangeRate: 1,
    ItemDesc: "",
    PaymentMode: "Cash",
    LocationCode: "MAIN",
    CreatedBy: "admin",
    DateTimeString: new Date().toISOString(),
    ExtraChargeAmount: 0,
    PaymentModeSplitStr: "",
    SalesOrder: "",
    CustomerEmail: "",
    CustomerPhone: "",
    Tender: 0,
    Change: 0,
    TableCode: "",
    RecordItems: [],
    EmptiesItems: [],
    Status: "Draft",
    DueDate: "",
  });

  const [currentItem, setCurrentItem] = useState({
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
  });

  const [currentEmptyItem, setCurrentEmptyItem] = useState({
    SerialNo: 1,
    ItemCode: "",
    ItemQty: 1,
    BulkRetFactor: 1,
  });

  useEffect(() => {
    // Recalculate TotalAmountItems whenever RecordItems changes
    const newTotalAmount = formData.RecordItems.reduce(
      (sum, item) => sum + parseFloat(item.ItemAmount || 0),
      0
    );
    setFormData((prev) => ({ ...prev, TotalAmountItems: newTotalAmount }));
  }, [formData.RecordItems]);

  useEffect(() => {
    // Calculate change based on Tender and Total Payable
    const totalPayable = calculateTotalPayable();
    setFormData((prev) => ({
      ...prev,
      Change: Math.max(0, parseFloat(prev.Tender || 0) - totalPayable),
    }));
  }, [
    formData.Tender,
    formData.TotalAmountItems,
    formData.VATAmount,
    formData.DiscountAmount,
    formData.Commission,
    formData.ExtraChargeAmount,
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
        SerialNo: formData.RecordItems.length + 1,
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
        SerialNo: formData.EmptiesItems.length + 1,
        ItemCode: "",
        ItemQty: 1,
        BulkRetFactor: 1,
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

  const calculateTotalPayable = () => {
    const total = (
      parseFloat(formData.TotalAmountItems || 0) +
      parseFloat(formData.VATAmount || 0) -
      parseFloat(formData.DiscountAmount || 0) +
      parseFloat(formData.Commission || 0) +
      parseFloat(formData.ExtraChargeAmount || 0)
    ).toFixed(2);
    return parseFloat(total); // Return as number for further calculations
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Invoice Data:", formData);
    alert("Invoice data submitted! Check console for details.");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>{" "}
        &gt;
        <Link to="/dashboard/pos/invoice/list" className="hover:underline">
          Invoice
        </Link>{" "}
        &gt;
        <span className="font-semibold">Create Invoice</span>
      </div>

      <h1 className="text-2xl font-semibold mb-6">Create New Invoice</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Invoice Details */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            General Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label
                htmlFor="TransSource"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Transaction Source
              </label>
              <div className="relative">
                <select
                  name="TransSource"
                  id="TransSource"
                  value={formData.TransSource}
                  onChange={handleFormChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4 appearance-none pr-8"
                >
                  <option value="Sales">Sales</option>
                  <option value="Return">Return</option>
                </select>

                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="TransDate"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Transaction Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="TransDate"
                  id="TransDate"
                  value={formData.TransDate}
                  onChange={handleFormChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="AcctYear"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Account Year
              </label>
              <input
                type="text"
                name="AcctYear"
                id="AcctYear"
                value={formData.AcctYear}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>

            <div>
              <label
                htmlFor="Vno"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Voucher Number
              </label>
              <input
                type="text"
                name="Vno"
                id="Vno"
                value={formData.Vno}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>

            <div>
              <label
                htmlFor="SalesOrder"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Sales Order
              </label>
              <input
                type="text"
                name="SalesOrder"
                id="SalesOrder"
                value={formData.SalesOrder}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>

            <div>
              <label
                htmlFor="CustomerType"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Customer Type
              </label>
              <div className="relative">
                <select
                  name="CustomerType"
                  id="CustomerType"
                  value={formData.CustomerType}
                  onChange={handleFormChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4 appearance-none pr-8"
                >
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">Wholesale</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="LocationCode"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Location Code
              </label>
              <div className="relative">
                <select
                  name="LocationCode"
                  id="LocationCode"
                  value={formData.LocationCode}
                  onChange={handleFormChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4 appearance-none pr-8"
                >
                  <option value="MAIN">MAIN STORE</option>
                  <option value="WAREHOUSE">WAREHOUSE</option>
                  <option value="BRANCH">BRANCH OFFICE</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label
                htmlFor="CustomerCode"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Customer Code
              </label>
              <input
                type="text"
                name="CustomerCode"
                id="CustomerCode"
                value={formData.CustomerCode}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="CustomerEmail"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Customer Email
              </label>
              <input
                type="email"
                name="CustomerEmail"
                id="CustomerEmail"
                value={formData.CustomerEmail}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="CustomerPhone"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Customer Phone
              </label>
              <input
                type="tel"
                name="CustomerPhone"
                id="CustomerPhone"
                value={formData.CustomerPhone}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
          </div>
        </div>

        {/* Invoice Items Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Invoice Items
          </h2>

          {/* Add Item Form */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 items-end mb-6 border-b pb-6 border-gray-200 dark:border-gray-700">
            <div>
              <label
                htmlFor="itemCode"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Item Code
              </label>
              <input
                type="text"
                name="ItemCode"
                id="itemCode"
                value={currentItem.ItemCode}
                onChange={handleItemChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="itemQty"
                className="block text-base  font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="unitPrice"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="altSellingPrice"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="discountRate"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                Total Amount
              </label>
              <p className="text-xl font-semibold  border-2 h-12 pl-2 pt-2 rounded-lg text-gray-900 dark:text-white">
                {parseFloat(currentItem.ItemAmount).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Additional Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label
                htmlFor="itemType"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Item Type
              </label>
              <div className="relative">
                <select
                  name="ItemType"
                  id="itemType"
                  value={currentItem.ItemType}
                  onChange={handleItemChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4 appearance-none pr-8"
                >
                  <option value="">Select Type</option>
                  <option value="Gadget">Gadget</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                  <option value="Books">Books</option>
                  <option value="Home Goods">Home Goods</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="itemSize"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Item Size
              </label>
              <input
                type="text"
                name="ItemSize"
                id="itemSize"
                value={currentItem.ItemSize}
                onChange={handleItemChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="itemColour"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Item Colour
              </label>
              <div className="relative">
                <select
                  name="ItemColour"
                  id="itemColour"
                  value={currentItem.ItemColour}
                  onChange={handleItemChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4 appearance-none pr-8"
                >
                  <option value="">Select Colour</option>
                  <option value="Red">Red</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Gray">Gray</option>
                  {/* Add more color options here as needed */}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="bulkRetFactor"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
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

          {/* Invoice Items Table */}
          <div className="overflow-x-auto mt-8">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-200 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-base font-medium text-gray-700 dark:text-gray-300">
                    Item Code
                  </th>
                  <th className="py-3 px-4 text-left text-base font-medium text-gray-700 dark:text-gray-300">
                    Item Type
                  </th>
                  <th className="py-3 px-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">
                    Qty
                  </th>
                  <th className="py-3 px-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">
                    Unit Price
                  </th>
                  <th className="py-3 px-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">
                    Alt Selling Price
                  </th>
                  <th className="py-3 px-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">
                    Discount Rate
                  </th>
                  <th className="py-3 px-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">
                    Bulk Ret Factor
                  </th>
                  <th className="py-3 px-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">
                    Total Amount
                  </th>
                  <th className="py-3 px-4 text-right text-base font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.RecordItems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 text-left">{item.ItemCode}</td>
                    <td className="py-3 px-4 text-left">{item.ItemType}</td>
                    <td className="py-3 px-4 text-right">{item.ItemQty}</td>
                    <td className="py-3 px-4 text-right">
                      {parseFloat(item.UnitPrice).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {parseFloat(item.AltSellingPrice).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {parseFloat(item.DiscountRate).toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      {parseFloat(item.BulkRetFactor).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(item.ItemQty * item.UnitPrice).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Currency and Exchange Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <label
                htmlFor="BaseCurrencyCode"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Base Currency
              </label>
              <div className="relative">
                <select
                  name="BaseCurrencyCode"
                  id="BaseCurrencyCode"
                  value={formData.BaseCurrencyCode}
                  onChange={handleFormChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4 appearance-none pr-8"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="ExchangeRate"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Exchange Rate
              </label>
              <input
                type="number"
                name="ExchangeRate"
                id="ExchangeRate"
                value={formData.ExchangeRate}
                onChange={handleFormChange}
                min="0"
                step="0.0001"
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Payment Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="PaymentMode"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Payment Mode
              </label>
              <div className="relative">
                <select
                  name="PaymentMode"
                  id="PaymentMode"
                  value={formData.PaymentMode}
                  onChange={handleFormChange}
                  className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4 appearance-none pr-8"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Transfer">Transfer</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label
                htmlFor="PaymentModeSplitStr"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
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
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
          </div>
        </div>

        {/* Return Reason (if applicable) */}
        {formData.TransSource === "Return" && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Return Details
            </h2>
            <div>
              <label
                htmlFor="ReturnReason"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Return Reason
              </label>
              <textarea
                name="ReturnReason"
                id="ReturnReason"
                value={formData.ReturnReason}
                onChange={handleFormChange}
                rows="3"
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              ></textarea>
            </div>
          </div>
        )}

        {/* Empties Items Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Empties Items
          </h2>

          {/* Add Empty Item Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end mb-4 border-b pb-4 border-gray-200 dark:border-gray-700">
            <div>
              <label
                htmlFor="emptyItemCode"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Item Code
              </label>
              <input
                type="text"
                name="ItemCode"
                id="emptyItemCode"
                value={currentEmptyItem.ItemCode}
                onChange={handleEmptyItemChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="emptyItemQty"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Quantity
              </label>
              <input
                type="number"
                name="ItemQty"
                id="emptyItemQty"
                value={currentEmptyItem.ItemQty}
                onChange={handleEmptyItemChange}
                min="1"
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="emptyBulkRetFactor"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Bulk Ret Factor
              </label>
              <input
                type="number"
                name="BulkRetFactor"
                id="emptyBulkRetFactor"
                value={currentEmptyItem.BulkRetFactor}
                onChange={handleEmptyItemChange}
                min="1"
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={addEmptyItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Empty
              </button>
            </div>
          </div>

          {/* Empties Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Serial No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Item Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Bulk Ret Factor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {formData.EmptiesItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.SerialNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.ItemCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.ItemQty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {item.BulkRetFactor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <button
                        type="button"
                        onClick={() => removeEmptyItem(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Details / Totals Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Financial Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="VATAmount"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                VAT Amount
              </label>
              <input
                type="number"
                name="VATAmount"
                id="VATAmount"
                value={formData.VATAmount}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>

            <div>
              <label
                htmlFor="Tender"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tender Amount
              </label>
              <input
                type="number"
                name="Tender"
                id="Tender"
                value={formData.Tender}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>

            <div>
              <label
                htmlFor="DiscountAmount"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Discount Amount
              </label>
              <input
                type="number"
                name="DiscountAmount"
                id="DiscountAmount"
                value={formData.DiscountAmount}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>

            <div>
              <label
                htmlFor="Commission"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Commission
              </label>
              <input
                type="number"
                name="Commission"
                id="Commission"
                value={formData.Commission}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>

            <div>
              <label
                htmlFor="ExtraChargeAmount"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Extra Charge Amount
              </label>
              <input
                type="number"
                name="ExtraChargeAmount"
                id="ExtraChargeAmount"
                value={formData.ExtraChargeAmount}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
          </div>
        </div>

        {/* Other Details */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label
                htmlFor="ItemDesc"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Item Description
              </label>
              <input
                type="text"
                name="ItemDesc"
                id="ItemDesc"
                value={formData.ItemDesc}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="TableCode"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Table Code
              </label>
              <input
                type="text"
                name="TableCode"
                id="TableCode"
                value={formData.TableCode}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
          </div>
        </div>
        

        {/* Total Summary */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Total Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Sub Total:
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {parseFloat(formData.TotalAmountItems).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <label
                htmlFor="VATAmount"
                className="text-lg font-medium text-gray-700 dark:text-gray-300"
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
                className="w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="DiscountAmount"
                className="text-lg font-medium text-gray-700 dark:text-gray-300"
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
                className="w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="Commission"
                className="text-lg font-medium text-gray-700 dark:text-gray-300"
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
                className="w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
              />
            </div>
            <div className="flex justify-between items-center">
              <label
                htmlFor="ExtraChargeAmount"
                className="text-lg font-medium text-gray-700 dark:text-gray-300"
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
                className="w-40 rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-lg py-2 px-3 text-right"
              />
            </div>
            <div className="flex justify-between items-center border-t pt-4 border-gray-200 dark:border-gray-700">
              <span className="text-xl font-semibold text-gray-900 dark:text-white">
                Total Payable:
              </span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {calculateTotalPayable().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Tender and Change */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Tender and Change
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label
                htmlFor="Tender"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Tender Amount
              </label>
              <input
                type="number"
                name="Tender"
                id="Tender"
                value={formData.Tender}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
            <div>
              <label
                htmlFor="Change"
                className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Change
              </label>
              <input
                type="number"
                name="Change"
                id="Change"
                value={formData.Change}
                onChange={handleFormChange}
                className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-base py-3 px-4"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-base font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base font-medium"
          >
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
