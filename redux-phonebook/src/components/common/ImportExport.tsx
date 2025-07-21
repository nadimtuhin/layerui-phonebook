import React from 'react';

const ImportExport: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Import & Export</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Import contacts from CSV or JSON files, or export your contacts for backup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Import */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📥 Import Contacts
          </h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <div className="text-4xl mb-2">📁</div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drop your CSV or JSON file here, or click to browse
              </p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
                Choose File
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Supported formats:</p>
              <ul className="list-disc list-inside mt-1">
                <li>CSV with headers (name, phone, email)</li>
                <li>JSON array of contact objects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            📤 Export Contacts
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Export all your contacts for backup or transfer to another system.
            </p>
            <div className="space-y-3">
              <button className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center justify-center">
                <span className="mr-2">📊</span>
                Export as CSV
              </button>
              <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center">
                <span className="mr-2">🗂️</span>
                Export as JSON
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Export includes:</p>
              <ul className="list-disc list-inside mt-1">
                <li>All contact information</li>
                <li>Groups and categories</li>
                <li>Creation and modification dates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;