const express = require("express");
const axios  = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");

const { createRequest, searchRequest, updateRequest, createUserData, updateUser, searchUserData, updateUserSettings, searchAdmin, updateAdmin } = require("./mongoose");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3001;
// const redirectUri = "http://localhost:3001/test";
// const redirectUri = "http://localhost:3000/home";
let redirectUri;
const clientId = "OtCzfa3nOkEI8CVp";
const clientSecret = "lxaH12l2JaCwbftR4483yBXB-pq0UPv7";

app.get("/api/v0/", (req, res) => {
    res.redirect("/login")
})

app.get("/api/v0/login", (req, res) => {
	console.log(`${req.headers.referer}home`)
	redirectUri = `${req.headers.referer}home`;

    res.redirect(
        `https://auth.delta.nitt.edu/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&grant_type=authorization_code&state=sending&scope=openid+user&nonce=receiving`
    );
})

app.get("/test", (req, res) => {
  	console.log("Ok");
  	const code = req.query.code;
  	const state = req.query.state;
  	console.log({code, state});

  	const postData = new URLSearchParams();
  	postData.append('client_id', clientId);
  	postData.append('client_secret', clientSecret);
  	postData.append('grant_type', "authorization_code");
  	postData.append('code', code);
  	postData.append('redirect_uri', redirectUri);

	axios.post("https://auth.delta.nitt.edu/api/oauth/token", postData)
  	.then((response) => {
    	console.log(response.data);
    	axios.post("https://auth.delta.nitt.edu/api/oauth/token", postData)
    	.then((response) => {
      		console.log(response.data);
    	})
    	.catch((error) => {
      		console.log(error.message);
    	})
    })
  	.catch((error) => {
    	console.log(error.message);
	})

	res.send("Ok");
})

app.post("/api/v0/token", (req, res) => {
  // const code = "064f27d653eb4d27161fae522d478852f72eae1d";
  // const state = "testing";
  	const code = req.body.code;
  	const state = req.body.state;

  	console.log({code, state});

  	const postData = new URLSearchParams();
  	postData.append('client_id', clientId);
  	postData.append('client_secret', clientSecret);
  	postData.append('grant_type', "authorization_code");
  	postData.append('code', code);
  	postData.append('redirect_uri', redirectUri);

  	axios.post('https://auth.delta.nitt.edu/api/oauth/token', postData)
  	.then((response) =>  {
    	// res.redirect("https://auth.delta.nitt.edu/oauth/oidc/key");
    	const accessToken = response.data.access_token;
    	// const accessToken = "fa65b7175046a3670de3b8c07922232906763eaf";
    	const idToken = response.data.id_token;
    	console.log("Token response:", response.data);
    	res.json({ accessToken })
  	})
  	.catch((error) => {
    	console.log("Error posting:", error.message);
    	res.status(error.response.status).send(error);
  	});

})

app.post("/api/v0/user", (req, res) => {
  	const headers = {
    	"Authorization": `Bearer ${req.body.accessToken}`,
  	};

  	axios.post("https://auth.delta.nitt.edu/api/resources/user", {}, { headers })
  	.then((response) => {
    	console.log("User object:", response.data);
    	res.status(200).json(response.data);
  	})
  	.catch((error) => {
    	console.log("Error accessing user object:", error.message);
    	res.status(error.response.status).send(error);
    })
})

app.post("/api/v0/authenticate-admin", (req, res) => {
	const adminObject = req.body;

	searchAdmin({email : adminObject.email})
	.then((response) => {
		if (response && response.password == adminObject.password) {
			// console.log(response, response.password);
			res.json({...response.toObject(), password: null, success: true});
		}
		else {
			res.json({success: false});
		}
	})
	.catch((error) => {
		console.log("Error searching admin", error.message);
	})
})

app.post("/api/v0/search-admin", (req, res) => {
	const adminObject = req.body;

	searchAdmin({_id: adminObject._id})
	.then((response) => {
		if (response) {
			// console.log(response, response.password);
			res.json({...response.toObject(), success: true});
		}
		else {
			res.json({success: false});
		}
	})
	.catch((error) => {
		console.log("Error searching admin", error.message);
	})
})

app.post("/api/v0/updatedb", (req, res) =>  {
  	const userObject = req.body;
	updateUserSettings(userObject)
	.then((response) => {
		const updatedUser = response;

		res.json(updatedUser);
	})
	.catch((error) => {	
		console.log("Error updating db", error.message);
	})
})

app.post("/api/v0/searchdb", (req, res) => {
  	const searchObject = req.body;
  	searchUserData(searchObject)
	.then((response) => {
		const userFromDB = response;

		res.json(userFromDB);
	})
	.catch((error) => {
		console.log("Error searching db", error.message);
	})
})

app.post("/api/v0/createrequest", (req, res) => {
	// const requestObject = req.body;
	// const adminId = new mongoose.Types.ObjectId('6666a1c302c23bf58da26a13');
	// const userId = new mongoose.Types.ObjectId(req.body.userId);

	// console.log(adminId, userId);

	const requestObject = {
		userId: req.body.userId,
		adminId: '6666a1c302c23bf58da26a13',
		email: req.body.userObject.email,
		name: req.body.userObject.name,
		phoneNumber: req.body.userObject.phoneNumber,
		dateFrom: req.body.dateFrom,
		dateTo: req.body.dateTo,
		parentName: req.body.parentName,
		parentPhone: req.body.parentPhone,
		destinationAddress: req.body.destinationAddress,
		hostelName: req.body.hostelName,
		roomNumber: req.body.roomNumber,
		reason: req.body.reason
	}

	// console.log("requestObject:", requestObject);

	createRequest(requestObject)
	.then((response) => {
		const _id = response._id;
		console.log("response in node:", response);
		updateUser({email: req.body.userObject.email}, {$push: {pending: {$each: [_id], $position: 0}}})
		.then(() => {
			updateAdmin({email: "aqua@test.com"}, {$push: {pending: {$each: [_id], $position: 0}}})
			.then(() => {
				console.log("Added request to db");
				res.json({success: true});
			})
			.catch((error) => {
				throw error;
			})
		})
		.catch((error) => {
			throw error;
		})
	})
	.catch((error) => {
		// console.error(error);
		console.log("Error creating request", error.message);
	})
})

app.post("/api/v0/retrieverequest", (req, res) => {
	console.log("req.body:", req.body);
	const requestID = req.body.requestID;
	searchRequest({_id: requestID})
	.then((response) => {
		res.json(response);
	})
})

app.post("/api/v0/update-request-past", (req, res) => {
	const requestId = req.body.requestId;
	const adminId = req.body.adminId;
	const userId = req.body.userId;
	const status = req.body.status;
	console.log({requestId, adminId, userId, status});

	const updateQuery = {$set: {status}};

	updateRequest({_id: requestId}, updateQuery)
	.then(() => {
		updateAdmin({_id: adminId}, {$pull: {pending: requestId}, $push: {past: {$each: [requestId], $position: 0}}})
		.then(() => {
			updateUser({_id: userId}, {$pull: {pending: requestId}, $push: {past: {$each: [requestId], $position: 0}}})
			.then(() => {
				res.json({success: true});
			})
			.catch((error) => {
				throw error;
			})
		})
		.catch((error) => {
			throw error;
		})
	})
	.catch((error) => {
		console.log("Error updating request:", error.message);
	})
})

app.get("/api/v0/home", (req, res) => {
  	res.json({message: "You are successfully logged in"});
})

app.listen(PORT, (req, res) => {
    console.log(`Server started on PORT ${PORT}`);
})