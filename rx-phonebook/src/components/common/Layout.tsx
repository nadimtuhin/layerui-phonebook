import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { uiStore } from '@/store/uiStore';
import { useObservable } from '@/hooks/useObservable';
import SearchBar from './SearchBar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const view = useObservable(uiStore.view$, 'list');
  const theme = useObservable(uiStore.theme$, 'light');

  const navigation = [
    { name: 'Contacts', path: '/', icon: '👥' },
    { name: 'Groups', path: '/groups', icon: '📂' },
    { name: 'Import/Export', path: '/import-export', icon: '📁' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  const viewOptions = [
    { value: 'list' as const, icon: '📋', label: 'List' },
    { value: 'grid' as const, icon: '⊞', label: 'Grid' },
    { value: 'card' as const, icon: '🃏', label: 'Card' },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="bg-orange-600 dark:bg-orange-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold">🌊 RxJS Phonebook</h1>
                <SearchBar />
              </div>
              <div className="flex items-center space-x-4">
                {location.pathname === '/' && (
                  <div className="flex items-center space-x-2">
                    {viewOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => uiStore.setView(option.value)}
                        className={`p-2 rounded ${
                          view === option.value
                            ? 'bg-orange-700 dark:bg-orange-900'
                            : 'hover:bg-orange-700 dark:hover:bg-orange-900'
                        }`}
                        title={option.label}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => uiStore.openContactForm()}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  ➕ Add Contact
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-gray-100 dark:bg-gray-800 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${
                    location.pathname === item.path
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;