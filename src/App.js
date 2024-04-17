import React, {useEffect, useState} from "react";
import {Button, Avatar, Menu} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {BrowserRouter as Router, Route, Switch, Link, Redirect,} from "react-router-dom";
import {AuthProvider, useAuth} from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import CustomLayout from "./component/CustomLayout";
import Footer from "./component/Footer";
import SigninForm from "./component/SigninForm";

import "./App.css";

const containerStyle = {
    position: "relative",
    minHeight: "100vh",
};

const imageStyle = {
    width: "100%",
    height: "100vh",
    objectFit: "cover",
};

const headerStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    padding: "20px 0",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
};

const buttonContainerStyle = {
    display: "flex",
    flexDirection: "row",
};

const buttonStyle = {
    marginRight: "10px",
    background: "transparent",
    color: "white",
    border: "none",
};

const routes = [
    {to: '/layout?target=discussions', text: 'Discussion Board', key: 'discussions'},
    {to: '/layout?target=maintenance', text: 'Maintenance Order'},
    {to: '/layout?target=calendar', text: 'Calendar Events', key: 'calendar'},
    {to: '/layout?target=payment', text: 'Payment Tool', key: 'payment'},
]
const Home = () => {
    const {user, logout} = useAuth();
    const role = JSON.parse(localStorage.getItem('login')).role
    return (
        <div style={containerStyle}>
            <img src="https://iiif.micr.io/ZKSPH/full/1280,/0/default.jpg" /*replace with apartment image*/ alt="Community Image" style={imageStyle}/>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                zIndex: 1,
            }}>
                <h1 style={{color: "white", fontSize: "3rem"}}>
                    Welcome to Our Community Hub!
                </h1>
            </div>
            <div style={{...headerStyle, justifyContent: "space-between"}}>
                <div style={buttonContainerStyle}>
                    {
                        routes.filter(item => !['discussions', 'payment', 'calendar'].includes(item.key) || role !== 'third_party').map(item => (
                            <Link to={item.to}>
                                <Button type="primary" size="large" style={buttonStyle} className="custom-button">{item.text}</Button>
                            </Link>
                        ))
                    }
                </div>
                <div style={{display: "flex", alignItems: "center", marginRight: "20px"}}>
                    <Avatar style={{backgroundColor: "#f56a00", marginRight: "10px"}}>
                        {" "}
                        {user && user.username[0]}
                    </Avatar>
                    {user && (<span style={{color: "white", marginRight: "20px"}}>{user.username}</span>)}
                    <Button type="primary" onClick={logout}>
                        <UserOutlined/> Logout
                    </Button>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

const App = () => {
    const {isAuthenticated} = useAuth();
    return (
        <Router>
            <AuthProvider>
                <Switch>
                    <Route path="/login">
                        {isAuthenticated ? <Redirect to="/"/> : <SigninForm/>}
                    </Route>
                    <PrivateRoute path="/" exact component={Home}/>
                    <PrivateRoute path="/layout" component={CustomLayout}/>
                </Switch>
            </AuthProvider>
        </Router>
    );
};

// if role != "third_party" POST /bill
// if role != "third_party" PUT /maintenance

// if role != "resident" && role != "manager" GET /mydiscussions
// if role != "resident" && role != "manager" POST /discussion
// if role != "resident" && role != "manager" DELETE /discussion
// if role != "resident" && role != "manager" GET /alldiscussions
// if role != "resident" && role != "manager" PUT /discussion
// if role != "resident" && role != "manager" GET /bill
// if role != "resident" && role != "manager" DELETE /reply
// if role != "resident" && role != "manager" DELETE /reservation
// if role != "resident" && role != "manager" GET /facility
// if role != "resident" && role != "manager" GET /calendar
// if role != "resident" && role != "manager" GET /facilityreservations
// if role != "resident" && role != "manager" GET /balance
// if role != "resident" && role != "manager" POST /mymaintenances
// if role != "resident" && role != "manager" GET /payment
// if role != "resident" && role != "manager" GET /reply
// if role != "resident" && role != "manager" GET /myreservations
// if role != "resident" && role != "manager" POST /maintenance
// if role != "resident" && role != "manager" POST /payment
// if role != "resident" && role != "manager" POST /reply
// if role != "resident" && role != "manager" POST /reservation

export default App;
