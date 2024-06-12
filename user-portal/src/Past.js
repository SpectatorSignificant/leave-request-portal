import React , {Component} from 'react';
import axios from "axios";
import Request from "./Request";
import { reloadUser, retrieveRequests } from "./UserUtils";

class Past extends Component {
    constructor(props) {
        super(props);
    
        this.accessToken = sessionStorage.getItem("accessToken");
        this.userObject = JSON.parse(sessionStorage.getItem("userObject"));
        this.userFromDB = JSON.parse(sessionStorage.getItem("userFromDB"));

        this.state = {
            accessToken: this.accessToken,
            userObject: this.userObject,
            userFromDB: this.userFromDB,
            pastRequests: []
        };
    }

    async componentDidMount() {
        const newUserData = await reloadUser(this.state.userFromDB.email);
        // console.log("newUserData:", newUserData);
        if (!_.isEqual(newUserData, this.state.userFromDB)) {
            sessionStorage.setItem("admin", JSON.stringify(newUserData));
            const pastRequests = await retrieveRequests(newUserData.past);
            this.setState({ userFromDB: newUserData, pastRequests });
        } 
        else {
            const pastRequests = await retrieveRequests(this.state.userFromDB.past);
            this.setState({ pastRequests });
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
                const pastRequests = await retrieveRequests(newUserData.past);
                this.setState({ userFromDB: newUserData, pastRequests });
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
        // console.log(pastRequests);
        return (
            <div>
                <h1>Past Requests</h1>
                {this.state.pastRequests &&
                pastRequests.length > 0 ?    
                    <div>
                    {pastRequests.map((requestString) => {
                        // console.log(requestString, index);
                        const request = JSON.parse(requestString)
                        // console.log(request);
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