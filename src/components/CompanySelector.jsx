import React from "react";
import { useAuth } from "../context/AuthContext";

const CompanySelector = () => {
  const { clientInfo, selectedCompany, setCompany } = useAuth();

  if (!clientInfo?.companyinfo?.length) {
    return null;
  }

  const handleCompanyChange = (event) => {
    const company = clientInfo.companyinfo.find(
      (c) => c.CoyCode === event.target.value
    );
    if (company) {
      setCompany(company);
    }
  };

  return (
    <div className="company-selector">
      <label htmlFor="company-select">Select Company:</label>
      <select
        id="company-select"
        value={selectedCompany?.CoyCode || ""}
        onChange={handleCompanyChange}
        className="form-select"
      >
        {clientInfo.companyinfo.map((company) => (
          <option key={company.CoyCode} value={company.CoyCode}>
            {company.CoyName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CompanySelector;
