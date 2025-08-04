import React, { useState, useMemo, useRef, useEffect } from "react";
import { Plus, Trash2, Edit2, Search, X, ChevronDown } from "lucide-react";
import { usePaginatedStockItems } from "../../hooks/usePaginatedStockItems";

// Mock data for categories and items
const mockCategories = [
  { code: "BEER", name: "Beer" },
  { code: "TABLE", name: "Table" },
  { code: "CHAIR", name: "Chair" },
  { code: "SOFTDRINK", name: "Soft Drink" },
];

const defaultModalState = {
  ItemCode: "",
  ItemName: "",
  UnitQuantities: {},
  UnitPrices: {},
};

// Add a constant for the 'All' value
const ALL_CATEGORIES = null;

const InvoiceItemsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(defaultModalState);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [editingItemCode, setEditingItemCode] = useState(null); // Track which item we're editing
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [dropdownHovered, setDropdownHovered] = useState(false);
  const [activeCategoryDropdown, setActiveCategoryDropdown] = useState(false);
  const categorySelectRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // Use the hook to fetch stock items
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePaginatedStockItems(searchTerm, "");

  // Transform API data to UI structure
  const stockItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) =>
      (page.items || page.data || []).map((item) => ({
        ItemCode: item.ItemCode,
        ItemName: item.StockDesc,
        Category: item.ItemType,
        Units: [item.UnitOfMeasure, item.AltUnitOfMeasure].filter(Boolean),
        SellingPrice: item.UnitPrice,
        AltSellingPrice: item.AltUnitPrice,
        AltUnit: item.AltUnitOfMeasure,
        // ...add other fields as needed
      }))
    );
  }, [data]);

  // Group invoiceItems by ItemCode for table display
  const groupedInvoiceItems = useMemo(() => {
    const map = new Map();
    invoiceItems.forEach((item) => {
      if (!map.has(item.ItemCode)) {
        map.set(item.ItemCode, { ...item, SN: 1 });
      } else {
        const existing = map.get(item.ItemCode);
        // Sum quantities and keep latest prices
        const newUnitQuantities = { ...existing.UnitQuantities };
        Object.keys(item.UnitQuantities).forEach((unit) => {
          newUnitQuantities[unit] =
            (newUnitQuantities[unit] || 0) + (item.UnitQuantities[unit] || 0);
        });
        map.set(item.ItemCode, {
          ...existing,
          SN: existing.SN + 1,
          UnitQuantities: newUnitQuantities,
          UnitPrices: { ...item.UnitPrices },
        });
      }
    });
    return Array.from(map.values());
  }, [invoiceItems]);

  // Compute all possible units from groupedInvoiceItems (only units used in the invoice)
  const allUnits = useMemo(() => {
    const set = new Set();
    groupedInvoiceItems.forEach((item) =>
      item.Units?.forEach((unit) => set.add(unit))
    );
    return Array.from(set);
  }, [groupedInvoiceItems]);

  // Update categoryFilteredItems to use mapped stockItems
  const categoryFilteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    return stockItems.filter((item) => item.Category === selectedCategory);
  }, [selectedCategory, stockItems]);

  // Update searchFilteredItems to use mapped stockItems
  const searchFilteredItems = useMemo(() => {
    let items = stockItems;
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      items = items.filter(
        (item) =>
          item.ItemName?.toLowerCase().includes(term) ||
          item.ItemCode?.toLowerCase().includes(term)
      );
    }
    return items;
  }, [searchTerm, stockItems]);

  // Click-away handler for category dropdown
  useEffect(() => {
    if (!activeCategoryDropdown) return;
    function handleClickOutside(event) {
      if (
        categorySelectRef.current &&
        !categorySelectRef.current.contains(event.target) &&
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setActiveCategoryDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeCategoryDropdown]);

  // Open modal with item details (add or edit)
  const handleItemClick = (item) => {
    const unitQuantities = {};
    const unitPrices = {};
    (item.Units || []).forEach((unit, idx) => {
      unitQuantities[unit] = 1;
      if (idx === 0) {
        unitPrices[unit] = item.SellingPrice;
      } else {
        unitPrices[unit] = item.AltSellingPrice || 0;
      }
    });
    setModalItem({
      ...item,
      UnitQuantities: unitQuantities,
      UnitPrices: unitPrices,
    });
    setEditingItemCode(null);
    setModalOpen(true);
  };

  // Handle modal input changes for unit quantities
  const handleUnitQtyChange = (unit, value) => {
    setModalItem((prev) => ({
      ...prev,
      UnitQuantities: { ...prev.UnitQuantities, [unit]: Number(value) },
    }));
  };

  // Handle modal input changes for unit prices (if editable)
  const handleUnitPriceChange = (unit, value) => {
    setModalItem((prev) => ({
      ...prev,
      UnitPrices: { ...prev.UnitPrices, [unit]: Number(value) },
    }));
  };

  // Handle add or update item
  const handleAddItem = (e) => {
    e.preventDefault();
    // At least one unit must have a quantity > 0
    const hasQty = Object.values(modalItem.UnitQuantities).some(
      (qty) => qty > 0
    );
    if (!modalItem.ItemCode || !hasQty) {
      alert("Please enter quantity for at least one unit.");
      return;
    }

    if (editingItemCode) {
      // Update mode: Remove all existing entries for this item and add the new one
      setInvoiceItems((prev) => [
        ...prev.filter((item) => item.ItemCode !== editingItemCode),
        {
          ...modalItem,
          UnitQuantities: { ...modalItem.UnitQuantities },
          UnitPrices: { ...modalItem.UnitPrices },
        },
      ]);
    } else {
      // Add mode: Just add the new item
      setInvoiceItems((prev) => [
        ...prev,
        {
          ...modalItem,
          UnitQuantities: { ...modalItem.UnitQuantities },
          UnitPrices: { ...modalItem.UnitPrices },
        },
      ]);
    }

    setModalOpen(false);
    setModalItem(defaultModalState);
    setEditingItemCode(null);
  };

  // Edit item in invoice list - now uses grouped item values
  const handleEdit = (idx) => {
    const groupedItem = groupedInvoiceItems[idx];
    setModalItem({ ...groupedItem });
    setEditingItemCode(groupedItem.ItemCode);
    setModalOpen(true);
  };

  // Delete item from invoice list - now removes all entries for this ItemCode
  const handleDelete = (idx) => {
    const groupedItem = groupedInvoiceItems[idx];
    setInvoiceItems((prev) => 
      prev.filter((item) => item.ItemCode !== groupedItem.ItemCode)
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Invoice Items
      </h2>

      {/* Search Input */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-4 relative">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search item by name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              setSearchFocused(true);
              setActiveCategoryDropdown(false);
            }}
            onBlur={() => setSearchFocused(false)}
            className="block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-9 py-2"
          />
          {/* Search Dropdown */}
          {(searchFocused || searchTerm.trim() || dropdownHovered) &&
            !activeCategoryDropdown && (
              <div
                className="absolute left-0 right-0 mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-72 overflow-y-auto"
                onMouseEnter={() => setDropdownHovered(true)}
                onMouseLeave={() => setDropdownHovered(false)}
              >
                {isLoading ? (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-300 text-center">
                    Loading items...
                  </div>
                ) : searchFilteredItems.length === 0 ? (
                  <div className="px-4 py-3 text-gray-500 dark:text-gray-300 text-center">
                    No items found.
                  </div>
                ) : (
                  <>
                    {searchFilteredItems.map((item) => (
                      <div
                        key={item.ItemCode}
                        className="flex flex-row items-center justify-between px-4 py-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                        onClick={() => {
                          setDropdownHovered(false);
                          handleItemClick(item);
                        }}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white text-base">
                          {item.ItemName}
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-xs text-gray-500">
                            {item.Units?.join(", ")}
                          </div>
                          <div className="text-xs text-gray-900 dark:text-white font-semibold">
                            ₦{item.SellingPrice?.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {hasNextPage && (
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-1 mb-1 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow-sm hover:bg-blue-100 dark:hover:bg-blue-800 border border-blue-200 dark:border-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                      >
                        {isFetchingNextPage && (
                          <svg
                            className="animate-spin h-4 w-4 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        )}
                        {isFetchingNextPage ? "Loading more..." : "Load more"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          {/* Category Dropdown */}
          {activeCategoryDropdown && !searchFocused && !searchTerm.trim() && (
            <div
              ref={categoryDropdownRef}
              className="absolute left-0 right-0 mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-72 overflow-y-auto"
              onMouseEnter={() => setDropdownHovered(true)}
              onMouseLeave={() => setDropdownHovered(false)}
            >
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-300 font-semibold">
                {mockCategories.find((c) => c.code === selectedCategory)?.name}{" "}
                Items
              </div>
              {categoryFilteredItems.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 dark:text-gray-300 text-center">
                  No items found.
                </div>
              ) : (
                categoryFilteredItems.map((item) => (
                  <div
                    key={item.ItemCode}
                    className="flex flex-row items-center justify-between px-4 py-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                    onClick={() => {
                      setDropdownHovered(false);
                      handleItemClick(item);
                    }}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white text-base">
                      {item.ItemName}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs text-gray-500">
                        {item.Units?.join(", ")}
                      </div>
                      <div className="text-xs text-gray-900 dark:text-white font-semibold">
                        ₦{item.SellingPrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="w-full md:w-auto flex-shrink-0">
          <label
            htmlFor="category-select"
            className="block text-xs text-gray-500 dark:text-gray-300 mb-1 md:mb-0 md:mr-2 md:inline-block"
          >
            Search by category
          </label>
          <select
            id="category-select"
            ref={categorySelectRef}
            value={selectedCategory ?? ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") {
                setSelectedCategory(ALL_CATEGORIES);
                setActiveCategoryDropdown(false);
              } else {
                setSelectedCategory(val);
                setActiveCategoryDropdown(true);
                setSearchFocused(false);
                setSearchTerm("");
              }
            }}
            className="rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm px-3 py-2 min-w-[160px]"
          >
            <option value="">All</option>
            {mockCategories.map((cat) => (
              <option key={cat.code} value={cat.code}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal for Add/Edit Item */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white"
              onClick={() => setModalOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingItemCode ? "Edit Item" : "Add Item"}
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={modalItem.ItemName}
                  name="ItemName"
                  readOnly
                  className="w-full rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white"
                />
              </div>
              {/* Inputs for each unit, only show if price > 0 */}
              {Object.keys(modalItem.UnitQuantities).map(
                (unit, idx) =>
                  modalItem.UnitPrices[unit] > 0 && (
                    <div key={unit} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          {unit} Qty
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={modalItem.UnitQuantities[unit]}
                          onChange={(e) =>
                            handleUnitQtyChange(unit, e.target.value)
                          }
                          className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                          {idx === 0 ? "Selling Price" : "Alt Selling Price"}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={modalItem.UnitPrices[unit]}
                          onChange={(e) =>
                            handleUnitPriceChange(unit, e.target.value)
                          }
                          className="w-full rounded border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )
              )}
              <button
                onClick={handleAddItem}
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold mt-2"
              >
                {editingItemCode ? "Update Item" : "Add Item"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Items Table */}
      {groupedInvoiceItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Added Items
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    SN
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Code
                  </th>
                  {allUnits.map((unit) => (
                    <th
                      key={unit + "-qty"}
                      className="px-4 py-2 text-left text-xs font-medium text-red-500 dark:text-gray-300 uppercase"
                    >
                      {unit} Qty
                    </th>
                  ))}
                  {allUnits.map((unit) => (
                    <th
                      key={unit + "-price"}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                    >
                      {unit} Price
                    </th>
                  ))}
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Total Price
                  </th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {groupedInvoiceItems.map((item, idx) => {
                  const total = allUnits.reduce(
                    (sum, unit) =>
                      sum +
                      (item.UnitQuantities[unit] || 0) *
                        (item.UnitPrices[unit] || 0),
                    0
                  );
                  return (
                    <tr key={item.ItemCode || idx}>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {item.SN}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {item.ItemName}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        {item.ItemCode}
                      </td>
                      {allUnits.map((unit) => (
                        <td
                          key={unit + "-qty"}
                          className="px-4 py-2 text-sm text-gray-900 dark:text-white"
                        >
                          {typeof item.UnitQuantities[unit] === "number" &&
                          item.UnitQuantities[unit] > 0
                            ? item.UnitQuantities[unit]
                            : "-"}
                        </td>
                      ))}
                      {allUnits.map((unit) => (
                        <td
                          key={unit + "-price"}
                          className="px-4 py-2 text-sm text-gray-900 dark:text-white"
                        >
                          {typeof item.UnitPrices[unit] === "number" &&
                          item.UnitPrices[unit] > 0
                            ? `₦${item.UnitPrices[unit].toLocaleString()}`
                            : "-"}
                        </td>
                      ))}
                      <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                        ₦{total.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(idx)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceItemsSection;