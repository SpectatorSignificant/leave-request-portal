import React , {Component} from 'react';
import axios from "axios";
import Request from "./Request";
import { reloadAdmin, retrieveRequests } from "./AdminUtils";

class Past extends Component {
    constructor(props) {
        super(props);
    
        this.admin = JSON.parse(sessionStorage.getItem("admin"));

        this.state = {
            admin: this.admin,
            pastRequests: []
        };
    }

    async componentDidMount() {
        const newAdminData = await reloadAdmin(this.state.admin._id);
        // console.log("newAdminData:", newAdminData);
        if (!_.isEqual(newAdminData, this.state.admin)) {
            sessionStorage.setItem("admin", JSON.stringify(newAdminData));
            const pastRequests = await retrieveRequests(newAdminData.past);
            this.setState({ admin: newAdminData, pastRequests });
        } 
        else {
            const pastRequests = await retrieveRequests(this.state.admin.past);
            this.setState({ pastRequests });
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
                const pastRequests = await retrieveRequests(newAdminData.past);
                this.setState({ admin: newAdminData, pastRequests });
            } 
            else {
                console.log("New data is same as old data");
            }
        }
    }

    render() {
        // const pastRequests = this.state.pastRequests ? JSON.parse(this.state.pastRequests) : [];
        const pastRequests = this.state.pastRequests;
        // console.log(pastRequests);
        return (
            <div>
                <h1>Past Requests</h1>
                {this.state.admin &&
                pastRequests.length > 0 ?    
                    <div>
                    {pastRequests.map((requestString) => {
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
                            reason={request.reason} 
                            status={request.status} />
                            {/* <button onClick={this.handleClickApprove} data-requestid={request._id} data-adminid={request.adminId} data-userid={request.userId}>Approve</button>
                            <button onClick={this.handleClickDeny} data-requestid={request._id} data-adminid={request.adminId} data-userid={request.userId}>Deny</button> */}
                        </div>)
                    })}
                    </div>
                    : <p>You have no past requests</p>}
            </div>
        );
    }
}

export default Past;