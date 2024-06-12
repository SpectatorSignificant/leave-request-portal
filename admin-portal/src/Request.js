import React, {Component} from "react";

class Request extends Component {
    constructor(props) {
        super(props);

        this.state = {
            request: props
        }
    }

    render() {
        const dateFrom = (new Date(this.state.request.dateFrom)).toLocaleDateString("en-CA");
        const dateTo = (new Date(this.state.request.dateTo)).toLocaleDateString("en-CA");
        const noOfDays = (new Date(this.state.request.dateTo)).getDate() - (new Date(this.state.request.dateFrom)).getDate() + 1;
        return (
            <div>
                <h4>{this.state.request.name}</h4>
                <p>Email: {this.state.request.email}</p>
                <p>Phone: {this.state.request.phoneNumber}</p>
                <p>Date from: {dateFrom} Date to: {dateTo}</p>
                <p>No of days: {noOfDays}</p>
                <p>Destination: {this.state.request.destinationAddress}</p>
                <p>Reason: {this.state.request.reason}</p>
                {this.state.request.status !== undefined && 
                <p>Status: {this.state.request.status == 1 ? "Approved" : "Denied"}</p> }
            </div>
        )
    }
}

export default Request;