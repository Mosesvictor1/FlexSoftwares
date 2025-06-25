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
import CustomerSelectModal from "../ui/CustomerSelectModal";
import GeneralDetailsSection from "./GeneralDetailsSection";
import InvoiceItemsSection from "./InvoiceItemsSection";
import PaymentDetailsSection from "./PaymentDetailsSection";
import EmptiesItemsSection from "./EmptiesItemsSection";
import TotalSummarySection from "./TotalSummarySection";
import TenderChangeSection from "./TenderChangeSection";
import { useAuth } from "../../context/AuthContext";

const POSForm = ({
  config = {},
  onSubmit,
  breadcrumbs,
  title = "Create New Transaction",
  dropdownData = {},
}) => {
  const { currentAccountingYear } = useAuth();
  const [formData, setFormData] = useState({
    TransSource: config.transSource || "Sales",
    AcctYear: currentAccountingYear || new Date().getFullYear().toString(),
    Vno: dropdownData?.VoucherNumber || "",
    TransDate:
      dropdownData?.CurrentDate || new Date().toISOString().split("T")[0],
    ReturnReason: "",
    TotalAmountItems: 0,
    VATAmount: 0,
    DiscountAmount: 0,
    Commission: 0,
    CustomerType: dropdownData?.CustomerType || "Retail",
    BaseCurrencyCode: dropdownData?.DefaultCurrencyCode || "NGN",
    ExchangeRate: 1,
    ItemDesc: "",
    PaymentMode: dropdownData?.DefaultPaymentMode || "Cash",
    LocationCode: dropdownData?.DefaultLocation || "MAIN",
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
    CustomerCode: dropdownData?.CustomerCode || "",
  });

  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [manualCustomerName, setManualCustomerName] = useState("");

  // Recalculate TotalAmountItems whenever RecordItems changes
  useEffect(() => {
    const newTotalAmount = formData.RecordItems.reduce(
      (sum, item) => sum + parseFloat(item.ItemAmount || 0),
      0
    );
    setFormData((prev) => ({ ...prev, TotalAmountItems: newTotalAmount }));
  }, [formData.RecordItems]);

  // Calculate change based on Tender and Total Payable
  useEffect(() => {
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

  // Update customer info when selected
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

  // Update customer info for manual entry
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

  // Sync AcctYear with context when it changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      AcctYear: currentAccountingYear || new Date().getFullYear().toString(),
    }));
  }, [currentAccountingYear]);

  // Update formData defaults if dropdownData changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      Vno: dropdownData?.VoucherNumber || prev.Vno,
      TransDate: dropdownData?.CurrentDate || prev.TransDate,
      CustomerType: dropdownData?.CustomerType || prev.CustomerType,
      BaseCurrencyCode:
        dropdownData?.DefaultCurrencyCode || prev.BaseCurrencyCode,
      PaymentMode: dropdownData?.DefaultPaymentMode || prev.PaymentMode,
      LocationCode: dropdownData?.DefaultLocation || prev.LocationCode,
      CustomerCode: dropdownData?.CustomerCode || prev.CustomerCode,
    }));
  }, [dropdownData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    return parseFloat(total);
  };

  // Helper function to check if section should be shown
  const shouldShowSection = (sectionName) => {
    if (!config.sections) return true; // Show all if no config
    return config.sections.includes(sectionName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Form Data:", formData);
      alert("Form submitted! Check console for details.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && " > "}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <h1 className="text-2xl font-semibold mb-6">{config.title || title}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Customer and Payment Details Sections Side by Side */}
        {shouldShowSection("customer") && shouldShowSection("payment") ? (
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-1">
              {/* Customer Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg w-full shadow p-4 relative h-60">
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <div className="text-gray-500 font-bold mb-1 text-xs md:text-lg mt-6">
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
            </div>
            <div className="flex-1">
              {/* Payment Details Section */}
              <PaymentDetailsSection
                formData={formData}
                handleFormChange={handleFormChange}
                config={config}
                dropdownData={dropdownData}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Customer Section (if only customer is shown) */}
            {shouldShowSection("customer") && (
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
            )}
            {/* Payment Details Section (if only payment is shown) */}
            {shouldShowSection("payment") && (
              <PaymentDetailsSection
                formData={formData}
                handleFormChange={handleFormChange}
                config={config}
                dropdownData={dropdownData}
              />
            )}
          </>
        )}

        <CustomerSelectModal
          isOpen={customerModalOpen}
          onClose={() => setCustomerModalOpen(false)}
          onSelectCustomer={setSelectedCustomer}
        />

        {/* General Details Section */}
        {shouldShowSection("general") && (
          <GeneralDetailsSection
            formData={formData}
            handleFormChange={handleFormChange}
            config={config}
            dropdownData={dropdownData}
          />
        )}

        {/* Return Reason Section (conditional) */}
        {shouldShowSection("returnReason") && (
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

        {/* Invoice Items Section */}
        {shouldShowSection("items") && (
          <InvoiceItemsSection
            formData={formData}
            setFormData={setFormData}
            config={config}
          />
        )}

        {/* Empties Items Section */}
        {shouldShowSection("empties") && (
          <EmptiesItemsSection
            formData={formData}
            setFormData={setFormData}
            config={config}
          />
        )}

        {/* Total Summary Section */}
        {shouldShowSection("totals") && (
          <TotalSummarySection
            formData={formData}
            handleFormChange={handleFormChange}
            calculateTotalPayable={calculateTotalPayable}
            config={config}
          />
        )}

        {/* Tender and Change Section */}
        {shouldShowSection("tender") && (
          <TenderChangeSection
            formData={formData}
            handleFormChange={handleFormChange}
            config={config}
          />
        )}

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
            {config.submitButtonText || "Save Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default POSForm;
