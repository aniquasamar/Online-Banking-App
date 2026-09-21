// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Table,
//   Card,
//   Tag,
//   Button,
//   DatePicker,
//   Input,
//   Form,
//   message,
// } from 'antd';
// import { PrinterOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
// import { http, handlePrint, downloadTransaction } from '../../../modules/modules';
// import Cookies from "universal-cookie";

// const cookies = new Cookies();
// const { Item } = Form;

// const TransactionTable = ({ accountNumber, branch }) => {
//   const token = cookies.get("authToken");
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [filterQuery, setFilterQuery] = useState({});

//   const [filterForm] = Form.useForm();
//   // const printRef = useRef(null);

//   // Fetch transactions with pagination and date filter query
//   const fetchTransactions = async (
//     currentPage = 1,
//     currentLimit = 10,
//     filters = {}
//   ) => {
//     try {
//       setLoading(true);
//       const httpReq = http(token);
//       let url = `/api/transactions/pagination?page=${currentPage}&limit=${currentLimit}`;

//       const activeAcc = filters.accountNumber || accountNumber;
//       if (activeAcc) {
//         url += `&accountNumber=${activeAcc}`;
//       }

//       if (branch) {
//         url += `&branch=${branch}`;
//       }

//       if (filters.fromDate && filters.toDate) {
//         url += `&fromDate=${filters.fromDate}&toDate=${filters.toDate}`;
//       }

//       const res = await httpReq.get(url);
//       setData(res?.data?.data || []);
//       setTotal(res?.data?.total || 0);
//     } catch (error) {
//       message.error('Unable to fetch transaction history');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions(page, pageSize, filterQuery);
//   }, [accountNumber, branch, page, pageSize, filterQuery]);

//   // Form submit for date range and optional account number filter
//   const onFinish = (values) => {
//     const formattedFilters = {
//       fromDate: values.fromDate ? values.fromDate.format('YYYY-MM-DD') : undefined,
//       toDate: values.toDate ? values.toDate.format('YYYY-MM-DD') : undefined,
//       accountNumber: values.accountNumber || undefined,
//     };

//     setFilterQuery(formattedFilters);
//     setPage(1);
//     fetchTransactions(1, pageSize, formattedFilters);
//   };


//   const columns = [
//     {
//       title: 'Account Number',
//       dataIndex: 'accountNumber',
//       key: 'accountNumber',
//     },
//     {
//       title: 'Type',
//       dataIndex: 'type',
//       key: 'type',
//       render: (type) => (
//         <Tag color={type === 'credit' ? 'green' : 'red'}>
//           {type?.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: 'Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (amount, record) => (
//         <span
//           className={
//             record.type === 'credit'
//               ? 'text-green-600 font-semibold'
//               : 'text-red-500 font-semibold'
//           }
//         >
//           {record.type === 'credit' ? `+ ₹${amount}` : `- ₹${amount}`}
//         </span>
//       ),
//     },
//     {
//       title: 'Final Balance',
//       dataIndex: 'finalBalance',
//       key: 'finalBalance',
//       render: (bal) => `₹${bal}`,
//     },
//     {
//       title: 'Branch',
//       dataIndex: 'branch',
//       key: 'branch',
//     },
//     {
//       title: 'Date & Time',
//       dataIndex: 'createdAt',
//       key: 'createdAt',
//       render: (date) => new Date(date).toLocaleString(),
//     },
//   ];

//   return (
//     <Card
//       title="Transaction History"
//       extra={
//         <div className="flex gap-3">
//           <Button
//             type="primary"
//             icon={<DownloadOutlined />}
//             onClick={() => downloadTransaction(data)}
//             className="!bg-emerald-600 !font-semibold"
//           >
//             Download
//           </Button>
//           <Button
//             type="primary"
//             icon={<PrinterOutlined />}
//             onClick={handlePrint(data)}
//             className="!bg-blue-500 !font-semibold"
//           >
//             Print
//           </Button>
//         </div>
//       }
//       style={{ overflowX: 'auto' }}
//     >
//       {/* Date Range and Account Number Filter Form */}
//       <Form
//         form={filterForm}
//         layout="inline"
//         onFinish={onFinish}
//         className="mb-4 flex flex-wrap gap-2 items-center"
//       >
//         <Item
//           name="fromDate"
//           rules={[{ required: true, message: 'Please select from date' }]}
//         >
//           <DatePicker placeholder="From Date" />
//         </Item>

//         <Item
//           name="toDate"
//           rules={[{ required: true, message: 'Please select to date' }]}
//         >
//           <DatePicker placeholder="To Date" />
//         </Item>

