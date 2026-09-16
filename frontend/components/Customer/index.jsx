import CustomerLayout from '../Layout/CustomerLayout';
import Dashboard from "../Shared/Dashboard";
import useSWR from "swr";
import {fetchData} from "../../modules/modules";

const CustomerDashboard = () => {
  //get userInfo from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const {data : trData, error : trError} = useSWR(
        `/api/transactions/summary?accountNumber=${userInfo.accountNumber}`,
        fetchData,
        {
            revalidateOnFocus : false,
            revalidateOnReconnect : false,
            refreshInterval : 1200000,
        }
    );
  return (
    <CustomerLayout>
      <Dashboard data={trData && trData} />
    </CustomerLayout>
  );
};

export default CustomerDashboard;