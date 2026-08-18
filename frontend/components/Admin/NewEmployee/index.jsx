import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import AdminLayout from "../../Layout/AdminLayout";
import {Card, Form, Input, Button, message, Table, Image} from "antd";
import { trimData , http } from "../../../modules/modules";
import swal from "sweetalert";
import { useEffect, useState } from "react";


const {Item} = Form;

const NewEmployee = () => {

    //states collection
    const [empForm] = Form.useForm();
    const [messageApi, context] = message.useMessage();
    const [loading,setLoading] = useState(false);
    const [photo,setPhoto] = useState(null);
    const [allEmployee,setAllEmployee] = useState([]);
    
    // Get All Employee Data
    useEffect(() => {
    const fetcher = async () => {
        try {
            const httpReq = http();
            const { data } = await httpReq.get('/api/users');
            setAllEmployee(data.data);
        } catch (error) {
            messageApi.error('Unable to fetch data');
        }
    };

    fetcher();
    }, []);

    //create new employee
    const onFinish = async (values) => {
        try{
            setLoading(true);
            let finalObj = trimData(values);
            finalObj.profile = photo ? photo : "bankImages/dummy.jpg";
            const httpReq = http();      //for token request or without token request
            const {data} = await httpReq.post(`/api/users`,finalObj);

            const obj = {
                email: finalObj.email,
                password: finalObj.password
            };
            const res = await httpReq.post(`/api/send-email`,obj);

            messageApi.success('Employee Created');
            empForm.resetFields();
            setPhoto(null);
        }catch(err){
            if(err?.response?.data?.error?.code === 11000){
                empForm.setFields([
                    {
                        name: "email",
                        errors: ["Email already exists!"]
                    }
                ])
            }else{
                messageApi.error('Try again later');
                
            }
        }finally{
            setLoading(false);
        }
    } 

    //handle upload 
    const handleUpload = async (e) => {
        try{
            let file = e.target.files[0];
            const formData = new FormData();
            formData.append("photo" , file);
            const httpReq = http();
            const {data} = await httpReq.post("/api/upload" , formData);
            setPhoto(data.filePath);
        }catch(err){
            messageApi.error('Failed');
        }
    }

    //columns for table
    const columns = [
        {
            title : "Profile",
            dataIndex: 'profile',
            key : "profile",
            render: (src, obj) => (
            <Image
                src={`${import.meta.env.VITE_BASEURL}/${obj.profile}`}
                className="rounded-full"
                width={40}
                height={40}
            />
            )
        },
        {
            title : "Fullname",
            dataIndex : "fullname",
            key : "fullname"
        },
        {
            title : "Email",
            dataIndex :"email",
            key : "email"
        },
        {
            title : "Address",
            dataIndex : "address",
            key : "address"
        },
        {
            title : "Mobile",
            dataIndex : "mobile",
            key : "mobile"
        },
        {
            title : "Action",
            key : "action",
            fixed : "right",
            render : (_, obj) => (
                <div className="flex gap-1">
                    <Button 
                    type="text"
                    className={`${obj.isActive ? "!bg-indigo-100 !text-indigo-500" : "!bg-pink-100 !text-pink-500"}`}
                    icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    />
                    <Button 
                    type="text"
                    className="!bg-green-100 !text-green-500"
                    icon={<EditOutlined />}
                    />
                    <Button 
                    type="text"
                    className="!bg-red-100 !text-red-500"
                    icon={<DeleteOutlined />}
                    />
                </div>
            )
        },
    ]
    return (
        <AdminLayout>
            {context}
            <div className="grid md:grid-cols-3 gap-3">
                <Card 
                title="Add new employee">
                    <Form 
                    form={empForm}
                    onFinish={onFinish}
                    layout="vertical">
                        <Item
                        label="Profile"
                        name="xyz">
                            <Input onChange={handleUpload} type="file" />
                        </Item>
                        <div className="grid md:grid-cols-2 gap-x-2">
                            <Item
                            name="fullname"
                            label="Fullname"
                            rules={[{required:true}]}>
                                <Input />
                            </Item>
                            <Item
                            name="mobile"
                            label="Mobile"
                            rules={[{required:true}]}>
                                <Input type="number"/>
                            </Item>
                            <Item
                            name="email"
                            label="Email"
                            rules={[{required:true}]}>
                                <Input />
                            </Item>
                            <Item
                            name="password"
                            label="Password"
                            rules={[{required:true}]}>
                                <Input />
                            </Item>
                        </div>
                        <Item
                        label="Address"
                        name="address">
                            <Input.TextArea />
                        </Item>
                        <Item>
                            <Button
                            loading={loading}
                            type="text"
                            htmlType="submit"
                            className="!bg-blue-500 !text-white !font-bold !w-full">
                                Submit
                            </Button>
                        </Item>
                    </Form>
                </Card>
                    <Card 
                    className="md:col-span-2"
                    title="Employee List"
                    style={{ overflowX: 'auto' }}
                    >
                    <Table 
                    columns={columns}
                    dataSource={allEmployee}
                    scroll={{ x: 'max-content' }}
                    />
                </Card>
            </div>
        </AdminLayout>
    )
}

export default NewEmployee;