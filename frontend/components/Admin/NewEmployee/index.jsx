import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import AdminLayout from "../../Layout/AdminLayout";
import {Card, Form, Input, Button, message, Table, Image, Popconfirm, Select} from "antd";
import { trimData , http , fetchData } from "../../../modules/modules";
import swal from "sweetalert";
import useSWR from "swr";
import { useEffect, useState } from "react";


const {Item} = Form;

const NewEmployee = () => {

    //states collection
    const [empForm] = Form.useForm();
    const [messageApi, context] = message.useMessage();
    const [loading,setLoading] = useState(false);
    const [photo,setPhoto] = useState(null);
    const [edit, setEdit] = useState(null);
    const [allEmployee,setAllEmployee] = useState([]);
    const [finalEmployee, setFinalEmployee] = useState([]);
    const [allBranch, setAllBranch] = useState([]);
    const [number, setNumber] = useState(0);
    
    // Get Branch Data via SWR
    const { data: branches, error: bError } = useSWR('/api/branch', fetchData, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        refreshInterval: 10000
    });

    // Prepare branch options for Select component
    useEffect(() => {
        if (branches) {
            let filter = branches?.data?.map((item) => ({
                label: item.branchName,
                value: item.branchName,
                key: item.key
            }));
            setAllBranch(filter);
        }
    }, [branches]);

    // Get All Employee Data
    useEffect(() => {
    const fetcher = async () => {
        try {
            const httpReq = http();
            const { data } = await httpReq.get('/api/users');
            setAllEmployee(data.data);
            setFinalEmployee(data.data);
        } catch (error) {
            messageApi.error('Unable to fetch data');
        }
    };

    fetcher();
    }, [number]);

    //create new employee
    const onFinish = async (values) => {
        try{
            setLoading(true);
            let finalObj = trimData(values);
            finalObj.profile = photo ? photo : "bankImages/dummy.jpg";
            finalObj.key = finalObj.email;
            finalObj.userType = "employee";
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
            setNumber(number + 1);
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
    // search coding
    const onSearch = (e) => {
        let value = e.target.value.trim().toLowerCase();
        
        //THIS WAS NOT WORKING SO CHANGED IT TO GEMINI CODE GIVEN BELOW
        // let filter = finalEmployee.filter((emp) => {
        //     if (emp.fullname?.toLowerCase().indexOf(value) !== -1) {
        //         return emp;
        //     } else if (emp.userType?.toLowerCase().indexOf(value) !== -1) {
        //         return emp;
        //     } else if (emp.email?.toLowerCase().indexOf(value) !== -1) {
        //         return emp;
        //     } else if (emp.branch?.toLowerCase().indexOf(value) !== -1) {
        //         return emp;
        //     } else if (emp.mobile?.toString().toLowerCase().indexOf(value) !== -1) {
        //         return emp;
        //     } else if (emp.address?.toLowerCase().indexOf(value) !== -1) {
        //         return emp;
        //     }
        // });

        // 1. If input is empty/cleared, reset table to all records
        if (!value) {
            setAllEmployee(finalEmployee);
            return;
        }

        // 2. Filter using optional fallbacks to avoid undefined crashes
        let filter = finalEmployee.filter((emp) => {
            const fullname = (emp.fullname || "").toLowerCase();
            const userType = (emp.userType || "").toLowerCase();
            const email = (emp.email || "").toLowerCase();
            const branch = (emp.branch || "").toLowerCase();
            const mobile = (emp.mobile ? emp.mobile.toString() : "").toLowerCase();
            const address = (emp.address || "").toLowerCase();

            return (
                fullname.includes(value) ||
                userType.includes(value) ||
                email.includes(value) ||
                branch.includes(value) ||
                mobile.includes(value) ||
                address.includes(value)
            );
        });

  setAllEmployee(filter);
};
    //update isActive button from employee list
    const updateIsActive = async (id, isActive) => {
        try {
            
            const obj = {
              isActive : !isActive,
            };

            const httpReq = http();
            await httpReq.put(`/api/users/${id}`, obj);

            messageApi.success('Record updated successfully');
            setNumber(number + 1);
        } catch (error) {
            messageApi.error('Unable to update isActive !');
        }
    };

    //delete employee from employee list
    const onDeleteUser = async (id) => {
    try {
        const httpReq = http();
        await httpReq.delete(`/api/users/${id}`);

        messageApi.success('Employee deleted successfully!');
        setNumber(number + 1);
    } catch (error) {
        messageApi.error('Unable to delete user');
    }
    };

    //update employee list
    const onEditUser = async (obj) => {
    setEdit(obj);
    empForm.setFieldsValue(obj);
    };

    const onUpdate = async (values) => {
    try {
        setLoading(true);
        let finalObj = trimData(values);

        if (photo) {
        finalObj.profile = photo;
        }

        const httpReq = http();
        await httpReq.put(`/api/users/${edit._id}`, finalObj);

        messageApi.success('Employee updated successfully');
        setNumber(number + 1);
        setEdit(null);
        empForm.resetFields();
    } catch (error) {
        messageApi.error('Unable to update employee');
    } finally {
        setLoading(false);
    }
    };

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
            title: "User Type",
            dataIndex: "userType",
            key: "userType",
            render: (text) => {
                if (text === "admin") {
                    return <span className="text-indigo-500 capitalize">{text}</span>;
                } else if (text === "employee") {
                    return <span className="text-green-500 capitalize">{text}</span>;
                } else {
                    return <span className="text-red-500 capitalize">{text}</span>;
                }
            }
        },
        {
            title: "Branch",
            dataIndex: "branch",
            key: "branch"
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
                    <Popconfirm
                    title="Are you sure?"
                    description="Once you update, you can also re-update!"
                    onCancel={()=>messageApi.info("No changes made!")}
                    onConfirm={()=>updateIsActive(obj._id, obj.isActive)}
                    >
                        <Button 
                        type="text"
                        className={`${obj.isActive ? "!bg-indigo-100 !text-indigo-500" : "!bg-pink-100 !text-pink-500"}`}
                        icon={obj.isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        />
                    </Popconfirm>
                    <Popconfirm
                        title="Are you sure?"
                        description="Once you update you can also re update"
                        onCancel={() => messageApi.info("No changes occur")}
                        onConfirm={() => onEditUser(obj)}
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
                        onCancel={() => messageApi.info('Your data is safe')}
                        onConfirm={() => onDeleteUser(obj._id)}
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
    ]
    return (
        <AdminLayout>
            {context}
            <div className="grid md:grid-cols-3 gap-3">
                <Card 
                title="Add new employee">
                    <Form 
                    form={empForm}
                    onFinish={edit ? onUpdate : onFinish}
                    layout="vertical">

                        <Item
                            label="Select Branch"
                            name="branch"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Select branch"
                                options={allBranch}
                            />
                        </Item>
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
                                <Input disabled = {edit ? true : false}/>
                            </Item>
                        </div>
                        <Item
                        label="Address"
                        name="address">
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
                    title="Employee List"
                    style={{ overflowX: 'auto' }}
                    extra={
                        <div>
                            <Input
                                placeholder="Search by all"
                                prefix={<SearchOutlined />}
                                onChange={onSearch}
                            />
                        </div>
                    }
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