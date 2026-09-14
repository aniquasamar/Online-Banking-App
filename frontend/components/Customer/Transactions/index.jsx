import CustomerLayout from '../../Layout/CustomerLayout';

const CustomerTransaction = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  return (
    <CustomerLayout>
      <h1 className='text-5xl font-bold'>
        Welcome to customer transaction
        </h1>
    </CustomerLayout>
  );
};

export default CustomerTransaction;