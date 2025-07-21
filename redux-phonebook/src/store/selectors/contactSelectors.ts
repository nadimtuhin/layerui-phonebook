import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

export const selectAllContacts = (state: RootState) => 
  Object.values(state.contacts.contacts);

export const selectContactById = (contactId: string) => 
  (state: RootState) => state.contacts.contacts[contactId];

export const selectFavoriteContacts = createSelector(
  [selectAllContacts, (state: RootState) => state.contacts.favorites],
  (contacts, favorites) => contacts.filter(contact => favorites.includes(contact.id))
);

export const selectContactsByGroup = (groupId: string) =>
  createSelector(
    [selectAllContacts],
    (contacts) => contacts.filter(contact => contact.groups.includes(groupId))
  );

export const selectContactsLoading = (state: RootState) => 
  state.contacts.loading;

export const selectContactsError = (state: RootState) => 
  state.contacts.error;

export const selectSearchResults = createSelector(
  [
    (state: RootState) => state.search.results,
    (state: RootState) => state.contacts.contacts,
  ],
  (resultIds, contacts) => 
    resultIds.map(id => contacts[id]).filter(Boolean)
);