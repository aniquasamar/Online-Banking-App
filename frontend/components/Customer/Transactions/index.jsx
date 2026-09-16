import CustomerLayout from '../../Layout/CustomerLayout';
import TransactionTable from "../../Shared/TransactionTable";

const CustomerTransaction = () => {
  
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  return (
    <CustomerLayout>
      <TransactionTable
        accountNumber={userInfo?.accountNumber}
        branch={userInfo?.branch} />
    </CustomerLayout>
  );
};

export default CustomerTransaction;