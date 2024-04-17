import React, {useState, useEffect} from "react";
import {Layout, Modal, Menu, Card, List, Button, Row, Col} from "antd";
import {
    PieChartOutlined,
    MessageOutlined,
    OrderedListOutlined,
    CalendarOutlined,
    CreditCardOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import {useParams, useLocation, Link, useHistory} from 'react-router-dom';
import PrivateRoute from "../PrivateRoute";
import DiscussionBoard from "./DiscussionBoard";
import Maintenance from "./Maintenance";
import CalendarPage from "./Calendar";
import Payment from "./Payment";
import MaintenanceOrder from "./MaintanceOrderThird";
import http from "../libs/http";

const {Header, Content, Sider} = Layout;

const CustomLayout = () => {
    const location = useLocation();
    const history = useHistory();
    const search = new URLSearchParams(location.search)
    const target = search.get('target');
    let desc = search.get('desc');
    const sidebarItems = [
        {key: "/", icon: <PieChartOutlined/>, label: "Dashboard", path: "/"},
        {key: "discussions", icon: <MessageOutlined/>, label: "Discussion Board", path: "/layout/discussions",},
        // {key: "3", icon: <WechatWorkOutlined />, label: "Chat Thread", path: "/chat",},
        {key: "maintenance", icon: <OrderedListOutlined/>, label: "Maintenance Order", path: "/layout/maintenance",},
        {key: "calendar", icon: <CalendarOutlined/>, label: "Calendar Schedule", path: "/layout/calendar",},
        {key: "payment", icon: <CreditCardOutlined/>, label: "Payment Tool", path: "/layout/payment",},
    ];
    if (target) {
        desc = sidebarItems.filter(item => item.key === target)[0].label;
        history.push('/layout/' + target + '?desc=' + desc);
    }
    const role = JSON.parse(localStorage.getItem('login')).role

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Header className="header">
                <div style={{color: "white", fontSize: "1.5em"}}>
                    {desc}
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu mode="inline" defaultSelectedKeys={[target]} style={{height: "100%", borderRight: 0}}>
                        {
                            sidebarItems.filter(item => !['discussions', 'payment', 'calendar'].includes(item.key) || role !== 'third_party').map(item => (
                                <Menu.Item key={item.key} icon={item.icon}><Link to={item.path}>{item.label}</Link></Menu.Item>
                            ))
                        }
                    </Menu>
                </Sider>
                <Layout style={{padding: "0 24px 24px"}}>
                    <Content className="site-layout-background" style={{padding: 24, margin: 0, minHeight: 280,}}>
                        <PrivateRoute path="/layout/discussions" component={DiscussionBoard}/>
                        {/* <Route path="/chat" component={ChatThread} /> */}
                        <PrivateRoute path="/layout/maintenance" component={Maintenance}/>
                        <PrivateRoute path="/layout/calendar" component={CalendarPage}/>
                        <PrivateRoute path="/layout/payment" component={Payment}/>
                        <PrivateRoute path="/layout/maintenanceorder" component={MaintenanceOrder}/>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default CustomLayout;
