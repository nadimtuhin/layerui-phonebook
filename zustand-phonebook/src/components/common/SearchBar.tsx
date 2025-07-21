import React, { useCallback, useEffect } from 'react';
import { useSearchStore } from '@/store/searchStore';
import { useContactStore } from '@/store/contactStore';
import { useDebounce } from '@/hooks/useDebounce';

const SearchBar: React.FC = () => {
  const { query, filters, isSearching, setQuery, toggleFavoritesFilter } = useSearchStore();
  const { contacts } = useContactStore();
  
  const debouncedQuery = useDebounce(query, 300);
  const allContacts = Object.values(contacts);

  const handleSearch = useCallback(() => {
    if (debouncedQuery.trim()) {
      useSearchStore.getState().searchContacts(allContacts);
    }
  }, [debouncedQuery, allContacts]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="flex items-center space-x-4 max-w-md">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="animate-spin h-5 w-5 text-gray-400">⟳</div>
          ) : (
            <div className="h-5 w-5 text-gray-400">🔍</div>
          )}
        </div>
      </div>
      
      <button
        onClick={toggleFavoritesFilter}
        className={`p-2 rounded ${
          filters.favorites
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
        }`}
        title="Filter favorites"
      >
        ⭐
      </button>
    </div>
  );
};

export default SearchBar;