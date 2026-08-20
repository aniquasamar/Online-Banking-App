import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const EmployeeLayout = ({ children }) => {
  const items = [
    {
      key: '/employee',
      icon: <DashboardOutlined />,
      label: <Link to="/employee">Dashboard</Link>,
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Sider>
        <div className="p-4 text-white text-lg font-bold">Banking App</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/employee']}
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="bg-white p-4" />
        <Content className="m-4 p-4 bg-white min-h-[280px]">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployeeLayout;