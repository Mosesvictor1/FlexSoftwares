import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const InvalidClientId = () => {
  const location = useLocation();
  const errorMessage =
    location.state?.errorMessage ||
    "The client ID you entered is not valid or has expired.";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Invalid Client ID
          </h2>
          <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <div>
                <Link
                  to="/"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Return to Client ID Entry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvalidClientId;
