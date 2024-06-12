const mongoose = require("mongoose");

const url = `mongodb://${ process.env.MONGODB_PORT || '127.0.0.1' }/hostel`;

mongoose.connect(url);

const requestSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId},
    adminId: {type: mongoose.Schema.ObjectId},
    email : {type: String, required: true},
    batch: {type: String},
    name: {type: String},
    dateFrom: {type: Date},
    dateTo: {type: Date},
    phoneNumber: {type: Number},
    parentName : {type: String},
    parentPhone : {type: Number},
    hostelName : {type: String},
    roomNumber : {type: Number},
    destinationAddress : {type: String},
    reason: {type: String},
    status: {type: Number, default: -1}
    
})

const requestData = mongoose.model("Request", requestSchema);

async function createRequest(requestObject){
    try{
        const document = await requestData.create(requestObject)
        console.log("document._id:", document._id);
        console.log("Added request to db");
        return {_id: document._id};
        
    } catch (error){
        console.log("DB Error creating request:", error.message);
    }
}

async function searchRequest(searchObject){
    try {
        const request = await requestData.findOne(searchObject);
        console.log("Found request:", request);
        return request;
    }
    catch (e) {
        console.log("Error:", e.message);
    }
}

async function updateRequest(requestObject, updateQuery) {
    try {
        requestData.findOneAndUpdate(requestObject, updateQuery)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            throw error;
        })
    }
    catch (error) {
        console.log("Error updating request:", error.message);
    }
}

const userDataSchema = new mongoose.Schema({
    email : {type: String, required: true},
    parentName : {type: String, default: ""},
    parentPhone : {type: Number, default: ""},
    hostelName : {type: String, default: ""},
    roomNumber : {type: Number, default: ""},
    destinationAddress : {type: String, default: ""},
    pending: {type: [mongoose.Schema.ObjectId], default: []},
    past: {type: [mongoose.Schema.ObjectId], default: []}
});

const UserData = mongoose.model("User", userDataSchema);

const adminSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    pending: {type: [mongoose.Schema.ObjectId], default: []},
    past: {type: [mongoose.Schema.ObjectId], default: []}
});

const adminData = mongoose.model("Admin", adminSchema);

async function searchAdmin(searchObject) {
    try {
        const admin = await adminData.findOne(searchObject);
        console.log("Found admin:", admin);
        return admin;
    }
    catch (error) {
        console.log("Error:", error.message);
    }
}

searchAdmin({})
.then((admin) => {
    if (admin === null) {
        const adminObject = {
            _id: '6666a1c302c23bf58da26a13',
            email: "aqua@test.com",
            password: "1234"
        }
        adminData.create(adminObject);
    }
})


async function updateAdmin(adminObject, updateQuery) {
    try {
        adminData.findOneAndUpdate(adminObject, updateQuery)
        .then((response) => {
            console.log("Updated admin:", response)
            return response;
        })
        .catch((error) => {
            throw error;
        })
    }
    catch (error) {
        console.log("Error updating admin:", error.message);
    }
}

async function createUserData(userDataObject){
    try{
        const file  = await UserData.create(userDataObject);
        await file.save();
        console.log("Added user data to db");
    } catch (e){
        console.error(e);
    }
}

let userDataObject = {
    email : "test@test.com",
    parentName : "test",
    parentPhone : 1234567890,
    hostelName : "test",
    roomNumber : 1,
    destinationAddress : "test"
}

// createUserData(userDataObject);

let searchObject = {
    email : "108122015@nitt.edu"
}

async function searchUserData (searchObject){
    try {
        // const user = await UserData.find(searchObject);
        // console.log("Found user:", user);
        // return user[0];
        const user = await UserData.findOneAndUpdate(
            { email: searchObject.email }, // Search query
            { $setOnInsert: searchObject }, // Data to insert if not found
            { new: true, upsert: true, setDefaultsOnInsert: true } 
        )
        console.log("Found user:", user);
        return user;
    }
    catch (e) {
        console.log("Error:", e.message);
    }
}

// searchUserData(searchObject);

let userObjectUpdate = {
    email : "test@test.com",
    parentName : "John Doe"
}

async function updateUserSettings(userObject){
    try {
        const user = await UserData.findOneAndUpdate(
            { email: userObject.email }, // Search query
            { $set: userObject }, // Data to insert if not found
            { new: true, upsert: true} 
        )
        console.log("Updated user:", user);
        return user;
    }
    catch (e) {
        console.log("Error:", e.message);
    }
}

async function updateUser(userObject, updateQuery) {
    try {
        const user = await UserData.findOneAndUpdate(
            userObject, // Search query
            updateQuery 
        )
        console.log("Updated user:", user);
    }
    catch (error) {
        console.log("Error updating user:", error.message);
    }
}
// updateUserData(userObjectUpdate);

module.exports = { createRequest, searchRequest, updateRequest, createUserData, searchUserData, updateUserSettings, updateUser, searchAdmin, updateAdmin }