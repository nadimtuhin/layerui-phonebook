import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { contactStore } from './store/contactStore';
import Layout from './components/common/Layout';
import ContactList from './components/contact/ContactList';
import ContactDetail from './components/contact/ContactDetail';
import GroupManager from './components/groups/GroupManager';
import Settings from './components/common/Settings';
import ImportExport from './components/common/ImportExport';

function App() {
  useEffect(() => {
    // Initialize data
    contactStore.fetchContacts().then(contacts => {
      contactStore.setContacts(contacts);
    }).catch(console.error);
    
    contactStore.fetchGroups().subscribe({
      next: () => {},
      error: console.error
    });
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ContactList />} />
          <Route path="/contact/:id" element={<ContactDetail />} />
          <Route path="/groups" element={<GroupManager />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/import-export" element={<ImportExport />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;