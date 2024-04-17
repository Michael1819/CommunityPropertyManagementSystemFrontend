import React, {useState, useEffect} from "react";
import {Layout, Modal, Card, List, Button, Row, Col, Form, Input, Upload} from "antd";
import {
    PlusOutlined, VerticalAlignTopOutlined,
} from "@ant-design/icons";
import "antd/dist/antd.min.css";
import {DiscussionThread} from "./DiscussionThread";
import http from '../libs/http'
const {Header, Content, Sider} = Layout;

const DiscussionBoard = () => {
    const [form] = Form.useForm();

    const initialValues = {
        subject: "",
        content: ""
    };

    // States for pagination and navigation
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(5);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPostVisible, setNewPostVisible] = useState(false);
    const [discussionVisible, setDiscussionVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [discussionList, setDiscussionList] = useState([]);
    const colors = ["#f56a00", "#1890ff", "#74d680", "#ffec3d", "#ff7875"];
    // const list = new Array(15).fill(null).map((_, index) => ({
    //     title: `Untitled key item ${index + 1}`,
    //     color: colors[index % 5], // Cycle through the 5 different colors
    // }));
    // setDiscussionList(list)
    // Change page
    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPostsPerPage(pageSize);
    };

    // Handle the post click to navigate to discussion thread page
    const handlePostClick = (post) => {
        setSelectedPost(post);
        setDiscussionVisible(true);
    };

    const showNewPostModal = () => {
        setNewPostVisible(true);
    };

    const loadData = () => {
        http.get('http://localhost:8080/alldiscussions')
        .then(res => {
            const data = res;
            for (let index in data) {
                data[index].color = colors[index % 5]
            }
            setDiscussionList(data)
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
    const handleNewPostOk = () => {
        setLoading(true);
        const data = form.getFieldsValue()
        http.post('http://localhost:8080/discussion', data)
        .then(res => loadData())
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
        setNewPostVisible(false);
    };

    const handleNewPostCancel = () => {
        setNewPostVisible(false);
    };

    const handleDiscussionCancel = () => {
        setDiscussionVisible(false);
        setSelectedPost(null);
    };
    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 14},
    };
    const normFile = (e) => {
        console.log("Upload event:", e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    useEffect(() => {
        loadData()
    }, [])
    return (
        <Content className="site-layout-background" style={{padding: 24, margin: 0, minHeight: 280,}}>
            <Row style={{marginBottom: 16}}>
                <Col span={12}>
                    <div style={{fontSize: "1.2em", fontWeight: "500"}}>
                        Posts
                    </div>
                </Col>
                <Col span={12} style={{textAlign: "right"}}>
                    <Button type="primary" icon={<PlusOutlined/>} onClick={showNewPostModal}>New Post</Button>
                    <Modal title="Create New Post" open={newPostVisible} width={1000} onOk={handleNewPostOk} okText="Create" confirmLoading={loading} onCancel={handleNewPostCancel}>
                        <Form {...formItemLayout} form={form} initialValues={initialValues}>
                            <Form.Item name="subject" label="Subject" rules={[{required: true, message: "Please input your Subject!",},]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name="content" label="Content" rules={[{required: true, message: "Please input your Content!",},]}>
                                <Input.TextArea rows={6}/>
                            </Form.Item>
                            <Form.Item label="Dragger">
                                <Form.Item name="uploadPost" valuePropName="fileList" getValueFromEvent={normFile} noStyle
                                           rules={[
                                               {
                                                   required: true,
                                                   message: "Please select an image/video!",
                                               },
                                           ]}>
                                    <Upload.Dragger name="files" beforeUpload={() => false}>
                                        <p className="ant-upload-drag-icon">
                                            <VerticalAlignTopOutlined/>
                                        </p>
                                        <p className="ant-upload-text">
                                            Please drag image to this area to upload.
                                        </p>
                                    </Upload.Dragger>
                                </Form.Item>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Col>
            </Row>

            <Modal title="Discussion Thread" open={discussionVisible} width={800} onCancel={handleDiscussionCancel} footer={null}>
                {selectedPost && (
                    <DiscussionThread
                        post={selectedPost}
                        onCancel={handleDiscussionCancel}
                        onCustomEvent={handleDiscussionCancel}
                    />
                )}
            </Modal>

            <List itemLayout="vertical" size="large"
                  pagination={{
                      onChange: handlePageChange,
                      pageSize: postsPerPage,
                      current: currentPage,
                      total: discussionList.length,
                      showSizeChanger: true,
                      pageSizeOptions: ["5", "10", "15", "20"],
                      onShowSizeChange: handlePageChange,
                  }}
                  dataSource={discussionList}
                  renderItem={(item) => (
                      <List.Item key={item.title} onClick={() => handlePostClick(item)}>
                          <Card hoverable>
                              <Card.Meta title={item.subject} avatar={
                                  <div style={{
                                      backgroundColor: item.color,
                                      border: `2px solid ${item.color}`,
                                      borderRadius: "50%",
                                      width: "20px",
                                      height: "20px",
                                  }}/>
                              }
                              />
                          </Card>
                      </List.Item>
                  )}
            />
        </Content>
    );
};

export default DiscussionBoard;
