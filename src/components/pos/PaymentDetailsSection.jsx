import React, { useState, useEffect } from "react";
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
}) => {
  // Use payment modes from dropdownData if available, else fallback to static list
  const paymentModes = dropdownData?.PaymentModes?.length
    ? dropdownData.PaymentModes.filter((m) => m.EntryCode && m.Description)
    : []

  // Use TotalAmountItems as the main total for payment splits
  const totalAmount =
    formData.TotalAmountItems ||
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
    // eslint-disable-next-line
  }, [totalAmount, paymentModes]);

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
    // eslint-disable-next-line
  }, [splits]);

  // Add a new split with remaining amount
  const addSplit = () => {
    const used = splits.reduce((sum, s) => sum + Number(s.amount), 0);
    const remaining = totalAmount - used;
    setSplits([
      ...splits,
      {
        mode:
          paymentModes.find((m) => !splits.some((s) => s.mode === m.EntryCode))
            ?.EntryCode ||
          paymentModes[0]?.EntryCode ||
          "Others",
        amount: remaining > 0 ? remaining : 0,
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
  const canAddMore =
    totalSplit < totalAmount && splits.length < paymentModes.length;

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
                disabled={
                  splits.length > 1 && paymentModes.length === splits.length
                }
              >
                {paymentModes.map((mode) => (
                  <option
                    key={mode.EntryCode}
                    value={mode.EntryCode}
                    disabled={splits.some(
                      (s, i) => s.mode === mode.EntryCode && i !== idx
                    )}
                  >
                    {mode.Description}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            <input
              type="number"
              min={0}
              max={totalAmount - (totalSplit - split.amount)}
              className="w-32 rounded-md border border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2 px-3"
              value={split.amount}
              onChange={(e) => {
                let val = Number(e.target.value);
                if (val < 0) val = 0;
                if (val > totalAmount - (totalSplit - split.amount))
                  val = totalAmount - (totalSplit - split.amount);
                updateSplit(idx, "amount", val);
              }}
            />
            <span className="text-gray-500 text-sm">NGN</span>
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
            className="flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
            onClick={addSplit}
            disabled={!canAddMore}
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
        <div className="mt-2 text-xs text-gray-500">
          <strong>Split String:</strong>{" "}
          {splits.map((s) => `${s.mode}=${s.amount}`).join("|")}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsSection;
