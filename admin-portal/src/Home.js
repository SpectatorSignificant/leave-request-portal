import React, {Component} from "react";
import { reloadAdmin } from "./AdminUtils";

class Home extends Component {
    constructor(props) {
        super(props);

        this.admin = JSON.parse(sessionStorage.getItem("admin"));

        this.state = {
            admin: this.admin
        }
    }

    async componentDidMount() {
        // console.log(this.state);
        await reloadAdmin(this.state.admin._id);

        if (!this.admin) {
            window.location.href = "/";
        }
        else {
            
        }
    }

    handleLogout = () => {
        sessionStorage.removeItem("admin");
        window.location.href = "/";
    }

    render() {
        return (
            <div>
                <h1>Home</h1>
                <a href="/pending">Pending Requests</a>
                {/* <Link to="/pending"></Link> */}
                <br></br>
                <a href="/past">Past Requests</a>
                <br></br>
                {/* <a href="/chat">Chat</a> */}
                {/* <Link to="/chat"></Link> */}
                <br></br>
                <button onClick={this.handleLogout}>Logout</button>
            </div>
        )
    }
}

export default Home;