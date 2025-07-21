import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { toggleFavorite, deleteContact } from '@/store/slices/contactsSlice';
import { openContactForm, selectContact } from '@/store/slices/uiSlice';

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const contact = useSelector((state: RootState) => 
    id ? state.contacts.contacts[id] : undefined
  );

  if (!contact) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❓</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          Contact not found
        </h3>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to contacts
        </button>
      </div>
    );
  }

  const fullName = `${contact.name.first} ${contact.name.last}`;

  const handleEdit = () => {
    dispatch(selectContact(contact.id));
    dispatch(openContactForm());
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${fullName}?`)) {
      await dispatch(deleteContact(contact.id));
      navigate('/');
    }
  };

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(contact.id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to contacts
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={fullName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <span>{contact.name.first[0]}{contact.name.last[0]}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{fullName}</h1>
                {contact.company && (
                  <p className="text-blue-100 text-lg">{contact.company}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={handleToggleFavorite}
                    className="flex items-center space-x-1 text-white hover:text-yellow-300"
                  >
                    <span>{contact.isFavorite ? '⭐' : '☆'}</span>
                    <span>{contact.isFavorite ? 'Favorited' : 'Add to favorites'}</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-white"
              >
                ✏️ Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Contact Information
              </h2>
              
              {/* Phone Numbers */}
              {contact.phones.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Phone Numbers
                  </h3>
                  {contact.phones.map((phone) => (
                    <div key={phone.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-gray-900 dark:text-gray-100">{phone.number}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {phone.type} {phone.isPrimary && '(Primary)'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`tel:${phone.number}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          📞
                        </a>
                        <a
                          href={`sms:${phone.number}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          💬
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Email Addresses */}
              {contact.emails.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Email Addresses
                  </h3>
                  {contact.emails.map((email) => (
                    <div key={email.id} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-gray-900 dark:text-gray-100">{email.address}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {email.type} {email.isPrimary && '(Primary)'}
                        </p>
                      </div>
                      <a
                        href={`mailto:${email.address}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✉️
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Address */}
              {contact.address && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Address
                  </h3>
                  <div className="text-gray-900 dark:text-gray-100">
                    <p>{contact.address.street}</p>
                    <p>
                      {contact.address.city}, {contact.address.state} {contact.address.postalCode}
                    </p>
                    <p>{contact.address.country}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Additional Information
              </h2>

              {/* Groups */}
              {contact.groups.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Groups
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {contact.groups.map((groupId) => (
                      <span
                        key={groupId}
                        className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        {groupId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {contact.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Notes
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {contact.notes}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Details
                </h3>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>Created: {new Date(contact.createdAt).toLocaleDateString()}</p>
                  <p>Updated: {new Date(contact.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;