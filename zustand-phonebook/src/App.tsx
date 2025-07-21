import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContactStore } from './store/contactStore';
import Layout from './components/common/Layout';
import ContactList from './components/contact/ContactList';
import ContactDetail from './components/contact/ContactDetail';
import GroupManager from './components/groups/GroupManager';
import Settings from './components/common/Settings';
import ImportExport from './components/common/ImportExport';

function App() {
  const { fetchContacts, fetchGroups } = useContactStore();

  useEffect(() => {
    fetchContacts();
    fetchGroups();
  }, [fetchContacts, fetchGroups]);

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