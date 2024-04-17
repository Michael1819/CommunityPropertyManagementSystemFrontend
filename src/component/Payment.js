import React, {useState, useEffect} from "react";
import {
    Layout,
    Menu,
    Form,
    Input,
    Select,
    Button,
    Table,
    Typography,
} from "antd";
import {
    CreditCardOutlined,
} from "@ant-design/icons";
import {Link, useLocation} from "react-router-dom";
import http from "../libs/http";

const {Header, Content, Sider} = Layout;
const {Option} = Select;
const {Title} = Typography;

const Payment = () => {
    const location = useLocation(); // Use location to access the state passed through react-router
    const [form] = Form.useForm();

    // State to keep track of whether we've set initial form values
    const [initialValues = {
        id: null,
        username: null,
        item: null,
        apartment_number: null,
        amount: null,
        payment_time: null,
    }, setInitialValues] = useState(false);
    const [paymentList, setPaymentList] = useState(false);

    // const payments = [
    //     {key: "1", date: "2023-01-01", amount: "$500", purpose: "Rent",},
    //     {key: "2", date: "2023-02-01", amount: "$500", purpose: "Rent",},
    //     {key: "3", date: "2023-02-09", amount: "$95.20", purpose: "Parking",},
    //     {key: "4", date: "2023-03-01", amount: "$500", purpose: "Rent",},
    //     {key: "5", date: "2023-04-01", amount: "$500", purpose: "Rent",},
    //     {key: "6", date: "2023-04-15", amount: "$120", purpose: "Cleaning Fee",},
    //     {key: "7", date: "2023-05-01", amount: "$500", purpose: "Rent",},
    // ];

    // Columns configuration for the payment history table
    const columns = [
        {title: "Date", dataIndex: "payment_time", key: "payment_time",},
        {title: "Item", dataIndex: "item", key: "item",},
        {title: "Amount", dataIndex: "amount", key: "amount",},
        {title: "Apartment Number", dataIndex: "apartment_number", key: "apartment_number",},
    ];

    const paginationConfig = {
        pageSize: 10,
    };

    const loadData = () => {
        http.get('http://localhost:8080/payment')
        .then(res => {
            setPaymentList(res)
        })
        .catch(err => console.error(err))
    }

    useEffect(() => {
        // Check if there's state passed to this component (from the Maintenance page)
        loadData()
    }, [location, form]);

    const createPayment = () => {
        const data = form.getFieldsValue()
        data.amount = Number(data.amount)
        http.post('http://localhost:8080/payment', data)
        .then(res => {
            loadData()
            window.history.back()
        })
        .catch(err => console.error(err))
    }
    return (
        <Content className="site-layout-background" style={{padding: 24, margin: 0, minHeight: 280}}>
            <Form layout="vertical" form={form} initialValues={initialValues}>
                {/*<Form.Item label="Name" name="username">*/}
                {/*    <Input placeholder="Enter your name"/>*/}
                {/*</Form.Item>*/}
                <Form.Item label="Apartment Number" name="apartment_number">
                    <Input placeholder="Enter your apartment number"/>
                </Form.Item>
                <Form.Item label="Purpose of Payment" name="item">
                    <Select placeholder="Select a purpose">
                        <Option value="rent">Rent</Option>
                        <Option value="maintenance">Maintenance</Option>
                        <Option value="parking">Parking</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Amount Due" name="amount">
                    <Input prefix="$" placeholder="Amount"/>
                </Form.Item>
                <Button type="primary" onClick={createPayment} icon={<CreditCardOutlined/>}
                    style={{
                        backgroundColor: "#1890ff",
                        borderColor: "#52c41a",
                        color: "#ffffff",
                        fontSize: "16px",
                    }}>
                    Make Payment
                </Button>
            </Form>
            <Title level={2} style={{marginTop: "24px"}}>
                Payment History
            </Title>
            <Table columns={columns} dataSource={paymentList} pagination={paginationConfig} style={{marginTop: 24}}/>
        </Content>
    );
};

export default Payment;
