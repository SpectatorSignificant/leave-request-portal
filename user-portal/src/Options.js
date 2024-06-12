import React, { Component } from "react";
import axios from "axios";

class DefaultOptions extends Component {
    constructor(props) {
        super(props);
        
        this.userObject = JSON.parse(sessionStorage.getItem("userObject"));
		this.userFromDB = JSON.parse(sessionStorage.getItem("userFromDB"));
		
        this.state = {
            userObject: this.userObject,
			userFromDB: this.userFromDB,
			copyFromDB: this.userFromDB ? this.userFromDB : {
				parentName: "",
				parentPhone: "",	
				hostelName: "",
				roomNumber: "",
				destinationAddress: ""
			}
        };
    }

    componentDidMount() {
        if (!this.state.userObject || !this.state.userFromDB) {
            window.location.href = "/home";
        }

		// if (!this.state.userFromDB) {
		// 	axios.post("http://localhost:3001/api/v0/searchdb", { email : this.userObject.email })
		// 	.then((response) => {
		// 		// console.log(response.data);
		// 		sessionStorage.setItem("userFromDB", response.data);
		// 		this.setState({...this.state, userFromDB: response.data });
		// 	})
		// 	.catch((error) => {
		// 		console.log("Error searching db", error.message);
		// 	})
		// }
    }

	handleSave = () => {
		this.userFromDB = {
			email: this.state.userObject.email,
			parentName: document.getElementById("parent-name").value,
			parentPhone: document.getElementById("parent-phone").value,	
			hostelName: document.getElementById("hostel-name").value,
			roomNumber: document.getElementById("room-number").value,
			destinationAddress: document.getElementById("destination-address").value
		}
		// console.log(this.userFromDB);

		axios.post("http://localhost:3001/api/v0/updatedb", this.userFromDB)
		.then((response) => {
			// console.log("Updated user data in db", response.data);
			// this.userObject = this.state.userObject;
			this.setState({...this.state, userFromDB: this.userFromDB, copyFromDB: this.userFromDB});
		})
		.catch((error) => {
			console.log("Error updating db", error.message);
		})
	}

	hanldleDiscard = () => {
		// window.location.href = "http://localhost:3000/home";
		this.setState({...this.state, copyFromDB: {
			parentName: "",
			parentPhone: "",	
			hostelName: "",
			roomNumber: "",
			destinationAddress: ""
		}});
	}

	handleChange = (event) => {
		const { name, value } = event.target;
		this.setState({ ...this.state, copyFromDB: {...this.state.copyFromDB, [name]: value } });
	}

    render() {
        return (
			<div>
				{this.state.userFromDB && 
				<div>
					<p>Parent's Name:</p>
					<input id="parent-name" name="parentName" onChange={this.handleChange} value={this.state.copyFromDB.parentName}/>
					<p>Parent's Phone:</p>
					<input id="parent-phone" name="parentPhone" onChange={this.handleChange} value={this.state.copyFromDB.parentPhone !== null ? this.state.copyFromDB.parentPhone : "" }/>
					<p>Hostel Name:</p>
					<input id="hostel-name" name="hostelName" onChange={this.handleChange} value={this.state.copyFromDB.hostelName}/>
					<p>Room Number:</p>
					<input id="room-number" name="roomNumber" onChange={this.handleChange} value={this.state.copyFromDB.roomNumber !== null ? this.state.copyFromDB.roomNumber : "" }/>
					<p>Destination Address</p>
					<input id="destination-address" name="destinationAddress" onChange={this.handleChange} value={this.state.copyFromDB.destinationAddress}/>
				</div>}
				<button onClick={this.handleSave}>Save changes</button>
				<button onClick={this.hanldleDiscard}>Discard changes</button>
			</div>
		);
      }
}

export default DefaultOptions;