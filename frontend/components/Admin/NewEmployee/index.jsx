import { DeleteOutlined, EditOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import AdminLayout from "../../Layout/AdminLayout";
import {Card , Form , Input , Button , Table} from "antd";

const {Item} = Form;

const NewEmployee = () => {

    const columns = [
        {
            title : "Profile",
            key : "profile"
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
            render : () => (
                <div className="flex gap-1">
                    <Button 
                    type="text"
                    className="!bg-pink-100 !text-pink-500"
                    icon={<EyeInvisibleOutlined />}
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
            <div className="grid md:grid-cols-3 gap-3">
                <Card 
                title="Add new employee">
                    <Form layout="vertical">
                        <Item
                        label="Profile"
                        name="xyz">
                            <Input type="file" />
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
                title="Employee List">
                    <Table 
                    columns={columns}
                    dataSource={[{},{}]}/>
                </Card>
            </div>
        </AdminLayout>
    )
}

export default NewEmployee;