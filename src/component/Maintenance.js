import React, {useEffect, useState} from "react";
import {Layout, Menu, Checkbox, Button, List, Typography, message, Modal, DatePicker, Input, Form, Upload, Radio} from "antd";
import {
    PlusCircleOutlined,
    ShoppingCartOutlined, VerticalAlignTopOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import http from "../libs/http";

const {Header, Sider, Content} = Layout;

const Maintenance = () => {
    const [form] = Form.useForm();
    const initialValues = {
        subject: null,
        content: null,
        reply: null,
        completed: null
    }
    // const handlePlaceOrderClick = () => {
    //     history.push({
    //         pathname: "/layout/payment",
    //         state: {purpose: "Maintenance", amount: totalAmount},
    //     }); // Navigate to the payment page
    // };

    // const objects = [
    //     {id: 1, name: "Object 1", price: 100},
    //     {id: 2, name: "Object 2", price: 150},
    //     {id: 3, name: "Object 3", price: 200},
    //     {id: 4, name: "Object 4", price: 250},
    //     {id: 5, name: "Object 5", price: 300},
    //     {id: 6, name: "Object 6", price: 350},
    //     {id: 7, name: "Object 7", price: 400},
    // ];

    // State for selected items
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalVisiable, setModalVisiable] = useState(false);

    // Function to handle item selection
    const onItemSelect = (id) => {
        setSelectedItems((prevSelectedItems) => {
            if (prevSelectedItems.includes(id)) {
                return prevSelectedItems.filter((item) => item !== id);
            } else {
                return [...prevSelectedItems, id];
            }
        });
    };

    const [maintenanceList, setMaintenanceList] = useState([]);
    // Calculate total amount
    // const totalAmount = maintenanceList && maintenanceList.length ? maintenanceList.reduce((sum, itemId) => {
    //     const item = maintenanceList.find(obj => obj.id === itemId);
    //     return sum + item.price;
    // }, 0) : 0;
    const loadData = () => {
        const role = JSON.parse(localStorage.getItem('login')).role
        if (role === 'third_party') {
            http.post('http://localhost:8080/allmaintenances', {completed: true})
            .then(res => {
                setMaintenanceList(res)
            })
            .catch(err => console.error(err))
        } else {
            http.post('http://localhost:8080/mymaintenances', {completed: true})
            .then(res => {
                setMaintenanceList(res)
            })
            .catch(err => console.error(err))
        }
    }
    const handleOk = () => {
        const data = form.getFieldsValue();
        // data.completed = JSON.parse(data.completed)
        data.completed = true
        data.reply = ''
        http.post('http://localhost:8080/maintenance', data)
        .then(res => {
            setModalVisiable(false)
            form.setFieldsValue({
                subject: null,
                content: null,
                reply: null,
                completed: null
            })
            loadData()
        })
        .catch(err => console.error(err))
    }
    const handleCancel = () => {
        setModalVisiable(false);
    };

    useEffect(() => {
        loadData()
    }, [])
    const role = JSON.parse(localStorage.getItem('login')).role
    return (
        <Content style={{margin: "24px 16px", padding: 24, background: "#fff"}}>
            <Button type="primary" onClick={setModalVisiable} shape="round" icon={<PlusCircleOutlined/>} /* Make sure to import PlusCircleOutlined from '@ant-design/icons' */ style={{
                color: "#ffffff",
                marginBottom: "16px",
            }}>
                Add Maintenance
            </Button>
            <Modal title="Add Maintenance" visible={modalVisiable} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} initialValues={initialValues} labelCol={{span: 6}} wrapperCol={{span: 14}}>
                    <Form.Item name="subject" label="Subject">
                        <Input/>
                    </Form.Item>
                    <Form.Item name="content" label="Content">
                        <Input/>
                    </Form.Item>
                    {/*<Form.Item name="reply" label="Reply">*/}
                    {/*    <Input/>*/}
                    {/*</Form.Item>*/}
                    {/*<Form.Item name="completed" label="Completed" rules={[{required: true, message: "Please input your Content!",},]}>*/}
                    {/*    <Radio.Group onChange={e => initialValues.completed === (e.target.value === 'true')} value={initialValues.completed}>*/}
                    {/*        <Radio value="true">True</Radio>*/}
                    {/*        <Radio value="false">False</Radio>*/}
                    {/*    </Radio.Group>*/}
                    {/*</Form.Item>*/}
                </Form>
            </Modal>
            <List
                header={<div>Select Objects</div>}
                bordered
                dataSource={maintenanceList}
                renderItem={(item) => (
                    <List.Item>
                        <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onChange={() => onItemSelect(item.id)}>
                            {`${item.username} - ${item.subject} - ${item.content}`}
                        </Checkbox>
                    </List.Item>
                )}/>
            {/*<div style={{marginTop: 16, display: "flex", justifyContent: "space-between",}}>*/}
            {/*    <Typography.Text>Total amount: ${totalAmount}</Typography.Text>*/}
            {/*    {*/}
            {/*        role === 'third_party' ? '' :*/}
            {/*            <Button type="primary" onClick={handlePlaceOrderClick} icon={<ShoppingCartOutlined/>} style={{*/}
            {/*                backgroundColor: "#1890ff",*/}
            {/*                borderColor: "#1890ff",*/}
            {/*                color: "#ffffff",*/}
            {/*                fontSize: "16px",*/}
            {/*            }}>*/}
            {/*                Place Order*/}
            {/*            </Button>*/}
            {/*    }*/}
            {/*</div>*/}
        </Content>
    )
        ;
};

export default Maintenance;
