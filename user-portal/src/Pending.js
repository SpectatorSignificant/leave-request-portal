import React , {Component} from 'react';
import axios from "axios";
import _ from "lodash";
import Request from "./Request";
import { reloadUser, retrieveRequests } from "./UserUtils";

class Pending extends Component {
    constructor(props) {
        super(props);
    
        // this.admin = JSON.parse(sessionStorage.getItem("admin"));
        this.accessToken = sessionStorage.getItem("accessToken");
        this.userObject = JSON.parse(sessionStorage.getItem("userObject"));
        this.userFromDB = JSON.parse(sessionStorage.getItem("userFromDB"));

        this.state = {
            accessToken: this.accessToken,
            userObject: this.userObject,
            userFromDB: this.userFromDB,
            pendingRequests: []
        };
    }

    async componentDidMount() {
        const newUserData = await reloadUser(this.state.userFromDB.email);
        // console.log("newUserData:", newUserData);
        if (!_.isEqual(newUserData, this.state.userFromDB)) {
            sessionStorage.setItem("admin", JSON.stringify(newUserData));
            const pendingRequests = await retrieveRequests(newUserData.pending);
            this.setState({ userFromDB: newUserData, pendingRequests });
        } 
        else {
            const pendingRequests = await retrieveRequests(this.state.userFromDB.pending);
            this.setState({ pendingRequests });
        }
        if (!this.state.userFromDB) {
            window.location.href = "/";
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.state.userFromDB, prevState.userFromDB)) {
            // console.log("Updated component");
            const newUserData = await reloadUser(this.state.userFromDB.email);
            // console.log("newUserData:", newUserData);
            if (!_.isEqual(newUserData, this.state.userFromDB)) {
                sessionStorage.setItem("userFromDB", JSON.stringify(newUserData));
                const pendingRequests = await retrieveRequests(newUserData.pending);
                this.setState({ userFromDB: newUserData, pendingRequests });
            } 
            else {
                console.log("New data is same as old data");
            }
        }
    }

    render() {
        // const pendingRequests = this.state.pendingRequests ? JSON.parse(this.state.pendingRequests) : [];
        // console.log(this.state.pendingRequests);
        const pendingRequests = this.state.pendingRequests;
        // console.log(pendingRequests);
        return (
            <div>
                <h1>Pending Requests</h1>
                {this.state.userFromDB &&
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
                            {/* <button onClick={this.handleClickApprove} data-requestid={request._id} data-adminid={request.adminId} data-userid={request.userId}>Approve</button>
                            <button onClick={this.handleClickDeny} data-requestid={request._id} data-adminid={request.adminId} data-userid={request.userId}>Deny</button> */}
                        </div>)
                    })}
                    </div>
                    : <p>You have no pending requests</p>}
            </div>
        );
    }
}

export default Pending;