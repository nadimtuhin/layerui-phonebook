import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FixedSizeList as List } from 'react-window';
import { RootState, AppDispatch } from '@/store';
import { selectContact } from '@/store/slices/uiSlice';
import { toggleFavorite } from '@/store/slices/contactsSlice';
import { selectSearchResults, selectAllContacts } from '@/store/selectors/contactSelectors';
import ContactCard from './ContactCard';
import ContactForm from './ContactForm';

const ContactList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { view, isContactFormOpen } = useSelector((state: RootState) => state.ui);
  const { query } = useSelector((state: RootState) => state.search);
  
  const searchResults = useSelector(selectSearchResults);
  const allContacts = useSelector(selectAllContacts);
  
  const contacts = query.trim() ? searchResults : allContacts;

  const handleContactClick = (contactId: string) => {
    dispatch(selectContact(contactId));
  };

  const handleToggleFavorite = (contactId: string) => {
    dispatch(toggleFavorite(contactId));
  };

  const renderContactItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const contact = contacts[index];
    if (!contact) return null;

    return (
      <div style={style}>
        <ContactCard
          contact={contact}
          onClick={() => handleContactClick(contact.id)}
          onToggleFavorite={() => handleToggleFavorite(contact.id)}
          view={view}
        />
      </div>
    );
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {query.trim() ? 'No contacts found' : 'No contacts yet'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {query.trim() 
            ? 'Try adjusting your search terms'
            : 'Get started by adding your first contact'
          }
        </p>
        {isContactFormOpen && <ContactForm />}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {query.trim() ? `Search Results (${contacts.length})` : `Contacts (${contacts.length})`}
        </h2>
      </div>

      {view === 'list' && (
        <List
          height={600}
          itemCount={contacts.length}
          itemSize={80}
          className="border rounded-lg"
        >
          {renderContactItem}
        </List>
      )}

      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => handleContactClick(contact.id)}
              onToggleFavorite={() => handleToggleFavorite(contact.id)}
              view={view}
            />
          ))}
        </div>
      )}

      {view === 'card' && (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onClick={() => handleContactClick(contact.id)}
              onToggleFavorite={() => handleToggleFavorite(contact.id)}
              view={view}
            />
          ))}
        </div>
      )}

      {isContactFormOpen && <ContactForm />}
    </div>
  );
};

export default ContactList;