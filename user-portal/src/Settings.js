import React, { Component } from 'react';
import axios from "axios";
import Form from "./Form";
import Options from "./Options";

class Settings extends Component {
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
            userObject: sessionStorage.getItem("userObject"),
            accessToken: this.accessToken,
            posted: false,
            reloadCount: 0
        }
    }
    
    handleLogout() {
        // clearAllCookies();
        sessionStorage.removeItem("accessToken");
        window.location.href = "/";
    }

    componentDidMount() {
        if (!this.accessToken || !this.state.userObject) {
            window.location.href = "/";
        }
    }

    render() {
      return (
        <div>
            <h1>Auto-fill Settings</h1>
            {this.state.accessToken && <Options />}
            {/* <button onClick={this.handleLogout}>Logout</button> */}
        </div>
      );
    }
  }

export default Settings;