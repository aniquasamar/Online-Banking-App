import EmployeeLayout from '../Layout/EmployeeLayout';
import Dashboard from '../Shared/Dashboard';
import useSWR from "swr";
import {fetchData} from "../../modules/modules";

const EmployeeDashboard = () => {

  //get userInfo from sessionStorage
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    const {data : trData, error : trError} = useSWR(
        `/api/transactions/summary?branch=${userInfo.branch}`,
        fetchData,
        {
            revalidateOnFocus : false,
            revalidateOnReconnect : false,
            refreshInterval : 1200000,
        }
    );
  return (
    <EmployeeLayout>
      <Dashboard data={trData && trData} />
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;