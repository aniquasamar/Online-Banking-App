import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AdminLayout from "../../Layout/AdminLayout";
import { Card, Form, Input, Button, message, Table, Popconfirm } from "antd";
import { trimData, http } from "../../../modules/modules";
import { useEffect, useState } from "react";

const { Item } = Form;

const Branch = () => {
  // states collection
  const [branchForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allBranch, setAllBranch] = useState([]);
  const [number, setNumber] = useState(0);
  const [edit, setEdit] = useState(null);

  // Get All Branch Data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get('/api/branch');
        setAllBranch(data.data);
      } catch (error) {
        messageApi.error('Unable to fetch data');
      }
    };

    fetcher();
  }, [number]);

  // create new branch
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.key = finalObj.branchName;

      const httpReq = http();
      await httpReq.post('/api/branch', finalObj);

      messageApi.success('Branch created successfully');
      branchForm.resetFields();
      setNumber(number + 1);
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        branchForm.setFields([
          {
            name: "branchName",
            errors: ["Branch already exists!"]
          }
        ]);
      } else {
        messageApi.error('Try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  // on edit branch
  const onEditBranch = async (obj) => {
    setEdit(obj);
    branchForm.setFieldsValue(obj);
  };

  // on update branch
  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);

      const httpReq = http();
      await httpReq.put(`/api/branch/${edit._id}`, finalObj);

      messageApi.success('Branch updated successfully');
      setNumber(number + 1);
      setEdit(null);
      branchForm.resetFields();
    } catch (error) {
      messageApi.error('Unable to update branch');
    } finally {
      setLoading(false);
    }
  };

  // on delete branch
  const onDeleteBranch = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/branch/${id}`);

      messageApi.success('Branch deleted successfully');
      setNumber(number + 1);
    } catch (error) {
      messageApi.error('Unable to delete branch');
    }
  };

  // columns for table
  const columns = [
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName"
    },
    {
      title: "Branch Address",
      dataIndex: "branchAddress",
      key: "branchAddress"
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, obj) => (
        <div className="flex gap-1">
          <Popconfirm
            title="Are you sure?"
            description="Once you update, you can also re-update!"
            onCancel={() => messageApi.info("No changes occur")}
            onConfirm={() => onEditBranch(obj)}
          >
            <Button
              type="text"
              className="!bg-green-100 !text-green-500"
              icon={<EditOutlined />}
            />
          </Popconfirm>

          <Popconfirm
            title="Are you sure?"
            description="Once you delete, you cannot restore!"
            onCancel={() => messageApi.info("Your data is safe")}
            onConfirm={() => onDeleteBranch(obj._id)}
          >
            <Button
              type="text"
              className="!bg-red-100 !text-red-500"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      )
    },
  ];

  return (
    <AdminLayout>
      {context}
      <div className="grid md:grid-cols-3 gap-3">
        <Card title="Add new branch">
          <Form
            form={branchForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            <Item
              name="branchName"
              label="Branch Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            <Item
              label="Branch Address"
              name="branchAddress"
              rules={[{ required: true }]}
            >
              <Input.TextArea />
            </Item>

            <Item>
              {edit ? (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-rose-500 !text-white !font-bold !w-full"
                >
                  Update
                </Button>
              ) : (
                <Button
                  loading={loading}
                  type="text"
                  htmlType="submit"
                  className="!bg-blue-500 !text-white !font-bold !w-full"
                >
                  Submit
                </Button>
              )}
            </Item>
          </Form>
        </Card>

        <Card
          className="md:col-span-2"
          title="Branch List"
          style={{ overflowX: 'auto' }}
        >
          <Table
            columns={columns}
            dataSource={allBranch}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Branch;