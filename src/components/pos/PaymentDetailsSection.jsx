import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, X, Plus } from "lucide-react";

const STATIC_PAYMENT_MODE = [
  "Cash",
  "Card",
  "Transfer",
  "POS",
  "Cheque",
  "Bank",
  "USSD",
  "Mobile Money",
  "Others",
];

const PaymentDetailsSection = ({
  formData,
  handleFormChange,
  config = {},
  dropdownData = {},
  totalPayable,
}) => {
  // Use payment modes from dropdownData if available, else fallback to static list
  const paymentModes = useMemo(() => {
    return dropdownData?.PaymentModes?.length
      ? dropdownData.PaymentModes.filter((m) => m.EntryCode && m.Description)
      : [];
  }, [dropdownData?.PaymentModes]);

  // Use Total Payable from parent if provided; fallback to totals
  const totalAmount =
    typeof totalPayable === "number"
      ? totalPayable
      : formData.TotalAmountItems ||
        formData.TotalAmount ||
        config.totalAmount ||
        0;

  // Parse PaymentModeSplitStr if present, else default to one split
  const parseSplits = (splitStr) => {
    if (!splitStr)
      return [
        { mode: paymentModes[0]?.EntryCode || "Cash", amount: totalAmount },
      ];
    return splitStr.split("|").map((part) => {
      const [mode, amount] = part.split("=");
      return { mode, amount: Number(amount) };
    });
  };

  const [splits, setSplits] = useState(() =>
    parseSplits(formData.PaymentModeSplitStr)
  );

  // Reset splits to default if totalAmount changes and no split string is set
  useEffect(() => {
    if (!formData.PaymentModeSplitStr) {
      setSplits([
        { mode: paymentModes[0]?.EntryCode || "Cash", amount: totalAmount },
      ]);
    }
  }, [totalAmount, paymentModes, formData.PaymentModeSplitStr]);

  // Keep splits in sync when totalAmount changes: if sum > total, reduce first; if sum < total, top up first
  useEffect(() => {
    if (!splits || splits.length === 0) return;
    const EPSILON = 0.005;
    const totalSplitNow = splits.reduce((sum, s) => sum + Number(s.amount), 0);
    if (Math.abs(totalSplitNow - totalAmount) <= EPSILON) return;

    if (totalSplitNow > totalAmount) {
      // Reduce the first split to fit the new total
      const excess = totalSplitNow - totalAmount;
      const firstAmount = Math.max(0, Number(splits[0]?.amount || 0) - excess);
      if (Math.abs(firstAmount - (splits[0]?.amount || 0)) > EPSILON)
        setSplits([{ ...splits[0], amount: firstAmount }, ...splits.slice(1)]);
    } else {
      // Top up the first split to reach the total
      const deficit = totalAmount - totalSplitNow;
      const firstAmount = Number(splits[0]?.amount || 0) + deficit;
      setSplits([{ ...splits[0], amount: firstAmount }, ...splits.slice(1)]);
    }
  }, [totalAmount, splits]);

  // Update PaymentModeSplitStr in parent form whenever splits change
  useEffect(() => {
    const splitStr = splits.map((s) => `${s.mode}=${s.amount}`).join("|");
    handleFormChange({
      target: {
        name: "PaymentModeSplitStr",
        value: splitStr,
      },
    });
    // Optionally update PaymentMode to the first split's mode
    handleFormChange({
      target: {
        name: "PaymentMode",
        value: splits[0]?.mode || "",
      },
    });
  }, [splits, handleFormChange]);

  // Add a new split; allow adding even if total is fully allocated
  const addSplit = () => {
    setSplits([
      ...splits,
      {
        mode: paymentModes[0]?.EntryCode || "Cash",
        amount: 50, // Default to minimum amount
      },
    ]);
  };

  // Remove a split
  const removeSplit = (idx) => {
    setSplits(splits.filter((_, i) => i !== idx));
  };

  // Update a split
  const updateSplit = (idx, key, value) => {
    setSplits(
      splits.map((s, i) =>
        i === idx
          ? { ...s, [key]: key === "amount" ? Number(value) : value }
          : s
      )
    );
  };

  // Calculate total split
  const totalSplit = splits.reduce((sum, s) => sum + Number(s.amount), 0);
  
  // Check if any amount is less than 50
  const hasAmountLessThan50 = splits.some((split) => Number(split.amount) < 50);
  
  // Allow up to 5 splits regardless of total, to enable redistribution
  const canAddMore = splits.length < 5;
  
  // Button should be disabled if we can't add more OR if any amount is less than 50
  const isAddButtonDisabled = !canAddMore || hasAmountLessThan50;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Payment Details
      </h2>
      <div className="space-y-4">
        {splits.map((split, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="relative w-40">
              <select
                className="block w-full rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3 appearance-none pr-10"
                value={split.mode}
                onChange={(e) => updateSplit(idx, "mode", e.target.value)}
                disabled={false}
              >
                {paymentModes.map((mode) => (
                  <option
                    key={mode.EntryCode}
                    value={mode.EntryCode}
                    disabled={false}
                  >
                    {mode.Description}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <input
              type="number"
              min={50}
              className={`w-32 rounded-md border ${
                Number(split.amount) < 50 
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600' 
                  : 'border-gray-300 bg-white dark:bg-gray-800'
              } text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3`}
              placeholder="50"
              value={split.amount ? split.amount : ""}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (val < 0) val = 0;
                updateSplit(idx, "amount", val);
              }}
            />
            <span className="text-gray-500 text-sm">NGN</span>
            {Number(split.amount) < 50 && (
              <span className="text-red-500 text-xs">Min: 50</span>
            )}

            {splits.length > 1 && (
              <button
                type="button"
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => removeSplit(idx)}
                aria-label="Remove split"
              >
                <X />
              </button>
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 mt-2">
          <button
            type="button"
            className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={addSplit}
            disabled={isAddButtonDisabled}
            title={
              !canAddMore 
                ? "Maximum 5 payment modes allowed" 
                : hasAmountLessThan50 
                  ? "All amounts must be at least 50 NGN" 
                  : ""
            }
          >
            <Plus className="h-4 w-4 mr-1" /> Add Payment Mode
          </button>
          <span className="text-sm text-gray-500">
            Total split:{" "}
            <span
              className={
                totalSplit === totalAmount ? "text-green-600" : "text-red-600"
              }
            >
              {totalSplit.toLocaleString()}
            </span>{" "}
            / {totalAmount.toLocaleString()} NGN
          </span>
        </div>
        {/* {hasAmountLessThan50 && (
          <div className="text-xs text-red-500 mt-2">
            ⚠️ All payment amounts must be at least 50 NGN to add more payment modes.
          </div>
        )} */}
        <div className="mt-2 text-xs text-gray-500">
          <strong>Split String:</strong>{" "}
          {splits.map((s) => `${s.mode}=${s.amount}`).join("|")}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;