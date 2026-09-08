import React, { useState } from 'react';
import EmployeeLayout from '../../Layout/EmployeeLayout';
import {
  Button,
  Card,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Select,
  Table,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  http,
  uploadFile,
  fetchData,
  trimData,
} from '../../../modules/modules';
import useSWR, {mutate} from 'swr';

const { Item } = Form;

const NewAccount = () => {
  // states collections
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const [messageApi, context] = message.useMessage();
  const [accountModal, setAccountModal] = useState(false);
  const [accountForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);
  const [document, setDocument] = useState(null);
  const [number, setNumber] = useState(0);

  // Get Branding Details for Account Number
  const { data: brandings, error: bError } = useSWR(
    '/api/branding',
    fetchData,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 1200000,
    }
  );
  
  let bankAccountNumber = Number(brandings && brandings?.data[0]?.bankAccountNumber) + 1;
  let brandingId = brandings && brandings?.data[0]?._id;
  
  accountForm.setFieldValue('accountNumber',bankAccountNumber);

  // create new account
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.profile = photo ? photo : 'bankImages/dummy.jpg';
      finalObj.signature = signature ? signature : 'bankImages/dummy.jpg';
      finalObj.document = document ? document : 'bankImages/dummy.jpg';
      finalObj.key = finalObj.email;
      finalObj.userType = 'customer';
      finalObj.branch = userInfo?.branch;
      finalObj.createdBy = userInfo?.email;

      const httpReq = http();

      await httpReq.post('/api/users', finalObj);
      const obj = {
        email: finalObj.email,
        password: finalObj.password
      };
      await httpReq.post('/api/customers', finalObj);
      await httpReq.post(`/api/send-email`, obj);
      await httpReq.put(`/api/branding/${brandingId}`, {bankAccountNumber});
      accountForm.resetFields();
      mutate("/api/branding");
      setPhoto(null);
      setSignature(null);
      setDocument(null);
      setNumber(number + 1);
      messageApi.success('Account Created');
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        accountForm.setFields([
          {
            name: 'email',
            errors: ['Email already exists!'],
          },
        ]);
      } else {
        messageApi.error('Try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  // handle photo upload
  const handlePhoto = async (e) => {
    let file = e.target.files[0];
    const folderName = 'customerPhoto';

    try {
      const result = await uploadFile(file, folderName);
      setPhoto(result.filePath);
    } catch (err) {
      messageApi.error('Upload failed');
    }
  };

  // handle signature upload
  const handleSignature = async (e) => {
    let file = e.target.files[0];
    const folderName = 'customerSignature';

    try {
      const result = await uploadFile(file, folderName);
      setSignature(result.filePath);
    } catch (err) {
      messageApi.error('Upload failed');
    }
  };

  // handle document upload
  const handleDocument = async (e) => {
    let file = e.target.files[0];
    const folderName = 'customerDocument';

    try {
      const result = await uploadFile(file, folderName);
      setDocument(result.filePath);
    } catch (err) {
      messageApi.error('Upload failed');
    }
  };

  // columns for table
  const columns = [
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'User Type',
      dataIndex: 'userType',
      key: 'userType',
      render: (text) => {
        if (text === 'admin') {
          return <span className="text-indigo-500 capitalize">{text}</span>;
        } else if (text === 'employee') {
          return <span className="text-green-500 capitalize">{text}</span>;
        } else {
          return <span className="text-red-500 capitalize">{text}</span>;
        }
      },
    },
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
    },
    {
      title: 'Fullname',
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: 'DOB',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Photo',
      dataIndex: 'photo',
      key: 'photo',
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: 'Signature',
      dataIndex: 'signature',
      key: 'signature',
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.signature}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: 'Document',
      dataIndex: 'document',
      key: 'document',
      render: (src, obj) => (
        <Image
          src={`${import.meta.env.VITE_BASEURL}/${obj.document}`}
          className="rounded-full"
          width={40}
          height={40}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure?"
            description="Once you update, you can also re-update!"
          >
            <Button
              type="text"
              className={`${
                obj.isActive
                  ? '!bg-indigo-100 !text-indigo-500'
                  : '!bg-pink-100 !text-pink-500'
              }`}
              icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure?"
            description="Once you update you can also re update"
          >
            <Button
              type="text"
              className="!bg-green-100 !text-green-500"
              icon={<EditOutlined />}
            />
          </Popconfirm>
          <Popconfirm
            title="Are you sure?"
            description="Once you deleted you can not restore"
          >
            <Button
              type="text"
              className="!bg-red-100 !text-red-500"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <EmployeeLayout>
      {context}
      <div className="grid">
        <Card
          title="Account List"
          extra={
            <div className="flex gap-x-3">
              <Input placeholder="Search by all" prefix={<SearchOutlined />} />
              <Button
                type="text"
                className="!font-bold !bg-blue-500 !text-white"
                onClick={() => setAccountModal(true)}
              >
                Add New Account
              </Button>
            </div>
          }
          style={{ overflowX: 'auto' }}
        >
          <Table
            columns={columns}
            dataSource={[]}
            scroll={{ x: 'max-content' }}
          />
        </Card>

        <Modal
          title="Open New Account"
          open={accountModal}
          onCancel={() => setAccountModal(false)}
          width={820}
          footer={null}
        >
          <Form form={accountForm} layout="vertical" onFinish={onFinish}>
            <div className="grid md:grid-cols-3 gap-x-3">
              <Item
                label="Account Number"
                name="accountNumber"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter Account Number" disabled />
              </Item>

              <Item
                label="Full Name"
                name="fullname"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter Full Name" />
              </Item>

              <Item
                label="Mobile"
                name="mobile"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter Mobile" />
              </Item>

              <Item
                label="Father Name"
                name="fatherName"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter Father Name" />
              </Item>

              <Item
                label="Email"
                name="email"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter Email" />
              </Item>

              <Item
                label="Password"
                name="password"
                rules={[{ required: true }]}
              >
                <Input placeholder="Enter Password" />
              </Item>

              <Item
                label="DOB"
                name="dob"
                rules={[{ required: true }]}
              >
                <Input type="date" className="w-full" />
              </Item>

              <Item
                label="Gender"
                name="gender"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Gender"
                  options={[
                    { label: 'Male', value: 'male' },
                    { label: 'Female', value: 'female' },
                  ]}
                />
              </Item>

              <Item
                label="Currency"
                name="currency"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Currency"
                  options={[
                    { label: 'INR', value: 'inr' },
                    { label: 'USD', value: 'usd' },
                  ]}
                />
              </Item>

              <Item label="Photo" name="photo">
                <Input type="file" onChange={handlePhoto} />
              </Item>

              <Item label="Signature" name="signature">
                <Input type="file" onChange={handleSignature} />
              </Item>

              <Item label="Document" name="document">
                <Input type="file" onChange={handleDocument} />
              </Item>
            </div>

            <Item
              label="Address"
              name="address"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Item>

            <Item className="flex justify-end items-center">
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!font-bold !bg-blue-500 !text-white"
              >
                Submit
              </Button>
            </Item>
          </Form>
        </Modal>
      </div>
    </EmployeeLayout>
  );
};

