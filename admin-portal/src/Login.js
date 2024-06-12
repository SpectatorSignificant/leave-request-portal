import React, {Component} from "react";
import axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    componentDidMount() {
        sessionStorage.removeItem("admin");
    }

    handleChange = (event) => {
        this.setState({...this.state, [event.target.name]: event.target.value})
    }

    clearForm = () => {
        document.getElementById("email-input").value = "";
        document.getElementById("password-input").value = "";
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const postData = this.state;

        axios.post("http://localhost:3001/api/v0/authenticate-admin", postData)
        .then((response) => {
            // console.log("Admin authentication response:", response.data);
            if (response.data.success === true) {
                // console.log(response.data);
                // sessionStorage.setItem("test", JSON.stringify(response.data));
                sessionStorage.setItem("admin", JSON.stringify(response.data));
                window.location.href = "/home";
            }
            else {
                console.log("Error authenticating admin:", error.message);
                alert("Invalid credentials. Please re-check your email and password.");
                this.clearForm();
            }
        })
        .catch((error) => {
            console.log("Error authenticating admin:", error.message);
            alert("Invalid credentials. Please re-check your email and password.");
            this.clearForm();
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Email: </label>
                <input id="email-input" onChange={this.handleChange} name="email" type="email"></input>
                <br></br>
                <label>Password: </label>
                <input id="password-input" onChange={this.handleChange} name="password" type="password"></input>
                <br></br>
                <button type="submit">Submit</button>
            </form>
        )
    }
}

export default Login;