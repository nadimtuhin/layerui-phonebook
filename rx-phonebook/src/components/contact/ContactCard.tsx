import React from 'react';
import { Contact } from '@/types';

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
  onToggleFavorite: () => void;
  view: 'list' | 'grid' | 'card';
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onClick, 
  onToggleFavorite, 
  view 
}) => {
  const fullName = `${contact.name.first} ${contact.name.last}`;
  const primaryPhone = contact.phones.find(p => p.isPrimary)?.number || contact.phones[0]?.number;
  const primaryEmail = contact.emails.find(e => e.isPrimary)?.address || contact.emails[0]?.address;

  const baseClasses = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer";

  if (view === 'list') {
    return (
      <div className={`${baseClasses} p-4 flex items-center space-x-4`} onClick={onClick}>
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {contact.avatar ? (
            <img src={contact.avatar} alt={fullName} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <span>{contact.name.first[0]}{contact.name.last[0]}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {fullName}
            </h3>
            {contact.isFavorite && <span className="text-yellow-500">⭐</span>}
          </div>
          {primaryPhone && (
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              📞 {primaryPhone}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-1 text-gray-400 hover:text-yellow-500"
          >
            {contact.isFavorite ? '⭐' : '☆'}
          </button>
          {contact.company && (
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
              {contact.company}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className={`${baseClasses} p-4 text-center`} onClick={onClick}>
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-3">
          {contact.avatar ? (
            <img src={contact.avatar} alt={fullName} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <span className="text-lg">{contact.name.first[0]}{contact.name.last[0]}</span>
          )}
        </div>
        
        <div className="flex items-center justify-center space-x-1 mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {fullName}
          </h3>
          {contact.isFavorite && <span className="text-yellow-500">⭐</span>}
        </div>
        
        {primaryPhone && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
            {primaryPhone}
          </p>
        )}
        
        {contact.company && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {contact.company}
          </p>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="mt-2 p-1 text-gray-400 hover:text-yellow-500"
        >
          {contact.isFavorite ? '⭐' : '☆'}
        </button>
      </div>
    );
  }

  // Card view
  return (
    <div className={`${baseClasses} p-6`} onClick={onClick}>
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {contact.avatar ? (
            <img src={contact.avatar} alt={fullName} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <span className="text-xl">{contact.name.first[0]}{contact.name.last[0]}</span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {fullName}
              </h3>
              {contact.isFavorite && <span className="text-yellow-500">⭐</span>}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="p-1 text-gray-400 hover:text-yellow-500"
            >
              {contact.isFavorite ? '⭐' : '☆'}
            </button>
          </div>
          
          {contact.company && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">{contact.company}</p>
          )}
          
          <div className="space-y-1">
            {primaryPhone && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                📞 {primaryPhone}
              </p>
            )}
            {primaryEmail && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ✉️ {primaryEmail}
              </p>
            )}
          </div>
          
          {contact.groups.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {contact.groups.slice(0, 3).map((groupId) => (
                <span
                  key={groupId}
                  className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                >
                  {groupId}
                </span>
              ))}
              {contact.groups.length > 3 && (
                <span className="text-xs text-gray-500">+{contact.groups.length - 3} more</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;