export default NewAccount;

// import React, { useState } from 'react';
// import EmployeeLayout from '../../Layout/EmployeeLayout';
// import {
//   Button,
//   Card,
//   DatePicker,
//   Form,
//   Image,
//   Input,
//   Modal,
//   Popconfirm,
//   Select,
//   Table,
// } from 'antd';
// import {
//   DeleteOutlined,
//   EditOutlined,
//   EyeInvisibleOutlined,
//   EyeOutlined,
//   SearchOutlined,
// } from '@ant-design/icons';

// const { Item } = Form;

// const NewAccount = () => {
//   // states collections
//   const [accountModal, setAccountModal] = useState(false);
//   const [accountForm] = Form.useForm();

//   const onFinish = (values) => {
//     console.log(values);
//   };

//   // columns for table
//   const columns = [
//     {
//       title: 'Branch',
//       dataIndex: 'branch',
//       key: 'branch',
//     },
//     {
//       title: 'User Type',
//       dataIndex: 'userType',
//       key: 'userType',
//       render: (text) => {
//         if (text === 'admin') {
//           return <span className="text-indigo-500 capitalize">{text}</span>;
//         } else if (text === 'employee') {
//           return <span className="text-green-500 capitalize">{text}</span>;
//         } else {
//           return <span className="text-red-500 capitalize">{text}</span>;
//         }
//       },
//     },
//     {
//       title: 'Account Number',
//       dataIndex: 'accountNumber',
//       key: 'accountNumber',
//     },
//     {
//       title: 'Fullname',
//       dataIndex: 'fullname',
//       key: 'fullname',
//     },
//     {
//       title: 'DOB',
//       dataIndex: 'dob',
//       key: 'dob',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//       key: 'email',
//     },
//     {
//       title: 'Mobile',
//       dataIndex: 'mobile',
//       key: 'mobile',
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//       key: 'address',
//     },
//     {
//       title: 'Photo',
//       dataIndex: 'photo',
//       key: 'photo',
//       render: (src, obj) => (
//         <Image
//           src={`${import.meta.env.VITE_BASEURL}/${obj.photo}`}
//           className="rounded-full"
//           width={40}
//           height={40}
//         />
//       ),
//     },
//     {
//       title: 'Signature',
//       dataIndex: 'signature',
//       key: 'signature',
//       render: (src, obj) => (
//         <Image
//           src={`${import.meta.env.VITE_BASEURL}/${obj.signature}`}
//           className="rounded-full"
//           width={40}
//           height={40}
//         />
//       ),
//     },
//     {
//       title: 'Document',
//       dataIndex: 'document',
//       key: 'document',
//       render: (src, obj) => (
//         <Image
//           src={`${import.meta.env.VITE_BASEURL}/${obj.document}`}
//           className="rounded-full"
//           width={40}
//           height={40}
//         />
//       ),
//     },
//     {
//       title: 'Action',
//       key: 'action',
//       fixed: 'right',
//       render: (_, obj) => (
//         <div className="flex gap-1">
//           <Popconfirm
//             title="Are you sure?"
//             description="Once you update, you can also re-update!"
//           >
//             <Button
//               type="text"
//               className={`${
//                 obj.isActive
//                   ? '!bg-indigo-100 !text-indigo-500'
//                   : '!bg-pink-100 !text-pink-500'
//               }`}
//               icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//             />
//           </Popconfirm>
//           <Popconfirm
//             title="Are you sure?"
//             description="Once you update you can also re update"
//           >
//             <Button
//               type="text"
//               className="!bg-green-100 !text-green-500"
//               icon={<EditOutlined />}
//             />
//           </Popconfirm>
//           <Popconfirm
//             title="Are you sure?"
//             description="Once you deleted you can not restore"
//           >
//             <Button
//               type="text"
//               className="!bg-red-100 !text-red-500"
//               icon={<DeleteOutlined />}
//             />
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <EmployeeLayout>
//       <div className="grid">
//         <Card
//           title="Account List"
//           extra={
//             <div className="flex gap-x-3">
//               <Input placeholder="Search by all" prefix={<SearchOutlined />} />
//               <Button
//                 type="text"
//                 className="!font-bold !bg-blue-500 !text-white"
//                 onClick={() => setAccountModal(true)}
//               >
//                 Add New Account
//               </Button>
//             </div>
//           }
//           style={{ overflowX: 'auto' }}
//         >
//           <Table
//             columns={columns}
//             dataSource={[]}
//             scroll={{ x: 'max-content' }}
//           />
//         </Card>

