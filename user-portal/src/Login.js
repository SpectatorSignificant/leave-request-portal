import React, {Component} from "react";
import "./Login.css";

class Login extends Component{
    componentDidMount() {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("userObject");
        sessionStorage.removeItem("userFromDB");
    }

    handleClick = () => {
        window.location.href =  "http://localhost:3001/api/v0/login/";
    }
    
    render() {
        return (
            <div id="login-wrapper">
                <div id="login-container">
                <div id="login-btn-div" onClick={this.handleClick}>
                    {/* <button id="login-btn" > */}
                        Login with DAuth
                    {/* </button> */}
                </div>
                {/* <button id="login-btn" onClick={this.handleClick}>Login with DAuth</button> */}
                <a id="dauth-url" href="https://auth.delta.nitt.edu">Do not have a DAuth account?</a>
                </div>
            </div>
            
        );
    }
}

export default Login