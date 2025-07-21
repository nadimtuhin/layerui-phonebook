export interface Name {
  first: string;
  last: string;
  middle?: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  type: 'mobile' | 'home' | 'work' | 'other';
  isPrimary: boolean;
}

export interface Email {
  id: string;
  address: string;
  type: 'personal' | 'work' | 'other';
  isPrimary: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Contact {
  id: string;
  name: Name;
  phones: PhoneNumber[];
  emails: Email[];
  address?: Address;
  company?: string;
  notes?: string;
  avatar?: string;
  groups: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactGroup {
  id: string;
  name: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  groups: string[];
  favorites: boolean;
  phoneType?: string;
  emailType?: string;
}