import React , {Component} from 'react';
import _ from "lodash";
import axios from "axios";
import Request from "./Request";
import { reloadAdmin, retrieveRequests } from "./AdminUtils";

class Pending extends Component {
    constructor(props) {
        super(props);
    
        this.admin = JSON.parse(sessionStorage.getItem("admin"));

        this.state = {
            admin: this.admin,
            pendingRequests: []
        };
    }
    
    async componentDidMount() {
        
        console.log(this.state);
        const newAdminData = await reloadAdmin(this.state.admin._id);
        console.log("newAdminData:", newAdminData);
        if (!_.isEqual(newAdminData, this.state.admin)) {
            sessionStorage.setItem("admin", JSON.stringify(newAdminData));
            const pendingRequests = await retrieveRequests(newAdminData.pending);
            this.setState({ admin: newAdminData, pendingRequests });
        } 
        else {
            const pendingRequests = await retrieveRequests(this.state.admin.pending);
            this.setState({ pendingRequests });
        }
        if (!this.state.admin) {
            window.location.href = "/";
        }
        
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state.admin, prevState.admin)) {
            // console.log("Updated component");
            const newAdminData = await reloadAdmin(this.state.admin._id);
            // console.log("newAdminData:", newAdminData);
            if (!_.isEqual(newAdminData, this.state.admin)) {
                sessionStorage.setItem("admin", JSON.stringify(newAdminData));
                const pendingRequests = await retrieveRequests(newAdminData.pending);
                this.setState({ admin: newAdminData, pendingRequests });
            } 
            else {
                console.log("New data is same as old data");
            }

        }
    }

    handleClickApprove = (event) => {
        const postData = {
            requestId: event.target.getAttribute("data-requestid"),
            userId: event.target.getAttribute("data-userid"),
            adminId: event.target.getAttribute("data-adminid"),
            status: 1
        }

        // console.log(postData, event.target.id, event.target.name);

        axios.post("http://localhost:3001/api/v0/update-request-past", postData)
        .then((response) => {
            // console.log("Request approved:", response.data);
        })
        .catch((error) => {
            console.log("Error in approving request:", error.message);
        })
    }

    handleClickDeny = (event) => {
        const postData = {
            requestId: event.target.getAttribute("data-requestid"),
            userId: event.target.getAttribute("data-userid"),
            adminId: event.target.getAttribute("data-adminid"),
            status: 0
        }

        axios.post("http://localhost:3001/api/v0/update-request-past", postData)
        .then((response) => {
            // console.log("Request denied:", response.data);
        })
        .catch((error) => {
            console.log("Error in denying request:", error.message);
        })
    }

    render() {
        // const pendingRequests = this.state.pendingRequests ? JSON.parse(this.state.pendingRequests) : [];
        const pendingRequests = this.state.pendingRequests;
        // console.log(pendingRequests);
        return (
            <div>
                <h1>Pending Requests</h1>
                {this.state.admin &&
                pendingRequests.length > 0 ?    
                    <div>
                    {pendingRequests.map((requestString) => {
                        // console.log(requestString, index);
                        const request = JSON.parse(requestString)
                        return (
                        <div key={request._id}>
                            <Request 
                            name={request.name} 
                            email={request.email} 
                            phoneNumber={request.phoneNumber} 
                            dateFrom={request.dateFrom} 
                            dateTo={request.dateTo} 
                            destinationAddress={request.destinationAddress} 
                            reason={request.reason} />
                            <button onClick={this.handleClickApprove} data-requestid={request._id} data-adminid={request.adminId} data-userid={request.userId}>Approve</button>
                            <button onClick={this.handleClickDeny} data-requestid={request._id} data-adminid={request.adminId} data-userid={request.userId}>Deny</button>
                        </div>)
                    })}
                    </div>
                    : <p>You have no pending requests</p>}
            </div>
        );
    }
}

export default Pending;