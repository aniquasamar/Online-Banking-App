import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { http } from '../../modules/modules';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../Loader';

const Guard = ({ endpoint, role }) => {
  const [authorized, setAuthorized] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userType, setUserType] = useState(null);

  const cookies = new Cookies();
  const token = cookies.get('authToken');

  if (!token) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setAuthorized(false);
        return;
      }

      try {
        const httpReq = http(token);
        const { data } = await httpReq.get(endpoint);

        const user = data?.data?.userType;
        sessionStorage.setItem('userInfo', JSON.stringify(data?.data));
        setUserType(user);
        setAuthorized(true);
        setLoader(false);
      } catch (error) {
        setAuthorized(false);
        setUserType(null);
        setLoader(false);
      }
    };

    verifyToken();
  }, [endpoint]);

  if (loader) {
    return <Loader />;
  }

  if (authorized && userType === 'admin') {
    return <Outlet />;
  } else if (authorized && userType === 'employee') {
    return <Outlet />;
  } else if (authorized && userType === 'customer') {
    return <Outlet />;
  }else {
    return <Navigate to="/" />;
  }
};

export default Guard;