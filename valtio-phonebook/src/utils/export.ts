import Papa from 'papaparse';
import { Contact } from '@/types';

export const exportToCSV = (contacts: Contact[]): string => {
  const csvData = contacts.map(contact => ({
    firstName: contact.name.first,
    lastName: contact.name.last,
    middleName: contact.name.middle || '',
    primaryPhone: contact.phones.find(p => p.isPrimary)?.number || '',
    primaryEmail: contact.emails.find(e => e.isPrimary)?.address || '',
    company: contact.company || '',
    notes: contact.notes || '',
    isFavorite: contact.isFavorite,
    groups: contact.groups.join(';'),
    createdAt: contact.createdAt.toISOString(),
  }));

  return Papa.unparse(csvData);
};

export const exportToJSON = (contacts: Contact[]): string => {
  return JSON.stringify(contacts, null, 2);
};

export const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};