import Dexie, { Table } from 'dexie';
import { Contact, ContactGroup, CallHistoryEntry } from '@/types';

export class PhonebookDatabase extends Dexie {
  contacts!: Table<Contact>;
  groups!: Table<ContactGroup>;
  callHistory!: Table<CallHistoryEntry>;

  constructor() {
    super('PhonebookDatabase');
    
    this.version(1).stores({
      contacts: 'id, name.first, name.last, isFavorite, *groups, createdAt',
      groups: 'id, name, createdAt',
      callHistory: 'id, contactId, timestamp, type',
    });
  }
}

export const db = new PhonebookDatabase();

export const storageService = {
  async saveContact(contact: Contact): Promise<void> {
    await db.contacts.put(contact);
  },

  async getContact(id: string): Promise<Contact | undefined> {
    return await db.contacts.get(id);
  },

  async getAllContacts(): Promise<Contact[]> {
    return await db.contacts.orderBy('name.last').toArray();
  },

  async deleteContact(id: string): Promise<void> {
    await db.contacts.delete(id);
  },

  async saveGroup(group: ContactGroup): Promise<void> {
    await db.groups.put(group);
  },

  async getAllGroups(): Promise<ContactGroup[]> {
    return await db.groups.orderBy('name').toArray();
  },

  async deleteGroup(id: string): Promise<void> {
    await db.groups.delete(id);
  },

  async addCallHistoryEntry(entry: CallHistoryEntry): Promise<void> {
    await db.callHistory.put(entry);
  },

  async getCallHistory(contactId?: string): Promise<CallHistoryEntry[]> {
    if (contactId) {
      return await db.callHistory
        .where('contactId')
        .equals(contactId)
        .orderBy('timestamp')
        .reverse()
        .toArray();
    }
    return await db.callHistory.orderBy('timestamp').reverse().toArray();
  },

  async clearAllData(): Promise<void> {
    await db.contacts.clear();
    await db.groups.clear();
    await db.callHistory.clear();
  },
};