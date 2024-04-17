import React, {useEffect, useState, useCallback} from "react";
import { Typography, Input, Button, List, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import http from '../libs/http';
const { Title } = Typography;

export const DiscussionThread = props => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handleInputChange = (e) => {
    setNewComment(e.target.value);
  };
  const handleClick = useCallback(() => {
    props.onCustomEvent && props.onCustomEvent('ok');
  }, [props.onCustomEvent])
  const handleCommentSubmit = () => {
    if (newComment.trim() !== "") {
      http.post('http://localhost:8080/reply', {
        discussion_id: props.post.id,
        content: newComment
      })
      .then(res => {
        setNewComment('')
        loadData()
        handleClick()
      })
      .catch(err => console.error(err))
    }
  };
  const loadData = () => {
    http.put('http://localhost:8080/discussion', {id: props.post.id})
    .then(res => {
      setComments(res.replies)
      setComments(res.replies)
    })
    .catch(err => console.error(err))
  }
  useEffect(() => {
    loadData()
  }, [])
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Dummy discussion post */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Discussion Post</Title>
        <img src="https://www.snexplores.org/wp-content/uploads/2020/04/1030_LL_trees-1028x579.png" alt="Discussion Post Image" style={{ maxWidth: "100%", marginBottom: 16 }}/>
        <p>{props.post.content}</p>
      </div>

      {/* Input box for comments */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>Add a Comment</Title>
        <Input.TextArea value={newComment} onChange={handleInputChange} placeholder="Write your comment here..." rows={4}/>
        <Button type="primary" style={{ marginTop: 16 }} onClick={handleCommentSubmit}>Submit Comment</Button>
      </div>

      <div>
        <Title level={3}>Previous Comments</Title>
        <List itemLayout="horizontal" dataSource={comments} renderItem={(item) => (
            <List.Item>
              <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={<strong>{item.username}</strong>} description={item.content}/>
            </List.Item>
          )}/>
      </div>
    </div>
  );
};

export default DiscussionThread;
