import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setTheme } from '@/store/slices/uiSlice';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useSelector((state: RootState) => state.ui);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Customize your phonebook experience.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {/* Appearance */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Data Management
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Clear All Data
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Remove all contacts and groups from local storage
                </p>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            About
          </h2>
          <div className="text-gray-600 dark:text-gray-400 space-y-2">
            <p>Redux Phonebook v1.0.0</p>
            <p>Built with React, Redux Toolkit, and TypeScript</p>
            <p>Demonstrates layered UI architecture with Redux state management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;