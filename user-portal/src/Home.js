import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import axios from "axios";
import "./Home.css";

class Home extends Component {
    constructor(props) {
        super(props);

        this.userObject = undefined;
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code"); 
        const state = params.get("state");
        
        this.accessToken = sessionStorage.getItem("accessToken");
        this.userObject = JSON.parse(sessionStorage.getItem("userObject"));
        this.userFromDB = JSON.parse(sessionStorage.getItem("userFromDB"));

        this.state = {
            code,
            state,
            userObject: this.userObject,
            accessToken: this.accessToken,
            userFromDB: this.userFromDB,
            posted: false,
        }

        // window.history.replaceState(null, null, "?");
    }

    componentDidMount() {
        if (!this.accessToken) {
            const postData = { code: this.state.code, state: this.state.state };
            // console.log(postData);
            axios.post("http://localhost:3001/api/v0/token", postData)
            .then((response) => {
                this.accessToken = response.data.accessToken;
                // console.log("Received access token:", this.accessToken);
                sessionStorage.setItem("accessToken", this.accessToken);
                this.setState({...this.state, accessToken: this.accessToken});
            })
            .catch((error) => {
                console.log("Error getting access token:", error.message);
            })
        }
        else {
            this.setState(this.state);
        }
    }

    componentDidUpdate() {
        // console.log(!this.state.userObject, !this.state.userFromDB);
        if (!this.state.userObject) {
            axios.post("http://localhost:3001/api/v0/user", { accessToken: this.accessToken })
            .then((response) => {
                // console.log("Received user object:", response.data);
                this.userObject = response.data;
                sessionStorage.setItem("userObject", JSON.stringify(this.userObject));
                this.setState({...this.state, userObject: response.data})
            })
            .catch((error) => {
                console.log("Error retrieving user info:", error.message);
            })
        }  

        if (this.state.userObject && !this.state.userFromDB) {
            // console.log("Yes");
			axios.post("http://localhost:3001/api/v0/searchdb", { email : this.state.userObject.email })
			.then((response) => {
				// console.log(response.data);
				sessionStorage.setItem("userFromDB", JSON.stringify(response.data));
				this.setState({...this.state, userFromDB: response.data });
			})
			.catch((error) => {
				console.log("Error searching db", error.message);
			})
		}
    }
    
    handleApplication = () => {
        window.location.href =  "/application";
    }

    handleSettings = () => { 
        window.location.href =  "/settings";
    }

    handleClickPending = () => {
        window.location.href = "/pending";
    }

    handleClickPast = () => {
        window.location.href = "/past";
    }

    handleLogout() {
        // clearAllCookies();
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userObject");
        sessionStorage.removeItem("userFromDB");
        window.location.href = "/";
    }

    render() {
        return (
            // this.state.queryExtracted ? <Redirect to="http://localhost:3000/home"/> : 
            <div id="wrapper">
                {this.state.userObject ?
                <div id="home-container">
                    <h1>Welcome, {this.state.userObject.name}</h1>
                    <div id="home-buttons-div">
                        <button id="application-btn" onClick={this.handleApplication}>Send a new request</button>
                        
                        <button id="pending-btn" onClick={this.handleClickPending}>Pending Requests</button>
                        
                        <button id="past-btn" onClick={this.handleClickPast}>Past Requests</button>
                        
                        <button id="settings-btn" onClick={this.handleSettings}>Auto-fill settings</button>
                    </div> 
                </div>
                : 
                <p>Loading...</p>
                }
                <button id="logout-btn" onClick={this.handleLogout}>Logout</button>
            </div>
            
        );
    }
} 

export default Home;