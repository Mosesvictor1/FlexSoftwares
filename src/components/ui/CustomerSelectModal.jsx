import React, { useState } from "react";
import Modal from "./Modal";

const initialMockCustomers = [
  {
    id: 1,
    name: "Jayvion Simon",
    company: "Gleichner, Mueller and Tromp",
    companyUrl: "#",
    address: "19034 Verna Unions Apt. 164 - Honolulu, RI / 87535",
    phone: "+1 202-555-0143",
    isDefault: true,
  },
  {
    id: 2,
    name: "Lucian Obrien",
    company: "Nikolaus - Leuschke",
    companyUrl: "#",
    address: "1147 Rohan Drive Suite 819 - Burlington, VT / 82021",
    phone: "+1 416-555-0198",
    isDefault: false,
  },
  {
    id: 3,
    name: "Deja Brady",
    company: "Hegmann, Kreiger and Bayer",
    companyUrl: "#",
    address: "18605 Thompson Circle Apt. 086 - Idaho Falls, WV / 50337",
    phone: "+44 20 7946 0958",
    isDefault: false,
  },
  {
    id: 4,
    name: "Harrison Stein",
    company: "Grimes Inc",
    companyUrl: "#",
    address: "110 Lamar Station Apt. 730 - Hagerstown, OK / 49808",
    phone: "+61 2 9876 5432",
    isDefault: false,
  },
];

const CustomerSelectModal = ({ isOpen, onClose, onSelectCustomer }) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [customers, setCustomers] = useState(initialMockCustomers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    company: "",
    address: "",
    phone: "",
  });

  const filteredCustomers = customers.filter((customer) =>
    [customer.name, customer.company, customer.address, customer.phone].some(
      (field) => field.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleSelect = (customer) => {
    setSelectedId(customer.id);
    onSelectCustomer(customer);
    onClose();
  };

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newCustomer.name.trim()) return;
    const id = customers.length
      ? Math.max(...customers.map((c) => c.id)) + 1
      : 1;
    const customerToAdd = {
      ...newCustomer,
      id,
      companyUrl: "#",
      isDefault: false,
    };
    setCustomers((prev) => [...prev, customerToAdd]);
    setShowAddForm(false);
    setNewCustomer({ name: "", company: "", address: "", phone: "" });
    setSelectedId(id);
    onSelectCustomer(customerToAdd);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Customers</h2>
        {!showAddForm && (
          <button
            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-blue-600 font-medium text-sm"
            onClick={() => setShowAddForm(true)}
          >
            <span className="text-lg font-bold">+</span> New
          </button>
        )}
      </div>
      {showAddForm ? (
        <form onSubmit={handleAddNew} className="space-y-4 animate-fade-in">
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
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
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400 text-sm"
            />
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredCustomers.length === 0 ? (
              <div className="text-gray-500 text-sm">No customers found.</div>
            ) : (
              filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-4 rounded-lg cursor-pointer transition border flex flex-col gap-1 ${
                    selectedId === customer.id
                      ? "bg-blue-50 border-blue-400"
                      : "bg-white dark:bg-gray-700 border-transparent hover:bg-gray-100 dark:hover:bg-blue-900"
                  }`}
                  onClick={() => handleSelect(customer)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-base text-gray-900 dark:text-white">
                      {customer.name}
                    </span>
                    {customer.isDefault && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <a
                    href={customer.companyUrl}
                    className="text-green-600 text-sm font-medium hover:underline"
                  >
                    {customer.company}
                  </a>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {customer.address}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">
                    {customer.phone}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default CustomerSelectModal;
