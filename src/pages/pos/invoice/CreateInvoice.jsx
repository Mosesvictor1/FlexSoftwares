import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  Printer,
  Calendar,
  ChevronDown,
  Pencil,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import CustomerSelectModal from "../../../components/ui/CustomerSelectModal";

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

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [manualCustomerName, setManualCustomerName] = useState("");

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

  useEffect(() => {
    if (selectedCustomer) {
      setFormData((prev) => ({
        ...prev,
        CustomerName: selectedCustomer.name,
        CustomerCompany: selectedCustomer.company,
        CustomerAddress: selectedCustomer.address,
        CustomerPhone: selectedCustomer.phone,
      }));
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (!selectedCustomer) {
      setFormData((prev) => ({
        ...prev,
        CustomerName: manualCustomerName,
        CustomerCompany: "",
        CustomerAddress: "",
        CustomerPhone: "",
        CustomerEmail: "",
        CustomerType: "Regular",
      }));
    }
  }, [manualCustomerName, selectedCustomer]);

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
        {/* Customer Card or Manual Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md md:w-1/2 shadow p-4 mb-6 relative">
          <div className="flex justify-between items-start">
            <div className="w-full">
              <div className="text-gray-500 font-semibold mb-1 text-xs md:text-sm">
                Customer:
              </div>
              {selectedCustomer ? (
                <>
                  <div className="font-bold text-sm md:text-base break-words">
                    {selectedCustomer.name}
                  </div>
                  <div className="text-xs md:text-sm text-green-600 font-medium break-words">
                    {selectedCustomer.company}
                  </div>
                  <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 break-words">
                    {selectedCustomer.address}
                  </div>
                  <div className="text-xs md:text-sm text-gray-700 dark:text-gray-300 break-words">
                    {selectedCustomer.phone}
                  </div>
                </>
              ) : (
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring focus:border-blue-400"
                  placeholder="Enter customer name (walk-in)"
                  value={manualCustomerName}
                  onChange={(e) => setManualCustomerName(e.target.value)}
                />
              )}
            </div>
            <div className="flex flex-col items-end gap-2 ml-2">
              {selectedCustomer && (
                <button
                  className="text-gray-400 hover:text-red-500 p-1"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCustomer(null);
                  }}
                  aria-label="Clear Customer"
                  type="button"
                >
                  <X />
                </button>
              )}
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
                onClick={(e) => {
                  e.preventDefault();
                  setCustomerModalOpen(true);
                }}
                aria-label="Select Customer"
                type="button"
              >
                <Pencil />
              </button>
            </div>
          </div>
        </div>
        <CustomerSelectModal
          isOpen={customerModalOpen}
          onClose={() => setCustomerModalOpen(false)}
          onSelectCustomer={setSelectedCustomer}
        />

        {/* General Invoice Details */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            General Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Transaction Source */}
            <div className="relative">
              <label
                htmlFor="TransSource"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                Transaction Source
              </label>
              <select
                name="TransSource"
                id="TransSource"
                value={formData.TransSource}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3 appearance-none pr-8"
              >
                <option value="Sales">Sales</option>
                <option value="Return">Return</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
            <div className="relative">
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
            </div>

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

            {/* Sales Order */}
            <div className="relative">
              <label
                htmlFor="SalesOrder"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                Sales Order
              </label>
              <input
                type="text"
                name="SalesOrder"
                id="SalesOrder"
                value={formData.SalesOrder}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
              />
            </div>

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
                value={formData.LocationCode}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3 appearance-none pr-8"
              >
                <option value="MAIN">MAIN STORE</option>
                <option value="WAREHOUSE">WAREHOUSE</option>
                <option value="BRANCH">BRANCH OFFICE</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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

          {/* Editable Invoice Items Rows */}
          {formData.RecordItems.length > 0 && (
            <div className="mt-8 space-y-4">
              {formData.RecordItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-700 rounded p-4 flex flex-wrap gap-4 items-end"
                >
                  {/* Item Code */}
                  <div className="relative flex flex-col w-32">
                    <label
                      htmlFor={`item-code-${idx}`}
                      className="absolute -top-2 left-3 px-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                    >
                      Item Code
                    </label>
                    <input
                      id={`item-code-${idx}`}
                      type="text"
                      className="block w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3"
                      value={item.ItemCode}
                      onChange={(e) => {
                        const newItems = [...formData.RecordItems];
                        newItems[idx].ItemCode = e.target.value;
                        setFormData((f) => ({ ...f, RecordItems: newItems }));
                      }}
                    />
                  </div>
                  {/* Item Type */}
                  <div className="relative flex flex-col w-32">
                    <label
                      htmlFor={`item-type-${idx}`}
                      className="absolute -top-2 left-3 px-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                    >
                      Item Type
                    </label>
                    <input
                      id={`item-type-${idx}`}
                      type="text"
                      className="block w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3"
                      value={item.ItemType}
                      onChange={(e) => {
                        const newItems = [...formData.RecordItems];
                        newItems[idx].ItemType = e.target.value;
                        setFormData((f) => ({ ...f, RecordItems: newItems }));
                      }}
                    />
                  </div>
                  {/* Qty */}
                  <div className="relative flex flex-col w-20">
                    <label
                      htmlFor={`item-qty-${idx}`}
                      className="absolute -top-2 left-3 px-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                    >
                      Qty
                    </label>
                    <input
                      id={`item-qty-${idx}`}
                      type="number"
                      min="1"
                      className="block w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-right"
                      value={item.ItemQty}
                      onChange={(e) => {
                        const newItems = [...formData.RecordItems];
                        newItems[idx].ItemQty = e.target.value;
                        newItems[idx].ItemAmount = (
                          parseFloat(e.target.value || 0) *
                          parseFloat(newItems[idx].UnitPrice || 0)
                        ).toFixed(2);
                        setFormData((f) => ({ ...f, RecordItems: newItems }));
                      }}
                    />
                  </div>
                  {/* Unit Price */}
                  <div className="relative flex flex-col w-24">
                    <label
                      htmlFor={`item-unitprice-${idx}`}
                      className="absolute -top-2 left-3 px-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                    >
                      Unit Price
                    </label>
                    <input
                      id={`item-unitprice-${idx}`}
                      type="number"
                      min="0"
                      step="0.01"
                      className="block w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-right"
                      value={item.UnitPrice}
                      onChange={(e) => {
                        const newItems = [...formData.RecordItems];
                        newItems[idx].UnitPrice = e.target.value;
                        newItems[idx].ItemAmount = (
                          parseFloat(newItems[idx].ItemQty || 0) *
                          parseFloat(e.target.value || 0)
                        ).toFixed(2);
                        setFormData((f) => ({ ...f, RecordItems: newItems }));
                      }}
                    />
                  </div>
                  {/* Alt Price */}
                  <div className="relative flex flex-col w-24">
                    <label
                      htmlFor={`item-altprice-${idx}`}
                      className="absolute -top-2 left-3 px-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                    >
                      Alt Price
                    </label>
                    <input
                      id={`item-altprice-${idx}`}
                      type="number"
                      min="0"
                      step="0.01"
                      className="block w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-right"
                      value={item.AltSellingPrice}
                      onChange={(e) => {
                        const newItems = [...formData.RecordItems];
                        newItems[idx].AltSellingPrice = e.target.value;
                        setFormData((f) => ({ ...f, RecordItems: newItems }));
                      }}
                    />
                  </div>
                  {/* Discount % */}
                  <div className="relative flex flex-col w-24">
                    <label
                      htmlFor={`item-discount-${idx}`}
                      className="absolute -top-2 left-3 px-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                    >
                      Discount %
                    </label>
                    <input
                      id={`item-discount-${idx}`}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="block w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-right"
                      value={item.DiscountRate}
                      onChange={(e) => {
                        const newItems = [...formData.RecordItems];
                        newItems[idx].DiscountRate = e.target.value;
                        setFormData((f) => ({ ...f, RecordItems: newItems }));
                      }}
                    />
                  </div>
                  {/* Bulk Ret */}
                  <div className="relative flex flex-col w-24">
                    <label
                      htmlFor={`item-bulkret-${idx}`}
                      className="absolute -top-2 left-3 px-1 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 z-10"
                    >
                      Bulk Ret
                    </label>
                    <input
                      id={`item-bulkret-${idx}`}
                      type="number"
                      min="1"
                      className="block w-full rounded-md border border-gray-300 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-right"
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

          {/* Currency and Exchange Rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Base Currency */}
            <div className="relative w-full">
              <label
                htmlFor="BaseCurrencyCode"
                className="absolute -top-2 left-3 px-1 text-xs bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                Base Currency
              </label>
              <select
                name="BaseCurrencyCode"
                id="BaseCurrencyCode"
                value={formData.BaseCurrencyCode}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4 appearance-none"
              >
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Exchange Rate */}
            <div className="relative w-full">
              <label
                htmlFor="ExchangeRate"
                className="absolute -top-2 left-3 px-1 text-xs bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300"
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
                disabled={formData.BaseCurrencyCode === "NGN"}
                className={`block w-full rounded-md border ${
                  formData.BaseCurrencyCode === "NGN"
                    ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800"
                } text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4`}
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

        {/* Return Reason (if applicable) */}
        {formData.TransSource === "Return" && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Return Details
            </h2>

            <div className="relative">
              <label
                htmlFor="ReturnReason"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                Return Reason
              </label>
              <textarea
                name="ReturnReason"
                id="ReturnReason"
                value={formData.ReturnReason}
                onChange={handleFormChange}
                rows="4"
                placeholder="Specify reason for return..."
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 pt-5 px-3"
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

                  {/* Bulk Ret Factor */}
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
                      className="block w-full rounded-md border border-gray-300 bg-blue-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs md:text-sm py-2 pt-4 px-3 text-left"
                      value={item.BulkRetFactor}
                      onChange={(e) => {
                        const newItems = [...formData.EmptiesItems];
                        newItems[idx].BulkRetFactor = e.target.value;
                        setFormData((f) => ({ ...f, EmptiesItems: newItems }));
                      }}
                    />
                  </div>

                  {/* Remove button */}
                  <div className="flex justify-start items-end pl-6 pb-4">
                    <button
                      type="button"
                      onClick={() => removeEmptyItem(idx)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 mt-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Financial Details / Totals Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Financial Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* VAT Amount */}
            <div className="relative">
              <label
                htmlFor="VATAmount"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                VAT Amount
              </label>
              <input
                type="number"
                name="VATAmount"
                id="VATAmount"
                value={formData.VATAmount}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
              />
            </div>

            {/* Tender Amount */}
            <div className="relative">
              <label
                htmlFor="Tender"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                Tender Amount
              </label>
              <input
                type="number"
                name="Tender"
                id="Tender"
                value={formData.Tender}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
              />
            </div>

            {/* Discount Amount */}
            <div className="relative">
              <label
                htmlFor="DiscountAmount"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                Discount Amount
              </label>
              <input
                type="number"
                name="DiscountAmount"
                id="DiscountAmount"
                value={formData.DiscountAmount}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
              />
            </div>

            {/* Commission */}
            <div className="relative">
              <label
                htmlFor="Commission"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                Commission
              </label>
              <input
                type="number"
                name="Commission"
                id="Commission"
                value={formData.Commission}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
              />
            </div>

            {/* Extra Charge Amount */}
            <div className="relative">
              <label
                htmlFor="ExtraChargeAmount"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 z-10"
              >
                Extra Charge Amount
              </label>
              <input
                type="number"
                name="ExtraChargeAmount"
                id="ExtraChargeAmount"
                value={formData.ExtraChargeAmount}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 pt-4 px-3"
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
            {/* Item Description */}
            <div className="relative w-full">
              <label
                htmlFor="ItemDesc"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                Item Description
              </label>
              <input
                type="text"
                name="ItemDesc"
                id="ItemDesc"
                value={formData.ItemDesc}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
              />
            </div>

            {/* Table Code */}
            <div className="relative w-full">
              <label
                htmlFor="TableCode"
                className="absolute -top-2 left-3 px-1 text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              >
                Table Code
              </label>
              <input
                type="text"
                name="TableCode"
                id="TableCode"
                value={formData.TableCode}
                onChange={handleFormChange}
                className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 pt-4"
              />
            </div>
          </div>
        </div>

        {/* Total Summary */}
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

        {/* Tender and Change */}
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
