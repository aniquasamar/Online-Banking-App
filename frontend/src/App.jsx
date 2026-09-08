import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Guard from '../components/Guard';
import Loader from '../components/Loader';

const Homepage = lazy(() => import('../components/Home'));
const AdminDashboard = lazy(() => import('../components/Admin'));
const Branding = lazy(() => import('../components/Admin/Branding'));
const Branch = lazy(() => import('../components/Admin/Branch'));
const Currency = lazy(() => import('../components/Admin/Currency'));
const NewEmployee = lazy(() => import('../components/Admin/NewEmployee'));
const EmployeeDashboard = lazy(() => import('../components/Employee'));
const PageNotFound = lazy(() => import('../components/PageNotFound'));
const NewAccount = lazy(() => import('../components/Employee/NewAccount'));
// import Homepage from "../components/Home";
// import AdminDashboard from "../components/Admin";
// import Branding from '../components/Admin/Branding';
// import Branch from '../components/Admin/Branch';
// import NewEmployee from "../components/Admin/NewEmployee";
// import Currency from '../components/Admin/Currency';
// import EmployeeDashboard from '../components/Employee';
// import PageNotFound from '../components/PageNotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Homepage />} />

          {/* Start Admin Related Routes */}
          <Route
            path="/admin"
            element={<Guard endpoint="/api/verify-token" role="admin" />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="branding" element={<Branding />} />
            <Route path="branch" element={<Branch />} />
            <Route path="currency" element={<Currency />} />
            <Route path="new-employee" element={<NewEmployee />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          {/* End Admin Related Routes */}

          {/* Start Employee Related Routes */}
          <Route
            path="/employee"
            element={<Guard endpoint="/api/verify-token" role="employee" />}
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="new-account" element={<NewAccount />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
          {/* End Employee Related Routes */}

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
};
export default App;