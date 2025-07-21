import React from 'react';

const GroupManager: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Group Manager</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Organize your contacts into groups for better management.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Group Management Coming Soon
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Create and manage contact groups to organize your phonebook.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupManager;