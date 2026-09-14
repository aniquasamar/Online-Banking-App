import React from 'react';
import EmployeeLayout from '../../Layout/EmployeeLayout';
import NewTransaction from '../../Shared/NewTransaction';

const EmpTransaction = () => {
  return (
    <EmployeeLayout>
      <NewTransaction />
    </EmployeeLayout>
  );
};

export default EmpTransaction;