//         {/* If no accountNumber prop is passed from parent (e.g., Admin/Employee view), allow typing one */}
//         {!accountNumber && (
//           <Item name="accountNumber">
//             <Input placeholder="Account Number (Optional)" />
//           </Item>
//         )}

//         <Item>
//           <Button
//             type="primary"
//             htmlType="submit"
//             icon={<SearchOutlined />}
//             className="!bg-blue-500 !font-semibold"
//           >
//             Fetch
//           </Button>
//         </Item>
//       </Form>

//       {/* Printable Table Container */}
//       <div>
//         <Table
//           columns={columns}
//           dataSource={data}
//           rowKey="_id"
//           loading={loading}
//           scroll={{ x: 'max-content' }}
//           pagination={{
//             current: page,
//             pageSize: pageSize,
//             total: total,
//             showSizeChanger: true,
//             onChange: (p, ps) => {
//               setPage(p);
//               setPageSize(ps);
//             },
//           }}
//         />
//       </div>
//     </Card>
//   );
// };

// export default TransactionTable;

import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  DatePicker,
  Input,
  Form,
  message,
} from 'antd';
import { PrinterOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { http, handlePrint, downloadTransaction } from '../../../modules/modules';
import Cookies from "universal-cookie";

const cookies = new Cookies();
const { Item } = Form;

const TransactionTable = ({ accountNumber, branch }) => {
  const token = cookies.get("authToken");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterQuery, setFilterQuery] = useState({});

  const [filterForm] = Form.useForm();

  // Fetch transactions with pagination and date filter query
  const fetchTransactions = async (
    currentPage = 1,
    currentLimit = 10,
    filters = {},
    isBackground = false // Prevents loading spinner from flashing on auto-poll
  ) => {
    try {
      if (!isBackground) setLoading(true);
      const httpReq = http(token);
      let url = `/api/transactions/pagination?page=${currentPage}&limit=${currentLimit}`;

      const activeAcc = filters.accountNumber || accountNumber;
      if (activeAcc) {
        url += `&accountNumber=${activeAcc}`;
      }

      if (branch) {
        url += `&branch=${branch}`;
      }

      if (filters.fromDate && filters.toDate) {
        url += `&fromDate=${filters.fromDate}&toDate=${filters.toDate}`;
      }

      const res = await httpReq.get(url);
      setData(res?.data?.data || []);
      setTotal(res?.data?.total || 0);
    } catch (error) {
      if (!isBackground) message.error('Unable to fetch transaction history');
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // Initial load and dependencies trigger
  useEffect(() => {
    fetchTransactions(page, pageSize, filterQuery, false);
  }, [accountNumber, branch, page, pageSize, filterQuery]);

  // LIVE UPDATES: Auto-poll the database every 5 seconds for new transactions in the background
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTransactions(page, pageSize, filterQuery, true); // true = background fetch (no loading flicker)
    }, 5000); // Polls every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [page, pageSize, filterQuery, accountNumber, branch]);

  // Form submit for date range and optional account number filter
  const onFinish = (values) => {
    const formattedFilters = {
      fromDate: values.fromDate ? values.fromDate.format('YYYY-MM-DD') : undefined,
      toDate: values.toDate ? values.toDate.format('YYYY-MM-DD') : undefined,
      accountNumber: values.accountNumber || undefined,
    };

    setFilterQuery(formattedFilters);
    setPage(1);
    fetchTransactions(1, pageSize, formattedFilters, false);
  };

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
        <div className="flex gap-3">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => downloadTransaction(data)}
            className="!bg-emerald-600 !font-semibold"
          >
            Download
          </Button>
          {/* FIXED: Passed as an arrow function so it doesn't trigger automatically on render */}
          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => handlePrint(data)}
            className="!bg-blue-500 !font-semibold"
          >
            Print
          </Button>
        </div>
      }
      style={{ overflowX: 'auto' }}
    >
      {/* Date Range and Account Number Filter Form */}
      <Form
        form={filterForm}
        layout="inline"
        onFinish={onFinish}
        className="mb-4 flex flex-wrap gap-2 items-center"
      >
        <Item
          name="fromDate"
          rules={[{ required: true, message: 'Please select from date' }]}
        >
          <DatePicker placeholder="From Date" />
        </Item>

        <Item
          name="toDate"
          rules={[{ required: true, message: 'Please select to date' }]}
        >
          <DatePicker placeholder="To Date" />
        </Item>

        {!accountNumber && (
          <Item name="accountNumber">
            <Input placeholder="Account Number (Optional)" />
          </Item>
        )}

        <Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            className="!bg-blue-500 !font-semibold"
          >
            Fetch
          </Button>
        </Item>
      </Form>

      {/* Printable Table Container */}
      <div>
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