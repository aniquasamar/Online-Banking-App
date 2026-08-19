import React, { useEffect, useState } from 'react';
import AdminLayout from '../../Layout/AdminLayout';
import { Card, Form, Input, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { trimData, http } from '../../../modules/modules';

const { Item } = Form;

const Branding = () => {
  // states collection
  const [bankForm] = Form.useForm();
  const [messageApi, context] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [brandings, setBrandings] = useState(null);
  const [edit, setEdit] = useState(false);
  const [number, setNumber] = useState(0);

  // Get Branding Data
  useEffect(() => {
    const fetcher = async () => {
      try {
        const httpReq = http();
        const { data } = await httpReq.get('/api/branding');
        bankForm.setFieldsValue(data?.data?.[0]);
        setBrandings(data?.data?.[0]);
        setEdit(true);
      } catch (error) {
        messageApi.error('Unable to fetch data');
      }
    };

    fetcher();
  }, [number]);

  // store bank details in database
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);
      finalObj.bankLogo = photo ? photo : "bankImages/dummy.jpg";

      let userInfo = {
        email: finalObj.email,
        fullname: finalObj.fullname,
        password: finalObj.password,
        userType: "admin",
        isActive: true,
        profile: "bankImages/dummy.jpg"
      };

      const httpReq = http();
      await httpReq.post('/api/branding', finalObj);
      await httpReq.post('/api/users', userInfo);

      messageApi.success('Branding created successfully');
      bankForm.resetFields();
      setPhoto(null);
      setNumber(number + 1);
    } catch (error) {
      messageApi.error('Unable to store branding');
    } finally {
      setLoading(false);
    }
  };

  // update bank details in database
  const onUpdate = async (values) => {
    try {
      setLoading(true);
      const finalObj = trimData(values);

      if (photo) {
        finalObj.bankLogo = photo;
      }

      const httpReq = http();
      await httpReq.put(`/api/branding/${brandings._id}`, finalObj);

      messageApi.success('Branding updated successfully');
      bankForm.resetFields();
      setPhoto(null);
      setNumber(number + 1);
    } catch (error) {
      messageApi.error('Unable to update branding');
    } finally {
      setLoading(false);
    }
  };

  // handle upload
  const handleUpload = async (e) => {
    try {
      let file = e.target.files[0];
      const formData = new FormData();
      formData.append("photo", file);
      const httpReq = http();
      const { data } = await httpReq.post("/api/upload", formData);
      setPhoto(data.filePath);
    } catch (err) {
      messageApi.error('Failed');
    }
  };

  return (
    <AdminLayout>
      {context}
      <Card
        title="Bank Details"
        extra={
          <Button
            icon={<EditOutlined />}
            onClick={() => setEdit(!edit)}
          />
        }
      >
        <Form
          form={bankForm}
          layout="vertical"
          disabled={edit}
          onFinish={brandings ? onUpdate : onFinish}
        >
          <div className="grid grid-cols-3 gap-x-3">
            <Item
              label="Bank Name"
              name="bankName"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            <Item
              label="Bank Tagline"
              name="bankTagline"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            <Item
              label="Bank Logo"
              name="xyz"
            >
              <Input onChange={handleUpload} type="file" />
            </Item>

            <Item
              label="Bank Account Number"
              name="bankAccountNumber"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            <Item
              label="Bank Account Transaction ID"
              name="bankTransactionId"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            <Item
              label="Bank Address"
              name="bankAddress"
              rules={[{ required: true }]}
            >
              <Input />
            </Item>

            {/* Admin Info Fields - Hidden if Branding already exists */}
            <div
              className={`${
                brandings
                  ? "hidden"
                  : "md:col-span-3 grid md:grid-cols-3 gap-x-3"
              }`}
            >
              <Item
                label="Admin Full Name"
                name="fullname"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input />
              </Item>

              <Item
                label="Admin Email"
                name="email"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input />
              </Item>

              <Item
                label="Admin Password"
                name="password"
                rules={[{ required: brandings ? false : true }]}
              >
                <Input.Password />
              </Item>
            </div>

            <Item
              label="Bank Linkedin"
              name="bankLinkedin"
            >
              <Input type="url" />
            </Item>

            <Item
              label="Bank Twitter"
              name="bankTwitter"
            >
              <Input type="url" />
            </Item>

            <Item
              label="Bank Facebook"
              name="bankFacebook"
            >
              <Input type="url" />
            </Item>
          </div>

          <Item
            label="Bank Description"
            name="bankDesc"
          >
            <Input.TextArea />
          </Item>

          <Item className="flex justify-end items-center">
            {brandings ? (
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-rose-500 !text-white !font-bold"
              >
                Update
              </Button>
            ) : (
              <Button
                loading={loading}
                type="text"
                htmlType="submit"
                className="!bg-blue-500 !text-white !font-bold"
              >
                Submit
              </Button>
            )}
          </Item>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default Branding;