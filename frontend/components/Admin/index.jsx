import AdminLayout from "../Layout/AdminLayout";
import Dashboard from "../Shared/Dashboard";
import useSWR from "swr";
import {fetchData} from "../../modules/modules";

const AdminDashboard = () => {
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
        <AdminLayout>
            <Dashboard data={trData && trData} />
        </AdminLayout>
    )
}

export default AdminDashboard;