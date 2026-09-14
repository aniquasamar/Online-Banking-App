import React, { useState } from 'react';
import {
  Card,
  Input,
  Button,
  Form,
  Select,
  Image,
  Empty,
  message,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { http } from '../../../modules/modules';

const { Item } = Form;

const NewTransaction = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactionForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();

  // Read logged in employee / admin info from sessionStorage
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');

  // Search by account number function
  const searchByAccountNumber = async () => {
    if (!accountNumber) {
      messageApi.warning('Please enter account number');
      return;
    }

    try {
      setLoading(true);
      const obj = {
        accountNumber: accountNumber,
        branch: userInfo?.branch,
      };

      const httpReq = http();
      const { data } = await httpReq.post('/api/customers/find-account', obj);

      if (data?.data) {
        setCustomerData(data.data);
        messageApi.success('Account details fetched');
      } else {
        setCustomerData(null);
        messageApi.error('Unable to find account detail');
      }
    } catch (err) {
      setCustomerData(null);
      messageApi.error(
        err?.response?.data?.message || 'Unable to find account detail'
      );
    } finally {
      setLoading(false);
    }
  };

  // onFinish - create transaction and update customer final balance
  const onFinish = async (values) => {
    if (!customerData) {
      messageApi.error('Please find and select an account first');
      return;
    }

    const currentBal = Number(customerData?.finalBalance || 0);
    const transAmount = Number(values.amount);

    // Check insufficient funds on debit
    if (values.type === 'debit' && transAmount > currentBal) {
      messageApi.error('Insufficient account balance!');
      return;
    }

    // Calculate new balance
    let updatedBalance = 0;
    if (values.type === 'credit') {
      updatedBalance = currentBal + transAmount;
    } else if (values.type === 'debit') {
      updatedBalance = currentBal - transAmount;
    }

    try {
      setLoading(true);

      const transactionPayload = {
        accountNumber: Number(customerData?.accountNumber),
        customerId: customerData?._id,
        type: values.type,
        amount: transAmount,
        remark: values.remark,
        currentBalance: currentBal,
        finalBalance: updatedBalance,
        branch: customerData?.branch,
        createdBy: userInfo?.fullname || 'employee',
      };

      const httpReq = http();

      // 1. Create transaction entry
      await httpReq.post('/api/transactions', transactionPayload);

      // 2. Update customer balance in customers collection
      await httpReq.put(`/api/customers/${customerData._id}`, {
        finalBalance: updatedBalance,
      });

      // Update local state customer balance
      setCustomerData({
        ...customerData,
        finalBalance: updatedBalance,
      });

      messageApi.success('Transaction Created Successfully');
      transactionForm.resetFields();
      setCustomerData(null);
    } catch (err) {
      messageApi.error(err?.response?.data?.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {context}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Left Column: Search & Customer Details */}
        <div className="flex flex-col gap-4">
          <Card title="Find Account">
            <Input
              placeholder="Enter Account Number"
              onChange={(e) => setAccountNumber(e.target.value)}
              addonAfter={
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={searchByAccountNumber}
                >
                  <SearchOutlined /> Search
                </span>
              }
            />
          </Card>

          <Card title="Customer Details">
            {customerData ? (
              <div className="flex flex-col gap-3">
                <div className="flex justify-center">
                  <Image
                    src={`${import.meta.env.VITE_BASEURL}/${customerData?.profile}`}
                    className="rounded-full"
                    width={80}
                    height={80}
                  />
                  <Image
                    src={`${import.meta.env.VITE_BASEURL}/${customerData?.signature}`}
                    className="rounded-full"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Full Name:</span>
                  <span className="capitalize">{customerData?.fullname}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Account Number:</span>
                  <span>{customerData?.accountNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Account Balance:</span>
                  <span className="font-bold text-green-600">
                    {customerData?.currency === 'inr' || customerData?.currency === 'INR' ? '₹' : '$'}{' '}
                    {customerData?.finalBalance}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Currency:</span>
                  <span className="uppercase">{customerData?.currency}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Branch:</span>
                  <span>{customerData?.branch}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Mobile:</span>
                  <span>{customerData?.mobile}</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span className="font-semibold">Status:</span>
                  <span
                    className={
                      customerData?.isActive
                        ? 'text-green-600 font-semibold'
                        : 'text-red-500 font-semibold'
                    }
                  >
                    {customerData?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ) : (
              <Empty description="No Data" />
            )}
          </Card>
        </div>

        {/* Right Columns: Transaction Form */}
        <div className="md:col-span-2">
          <Card title="New Transaction">
            <Form
              form={transactionForm}
              layout="vertical"
              onFinish={onFinish}
            >
              <Item
                label="Transaction Type"
                name="type"
                rules={[{ required: true, message: 'Please select transaction type' }]}
              >
                <Select
                  placeholder="Select Type"
                  options={[
                    { label: 'CR (Credit)', value: 'credit' },
                    { label: 'DR (Debit)', value: 'debit' },
                  ]}
                />
              </Item>

              <Item
                label="Amount"
                name="amount"
                rules={[{ required: true, message: 'Please enter amount' }]}
              >
                <Input type="number" placeholder="Enter Amount" />
              </Item>

              <Item
                label="Reference / Remarks"
                name="remark"
                rules={[{ required: true, message: 'Please enter reference details' }]}
              >
                <Input.TextArea placeholder="Enter Cash / Online / Reference details" />
              </Item>

              <Item>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="!w-full !bg-blue-500 !font-bold"
                >
                  Submit Transaction
                </Button>
              </Item>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NewTransaction;