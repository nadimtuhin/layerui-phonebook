import Fuse from 'fuse.js';
import { Contact, SearchContactsRequest } from '@/types';

const fuseOptions = {
  keys: [
    { name: 'name.first', weight: 0.3 },
    { name: 'name.last', weight: 0.3 },
    { name: 'phones.number', weight: 0.2 },
    { name: 'emails.address', weight: 0.15 },
    { name: 'company', weight: 0.05 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
};

export const searchService = {
  searchContacts(contacts: Contact[], request: SearchContactsRequest): Contact[] {
    let filteredContacts = contacts;

    // Apply filters first
    if (request.filters?.groups?.length) {
      filteredContacts = filteredContacts.filter(contact =>
        contact.groups.some(group => request.filters!.groups!.includes(group))
      );
    }

    if (request.filters?.favorites) {
      filteredContacts = filteredContacts.filter(contact => contact.isFavorite);
    }

    // If no query, return filtered results
    if (!request.query.trim()) {
      return filteredContacts
        .sort((a, b) => a.name.last.localeCompare(b.name.last))
        .slice(request.offset || 0, (request.offset || 0) + (request.limit || 50));
    }

    // Perform fuzzy search
    const fuse = new Fuse(filteredContacts, fuseOptions);
    const results = fuse.search(request.query);

    return results
      .map(result => result.item)
      .slice(request.offset || 0, (request.offset || 0) + (request.limit || 50));
  },

  phoneticSearch(contacts: Contact[], query: string): Contact[] {
    // Simple phonetic matching for phone numbers
    const normalizedQuery = query.replace(/\D/g, '');
    
    return contacts.filter(contact =>
      contact.phones.some(phone => {
        const normalizedPhone = phone.number.replace(/\D/g, '');
        return normalizedPhone.includes(normalizedQuery);
      })
    );
  },

  groupSearch(contacts: Contact[], groupId: string): Contact[] {
    return contacts.filter(contact => contact.groups.includes(groupId));
  },
};