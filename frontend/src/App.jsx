import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from "../components/Home";
import AdminDashboard from "../components/Admin";
import Branding from '../components/Admin/Branding';
import Branch from '../components/Admin/Branch';
import NewEmployee from "../components/Admin/NewEmployee";
import Currency from '../components/Admin/Currency';
import EmployeeDashboard from '../components/Employee';
import PageNotFound from '../components/PageNotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* Start Admin Related Routes */}
        <Route path="/admin/*">
          <Route index element={<AdminDashboard />} />
          <Route path="branding" element={<Branding />} />
          <Route path="branch" element={<Branch />} />
          <Route path="currency" element={<Currency />} />
          <Route path="new-employee" element={<NewEmployee />} />
        </Route>
        {/* End Admin Related Routes */}

        {/* Start Employee Related Routes */}
        <Route path="/employee/*">
          <Route index element={<EmployeeDashboard />} />
        </Route>
        {/* End Employee Related Routes */}
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
};
export default App;