import React from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import NewTransaction from '../../Shared/NewTransaction';
import TransactionTable from "../../Shared/TransactionTable";

const AdminTransaction = () => {

   //get userInfo from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  
  return (
    <AdminLayout>
      <NewTransaction />
      <TransactionTable
        accountNumber={userInfo?.accountNumber}
        branch={userInfo?.branch} />
    </AdminLayout>
  );
};

export default AdminTransaction;