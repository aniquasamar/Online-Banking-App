// import React, { useEffect, useState } from "react";
// import { Table } from "antd";
// import { formatDate, http } from "../../../modules/modules";

// const TransactionTable = ({ query = {} }) => {
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [accountNumber, setAccountNumber] = useState(query.accountNumber || "");
//   const [branch, setBranch] = useState(query.branch || "");
//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10
//   });
//   const [loading, setLoading] = useState(false);

//   const fetchTransactions = async (params = {}) => {
//     setLoading(true);
//     const searchParams = new URLSearchParams({
//       page: params.current || 1,
//       pageSize: params.pageSize || 10,
//     });

//     // Add filters from state OR initial query
//     if (accountNumber) searchParams.append("accountNumber", accountNumber);
//     if (branch) searchParams.append("branch", branch);
//     try {
//       const httpReq = http();
//       const res = await httpReq.get(`/api/transactions/pagination?${searchParams.toString()}`);
//       setData(res.data.data);
//       setTotal(res.data.total);
//       setPagination({
//         current: res.data.page,
//         pageSize: res.data.pageSize
//       });
//     } catch (err) {
//       console.error("Failed to fetch transactions", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions(pagination);
//   }, [query]); // Re-run when new props come in

//   const handleTableChange = (pagination) => {
//     fetchTransactions(pagination);
//   };

//   const columns = [
//     { 
//         title: "Account Number", 
//         dataIndex: "accountNumber", 
//         key: "accountNumber" 
//     },
//     { 
//         title: "Branch", 
//         dataIndex: "branch", 
//         key: "branch" 
//     },
//     { 
//         title: "Type", 
//         dataIndex: "transactionType", 
//         key: "transactionType" 
//     },
//     { 
//         title: "Amount", 
//         dataIndex: "transactionAmount", 
//         key: "transactionAmount" 
//     },
//     { 
//       title: "Date", 
//       dataIndex: "createdAt", 
//       key: "createdAt",
//       render : (d) => formatDate(d) 
//     },
//   ];

//   return (
//     <div className="p-4">
//       <Table
//         rowKey="_id"
//         columns={columns}
//         dataSource={data}
//         pagination={{
//           total: total,
//           current: pagination.current,
//           pageSize: pagination.pageSize
//         }}
//         loading={loading}
//         onChange={handleTableChange}
//       />
//     </div>
//   );
// };

// export default TransactionTable;

import React, { useEffect, useState, useRef } from 'react';
import { Table, Card, Tag, message, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { http, handlePrint } from '../../../modules/modules';

const TransactionTable = ({ accountNumber, branch }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const printRef = useRef(null);

  const fetchTransactions = async (currentPage = 1, currentLimit = 10) => {
    try {
      setLoading(true);
      const httpReq = http();
      let url = `/api/transactions/pagination?page=${currentPage}&limit=${currentLimit}`;

      if (accountNumber) {
        url += `&accountNumber=${accountNumber}`;
      }
      if (branch) {
        url += `&branch=${branch}`;
      }

      const res = await httpReq.get(url);
      setData(res?.data?.data || []);
      setTotal(res?.data?.total || 0);
    } catch (error) {
      message.error('Unable to fetch transaction history');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchTransactions(page, pageSize);
  }, [accountNumber, branch, page, pageSize]);

  const columns = [
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'credit' ? 'green' : 'red'}>
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span
          className={
            record.type === 'credit'
              ? 'text-green-600 font-semibold'
              : 'text-red-500 font-semibold'
          }
        >
          {record.type === 'credit' ? `+ ₹${amount}` : `- ₹${amount}`}
        </span>
      ),
    },
    {
      title: 'Final Balance',
      dataIndex: 'finalBalance',
      key: 'finalBalance',
      render: (bal) => `₹${bal}`,
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'Date & Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <Card
      title="Transaction History"
      extra={
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          className="!bg-blue-500 !font-semibold"
        >
          Print
        </Button>
      }
      style={{ overflowX: 'auto' }}
    >
      <div ref={printRef}>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (p, ps) => {
              setPage(p);
              setPageSize(ps);
            },
          }}
        />
      </div>
    </Card>
  );
};

export default TransactionTable;