//         <Modal
//           title="Open New Account"
//           open={accountModal}
//           onCancel={() => setAccountModal(false)}
//           width={820}
//           footer={null}
//         >
//           <Form
//             form={accountForm}
//             layout="vertical"
//             onFinish={onFinish}
//           >
//             <div className="grid md:grid-cols-3 gap-x-3">
//               <Item
//                 label="Account Number"
//                 name="accountNumber"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Enter Account Number" />
//               </Item>

//               <Item
//                 label="Full Name"
//                 name="fullname"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Enter Full Name" />
//               </Item>

//               <Item
//                 label="Mobile"
//                 name="mobile"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Enter Mobile" />
//               </Item>

//               <Item
//                 label="Father Name"
//                 name="fatherName"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Enter Father Name" />
//               </Item>

//               <Item
//                 label="Email"
//                 name="email"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Enter Email" />
//               </Item>

//               <Item
//                 label="Password"
//                 name="password"
//                 rules={[{ required: true }]}
//               >
//                 <Input placeholder="Enter Password" />
//               </Item>

//               <Item
//                 label="DOB"
//                 name="dob"
//                 rules={[{ required: true }]}
//               >
//                 <DatePicker className="w-full" />
//               </Item>

//               <Item
//                 label="Gender"
//                 name="gender"
//                 rules={[{ required: true }]}
//               >
//                 <Select
//                   placeholder="Select Gender"
//                   options={[
//                     { label: 'Male', value: 'male' },
//                     { label: 'Female', value: 'female' },
//                   ]}
//                 />
//               </Item>

//               <Item
//                 label="Currency"
//                 name="currency"
//                 rules={[{ required: true }]}
//               >
//                 <Select
//                   placeholder="Select Currency"
//                   options={[
//                     { label: 'INR', value: 'inr' },
//                     { label: 'USD', value: 'usd' },
//                   ]}
//                 />
//               </Item>

//               <Item
//                 label="Photo"
//                 name="photo"
//                 rules={[{ required: true }]}
//               >
//                 <Input type="file" />
//               </Item>

//               <Item
//                 label="Signature"
//                 name="signature"
//                 rules={[{ required: true }]}
//               >
//                 <Input type="file" />
//               </Item>

//               <Item
//                 label="Document"
//                 name="document"
//                 rules={[{ required: true }]}
//               >
//                 <Input type="file" />
//               </Item>
//             </div>

//             <Item
//               label="Address"
//               name="address"
//               rules={[{ required: true }]}
//             >
//               <Input.TextArea />
//             </Item>

//             <Item className="flex justify-end items-center">
//               <Button
//                 type="text"
//                 htmlType="submit"
//                 className="!font-semibold !bg-blue-500 !text-white"
//               >
//                 Submit
//               </Button>
//             </Item>
//           </Form>
//         </Modal>
//       </div>
//     </EmployeeLayout>
//   );
// };

// export default NewAccount;