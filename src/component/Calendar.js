import React, {useEffect, useState} from "react";
import {
    Tooltip,
    Layout,
    Menu,
    Calendar as AntCalendar,
    List,
    Card,
    Modal,
    Input,
    DatePicker,
    Button,
} from "antd";
import {
    EditOutlined,
    DeleteOutlined, PlusCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import http from "../libs/http";

const {Header, Content, Sider} = Layout;

const CalendarPage = () => {
    // const [currentMonth, setCurrentMonth] = useState(moment());

    const [modalVisible, setModalVisible] = useState(false);
    const [events, setEvents] = useState([]);
    const [event, setEvent] = useState({
        facility_name: null,
        reservation_date: null
    });

    // // Example events
    // const [events, setEvents] = useState([
    //     {id: 1, date: "2024-04-05", title: "Rent Payment Due"},
    //     {id: 2, date: "2024-04-20", title: "Meeting with John"},
    //     {id: 3, date: "2024-04-25", title: "No water from 1 to 3pm"},
    // ]);

    // Function to open the modal
    const showModal = () => {
        setModalVisible(true);
    };

    // Function to handle Ok button in the modal
    const handleOk = () => {
        if (event.id) {
            http.post('http://localhost:8080/reservation', {
                facility_name: event.facility_name,
                reservation_date: event.reservation_date,
                remark: event.facility_name,
                start_hour: 9,
                end_hour: 12,
            })
            .then(res => {
                setEvent({});
                setModalVisible(false);
                loadData()
            })
            .catch(err => console.error(err))
        } else {
            http.post('http://localhost:8080/reservation', {
                facility_name: event.facility_name,
                reservation_date: event.reservation_date,
                remark: event.facility_name,
                start_hour: 9,
                end_hour: 12,
            })
            .then(res => {
                setEvent({});
                setModalVisible(false);
                loadData()
            })
            .catch(err => console.error(err))
        }
    };
    // Function to handle Cancel button in the modal
    const handleCancel = () => {
        setModalVisible(false);
    };

    // Function to cancel an event
    const editEvent = event => {
        setEvent({...event, reservation_date_a: moment(event.reservation_date, "YYYY-MM-DD")})
        setModalVisible(true);
    };
    const removeEvent = id => {
        http.put('http://localhost:8080/reservation', {id: id})
        .then(res => {
            setModalVisible(false);
            loadData()
        })
        .catch(err => console.error(err))
    };
    const setData = (key, value) => {
        if (!value) {
            return
        }
        if (key === 'reservation_date') {
            setEvent({...event, reservation_date_a: value, reservation_date: value.format("YYYY-MM-DD")});
        } else {
            setEvent({...event, [key]: value});
        }
    }
    // Filter events for the current month
    // const eventsForMonth = events.filter((event) =>
    //     moment(event.date).isSame(currentMonth, "month")
    // );

    // const onPanelChange = (value) => {
    //     setCurrentMonth(value);
    // };
    const loadData = () => {
        http.get('http://localhost:8080/myreservations')
        .then(res => {
            setEvents(res)
        })
        .catch(err => console.error(err))
    }
    useEffect(() => {
        loadData()
    }, []);
    return (
        <Content>
            <div style={{flex: 1}}>
                <Button type="primary" onClick={showModal} shape="round" icon={<PlusCircleOutlined/>} /* Make sure to import PlusCircleOutlined from '@ant-design/icons' */ style={{
                    backgroundColor: "#52c41a",
                    borderColor: "#52c41a",
                    color: "#ffffff",
                    marginBottom: "16px",
                }}>
                    Add New Event
                </Button>
                {/*<AntCalendar onPanelChange={onPanelChange}/>*/}
                <Modal title="Add New Event" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <DatePicker onChange={date => setData('reservation_date', date)} value={event.reservation_date_a}/>
                    <Input placeholder="Event Title" value={event.facility_name} onChange={(e) => setData('facility_name', e.target.value)} style={{marginTop: "16px"}}/>
                </Modal>
            </div>
            <div style={{marginLeft: 24}}>
                <Card title="Upcoming Events" bordered={false} style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}>
                    <List itemLayout="horizontal" dataSource={events} renderItem={(item) => (
                        <List.Item actions={[
                            <Tooltip title="Edit">
                                <Button shape="circle" icon={<EditOutlined/>} onClick={() => editEvent(item)} style={{border: "none", color: "green"}}/>
                            </Tooltip>,
                            <Tooltip title="Delete">
                                <Button shape="circle" icon={<DeleteOutlined/>} onClick={() => removeEvent(item.id)} style={{border: "none", color: "red"}}/>
                            </Tooltip>,
                        ]}>
                            <List.Item.Meta description={item.facility_name} title={
                                <span>{moment(item.reservation_date).format("YYYY-MM-DD")}</span>
                            }/>
                        </List.Item>
                    )}/>
                </Card>
            </div>
        </Content>
    )
};

export default CalendarPage;
