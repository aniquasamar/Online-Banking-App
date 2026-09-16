import EmployeeLayout from '../../Layout/EmployeeLayout';
import NewTransaction from '../../Shared/NewTransaction';
import TransactionTable from "../../Shared/TransactionTable";

const EmpTransaction = () => {

  //get userInfo from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  return (
    <EmployeeLayout>
      <NewTransaction />
      <TransactionTable
        accountNumber={userInfo?.accountNumber}
        branch={userInfo?.branch} />
    </EmployeeLayout>
  );
};

export default EmpTransaction;