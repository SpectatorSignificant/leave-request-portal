import React, { Component } from 'react';
import axios from "axios";
import Form from "./Form";

class Home extends Component {
    constructor(props){
        super(props);

        this.userObject = undefined;
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code"); 
        const state = params.get("state");


        this.accessToken = sessionStorage.getItem("accessToken");
        // this.accessToken = checkCookie("accessToken");
       
        this.state = {
            code,
            state,
            userObject: undefined,
            accessToken: this.accessToken,
            posted: false,
            reloadCount: 0
        }
    }
    
    handleLogout() {
        // clearAllCookies();
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userObject");
        window.location.href = "/";
    }

    componentDidMount() {
        // console.log({accessToken: this.accessToken});
        if (!this.accessToken) {
            const postData = { code: this.state.code, state: this.state.state };
            // console.log(postData);
            axios.post("http://localhost:3001/api/v0/token", postData)
            .then((response) => {
                this.accessToken = response.data.accessToken;
                // console.log("Received access token:", this.accessToken);
                sessionStorage.setItem("accessToken", this.accessToken);
                // setCookie("accessToken", this.accessToken);
                this.setState({...this.state, accessToken: this.accessToken});
            })
            .catch((error) => {
                console.log("Error getting access token:", error.message);
            })
        }
    }

    render() {
      return (
        <div>
            <h2>Send a new request for leave</h2>
            {this.state.accessToken && <Form accessToken={this.state.accessToken}/>}
            {/* <button onClick={this.handleLogout}>Logout</button> */}
        </div>
      );
    }
  }

export default Home;