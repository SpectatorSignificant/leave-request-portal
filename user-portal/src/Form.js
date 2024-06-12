import React, { Component } from "react";
import axios from "axios";

class Form extends Component {
    constructor(props){
        super(props);
        this.userObject = JSON.parse(sessionStorage.getItem("userObject"));
        this.userFromDB = JSON.parse(sessionStorage.getItem("userFromDB"));

        this.state = {
            userObject: this.userObject,
            userFromDB: this.userFromDB,
            copyFromDB: this.userFromDB ? {...this.userFromDB, reason: ""} : {
				parentName: "",
				parentPhone: "",	
				hostelName: "",
				roomNumber: "",
				destinationAddress: "",
                reason: ""
			},
            noOfDays: undefined,
            dateFrom: undefined,
            dateTo: undefined
        };

        this.todayDate = new Date().toLocaleDateString("en-CA");
    }

    componentDidMount(){
        // console.log(this.userObject);
        // console.log(this.userFromDB);

        if (!this.userObject) {
            window.location.href = "/home";
        }
    }

    handleDateChange = () => {
        const dateFrom = new Date(document.getElementById("date-from").value);
        const dateTo =new Date(document.getElementById("date-to").value);
        const noOfDays = dateFrom <= dateTo ? dateTo.getDate() - dateFrom.getDate() + 1 : null;
        // console.log(noOfDays);
        this.setState({...this.state, 
            noOfDays,
            dateFrom,
            dateTo
        });
    }

    handleChange = (event) => { 
        // event.preventDefault();
        
        const parentName = document.getElementById("parent-name").value;
        const parentPhone = document.getElementById("parent-phone").value;
        const destinationAddress = document.getElementById("destination-address").value;
        const hostelName = document.getElementById("hostel-name").value;
        const roomNumber = document.getElementById("room-number").value;
        const reason = document.getElementById("reason").value;
        const dateFrom = new Date(document.getElementById("date-from").value);
        const dateTo = new Date(document.getElementById("date-to").value);
        const noOfDays = dateFrom <= dateTo ? dateTo.getDate() - dateFrom.getDate() + 1 : null;
        // const noOfDays = this.state.noOfDays;
        // const userObject = this.state.userObject;
        const copyFromDB = {
            parentName,
            parentPhone,
            hostelName,
            roomNumber,
            destinationAddress,
            reason
        }

        this.setState({...this.state, copyFromDB, dateTo, dateFrom, noOfDays, parentName, parentPhone, destinationAddress, hostelName, roomNumber, reason});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const postData = {...this.state, userId: this.state.userFromDB._id, userFromDB: null, copyFromDB: null};

        axios.post("http://localhost:3001/api/v0/createrequest", postData)
        .then((response) =>{
            // console.log(response.data);
        })
        .catch((error) => {
            console.log("Error submitting request", error.message);
        })

        this.setState({
            userObject: this.state.userObject,
            userFromDB: this.state.userFromDB,
            copyFromDB: this.state.userFromDB ? {...this.state.userFromDB, reason: ""} : {
				parentName: "",
				parentPhone: "",	
				hostelName: "",
				roomNumber: "",
				destinationAddress: "",
                reason: ""
			},
            noOfDays: undefined,
            dateFrom: undefined,
            dateTo: undefined
        });
        
    }

    render() {
        return (
          <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
              
            {this.state.userObject ?
                <div>
                    <p>Name:</p>
                    <input value={this.state.userObject.name} readOnly/>
                    <p>Email:</p>
                    <input value={this.state.userObject.email} readOnly/>
                    <p>Phone:</p>
                    <input value={this.state.userObject.phoneNumber} readOnly/>
                    <p>Gender:</p>
                    <input value={this.state.userObject.gender} readOnly/>
                    <p>Batch:</p>
                    <input value={this.state.userObject.batch} readOnly/>
                </div>
                : <p>Loading...</p>
            }
            <p>Date from:</p>
            <input id="date-from" defaultValue={this.todayDate} name='dateFrom' type='date' required></input>
            <p>Date to:</p>
            <input id="date-to" name='dateTo' type='date' required></input>
            {this.state.noOfDays && 
                <div>
                    <p>Number of days:</p>
                    <input value={this.state.noOfDays} readOnly required/>
                </div>
            }
            <p>Parent Name:</p>
            <input id="parent-name" value={this.state.copyFromDB.parentName} name='parentName' type="text" required></input>
            <p>Parent Phone:</p>
            <input id="parent-phone" value={this.state.copyFromDB.parentPhone} name='parentPhone' required></input>
            <p>Destination Address:</p>
            <input id="destination-address" value={this.state.copyFromDB.destinationAddress} name="destinationAddress" type="text" required></input>
            {/* <p>Hostel Name:</p>
            <input id="hostel-name" defaultValue={this.state.userFromDB.hostelName} name="hostelName" type="text" required></input> */}
            <p>Hostel Name: </p>
            <select id="hostel-name" name="hostelName">
                 <option value="Aqua">Aqua</option>
                 <option value="Zircon">Zircon</option>
                 <option value="Amber">Amber</option>
            </select>            
            
            <p>Room Number:</p>
            <input id="room-number" value={this.state.copyFromDB.roomNumber} name="roomNumber" required></input>
            <p>Reason:</p>
            <input id="reason" value={this.state.copyFromDB.reason} name='reason' type='text' required></input>
            <br></br>
            <button type='submit'>Submit</button>

          </form>
        );
      }
}

export default Form;