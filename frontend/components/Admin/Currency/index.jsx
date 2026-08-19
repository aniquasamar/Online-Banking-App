import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import AdminLayout from "../../Layout/AdminLayout";
import { Card, Form, Input, Button, message, Table, Popconfirm } from "antd";
import { trimData, http } from "../../../modules/modules";
import { useEffect, useState } from "react";

const { Item } = Form;

const Currency = () => {
  // states collection
  const [currencyForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [allCurrency, setAllCurrency] = useState([]);
  const [number, setNumber] = useState(0);
  const [edit, setEdit] = useState(null);

  // Get All Currency Data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get('/api/currency');
        setAllCurrency(data.data);
      } catch (error) {
        messageApi.error('Unable to fetch data');
      }
    };

    fetcher();
  }, [number]);

  // create new currency
  const onFinish = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);
      finalObj.key = finalObj.currencyName;

      const httpReq = http();
      await httpReq.post('/api/currency', finalObj);

      messageApi.success('Currency created successfully');
      currencyForm.resetFields();
      setNumber(number + 1);
    } catch (err) {
      if (err?.response?.data?.error?.code === 11000) {
        currencyForm.setFields([
          {
            name: "currencyName",
            errors: ["Currency already exists!"]
          }
        ]);
      } else {
        messageApi.error('Try again later');
      }
    } finally {
      setLoading(false);
    }
  };

  // on edit currency
  const onEditCurrency = async (obj) => {
    setEdit(obj);
    currencyForm.setFieldsValue(obj);
  };

  // on update currency
  const onUpdate = async (values) => {
    try {
      setLoading(true);
      let finalObj = trimData(values);

      const httpReq = http();
      await httpReq.put(`/api/currency/${edit._id}`, finalObj);

      messageApi.success('Currency updated successfully');
      setNumber(number + 1);
      setEdit(null);
      currencyForm.resetFields();
    } catch (error) {
      messageApi.error('Unable to update currency');
    } finally {
      setLoading(false);
    }
  };

  // on delete currency
  const onDeleteCurrency = async (id) => {
    try {
      const httpReq = http();
      await httpReq.delete(`/api/currency/${id}`);

      messageApi.success('Currency deleted successfully');
      setNumber(number + 1);
    } catch (error) {
      messageApi.error('Unable to delete currency');
    }
  };

  // columns for table
  const columns = [
    {
      title: "Currency Name",
      dataIndex: "currencyName",
      key: "currencyName"
    },
    {
      title: "Currency Description",
      dataIndex: "currencyDesc",
      key: "currencyDesc"
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
            onConfirm={() => onEditCurrency(obj)}
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
            onConfirm={() => onDeleteCurrency(obj._id)}
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
        <Card title="Add new currency">
          <Form
            form={currencyForm}
            onFinish={edit ? onUpdate : onFinish}
            layout="vertical"
          >
            <Item
              name="currencyName"
              label="Currency Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            <Item
              label="Currency Description"
              name="currencyDesc"
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
          title="Currency List"
          style={{ overflowX: 'auto' }}
        >
          <Table
            columns={columns}
            dataSource={allCurrency}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Currency;