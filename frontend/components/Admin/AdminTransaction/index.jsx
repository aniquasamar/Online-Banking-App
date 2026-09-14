import React from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import NewTransaction from '../../Shared/NewTransaction';

const AdminTransaction = () => {
  return (
    <AdminLayout>
      <NewTransaction />
    </AdminLayout>
  );
};

export default AdminTransaction;