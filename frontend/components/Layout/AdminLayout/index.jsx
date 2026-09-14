import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DashboardOutlined,
    SwapOutlined,
    LogoutOutlined,
    GiftOutlined,
    BranchesOutlined,
    DollarCircleOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const { Header, Sider, Content } = Layout;
const cookies = new Cookies();

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    console.log(pathname);

    const logoutFunc = () => {
        sessionStorage.removeItem('userInfo');
        cookies.remove('authToken');
        navigate('/');
    };

    const items = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: <Link to="/admin">Dashboard</Link>,
        },
        {
            key: '/admin/branding',
            icon: <GiftOutlined />,
            label: <Link to="/admin/branding">Branding</Link>,
        },
        // In sidebar navigation items array:
        {
            key: '/admin/branch',
            icon: <BranchesOutlined />,
            label: <Link to="/admin/branch">Branch</Link>,
        },
        {
            key: '/admin/currency',
            icon: <DollarCircleOutlined />,
            label: <Link to="/admin/currency">Currency</Link>,
        },
        {
            key: '/admin/new-employee',
            icon: <UserOutlined />,
            label: <Link to="/admin/new-employee">New Employee</Link>,
        },
        {
            key: '/admin/new-account',
            icon: <UserAddOutlined />,
            label: <Link to="/admin/new-account">New Account</Link>,
        },
        {
            key: '/admin/new-transaction',
            icon: <SwapOutlined />,
            label: <Link to="/admin/new-transaction">New Transaction</Link>,
        },
        {
            key: '/admin/logout',
            icon: <LogoutOutlined />,
            label: (
                <Button
                    type="text"
                    className="!text-gray-300 !font-semibold"
                    onClick={logoutFunc}
                >
                    Logout
                </Button>
            ),
        },
    ]
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout className='!min-h-screen'>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={[pathname]}
                    items={items}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;