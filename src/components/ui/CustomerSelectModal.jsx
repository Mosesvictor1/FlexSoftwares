import React, { useState } from "react";
import Modal from "./Modal";
import { createCustomer } from "../../services/api";
import { usePaginatedCustomers } from "../../hooks/usePaginatedCustomers";

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const CustomerSelectModal = ({
  isOpen,
  onClose,
  onSelectCustomer,
  title = "Select Customer",
  showAddNew = true,
  allowSearch = true,
  maxHeight = "max-h-80",
}) => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedId, setSelectedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    company: "",
    address: "",
    phone: "",
    email: "",
  });

  // Use paginated customers hook
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error: queryError,
  } = usePaginatedCustomers(debouncedSearch);

  // Combine all customers from all pages
  const allCustomers = data?.pages.flatMap((page) => page.customers) || [];

  const handleSelect = (customer) => {
    setSelectedId(customer.CustomerNo);
    onSelectCustomer(customer);
    onClose();
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim()) return;

    try {
      setError(null);
      const response = await createCustomer(newCustomer);
      const createdCustomer = response.data || response;
      // Optionally, you could refetch the customer list here
      setShowAddForm(false);
      setNewCustomer({
        name: "",
        company: "",
        address: "",
        phone: "",
        email: "",
      });
      setSelectedId(createdCustomer.CustomerNo);
      onSelectCustomer(createdCustomer);
      onClose();
    } catch (error) {
      console.error("Failed to create customer:", error);
      setError("Failed to create customer. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        {showAddNew && !showAddForm && (
          <button
            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium text-sm"
            onClick={() => setShowAddForm(true)}
          >
            <span className="text-lg font-bold">+</span> New
          </button>
        )}
      </div>

      {(error || queryError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error ||
            queryError?.message ||
            "Failed to load customers. Please try again."}
        </div>
      )}

      {showAddForm ? (
        <form onSubmit={handleAddNew} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-medium mb-1">Name *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Company</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
              value={newCustomer.company}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, company: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
              value={newCustomer.address}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, address: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phone</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-400"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          {allowSearch && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400 text-sm"
                disabled={isFetching}
              />
            </div>
          )}

          <div className={`${maxHeight} overflow-y-auto space-y-2`}>
            {isFetching && !isFetchingNextPage && allCustomers.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : allCustomers.length === 0 ? (
              <div className="text-gray-500 text-sm text-center py-8">
                {search
                  ? "No customers found matching your search."
                  : "No customers available."}
              </div>
            ) : (
              allCustomers.map((customer) => (
                <div
                  key={customer.CustomerNo || customer.Surname}
                  className={`p-4 rounded-lg cursor-pointer transition border flex flex-col gap-1 ${
                    selectedId === customer.CustomerNo
                      ? "bg-blue-50 border-blue-400"
                      : "bg-white dark:bg-gray-700 border-transparent hover:bg-gray-100 dark:hover:bg-blue-900"
                  }`}
                  onClick={() => handleSelect(customer)}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-base text-gray-900 dark:text-white">
                      {customer.Surname}
                      {customer.FirstName ? ` ${customer.FirstName}` : ""}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 flex flex-col gap-0.5">
                    <span>
                      <span className="font-medium">Surname:</span>{" "}
                      {customer.Surname || "-"}
                    </span>
                    <span>
                      <span className="font-medium">Phone:</span>{" "}
                      {customer.ContactPhone || "-"}
                    </span>
                    <span>
                      <span className="font-medium">Email:</span>{" "}
                      {customer.Email || "-"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Load More Button */}
          {hasNextPage && !isFetching && (
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-50"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default CustomerSelectModal;
