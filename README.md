# Project Title

The goal of this project is to create an online portal to file hostel leave applications that could replace paper applications.


## Set up

1. clone this repository and `cd` into the directory
2. Open a new terminal and type
```
cd user-portal
npm install
PORT=3000 npm start
```
3. Open a new terminal and type
```
cd admin-portal
npm install
PORT=3002 npm start
```
4. Open a new terminal and type 
```
npm install
nodemon server.js
```
You may use `node` instead of `nodemon`

### Prerequisites

You will need to install Nodejs, NPM, and MongoDB to run this application.


## Usage
Login to the user portal using DAuth. Login to the admin portal using the credentials `email: aqua@test.com` and `password: 1234`. This is the default admin that will be intialized with the project and it is the only admin account you can use.

## Features

- Send a leave request using the user portal
- View pending and past requests
- Set default answers that will be automatically filled into the request form when you open it. However, these can be modified before submission.
- Approve or Deny incoming requests using the admin portal
- View pending and past requests

The application is pretty secure because it fetches details such as name, email, phone number from DAuth and auto-fills them.

Features to be implemented include:
- a QR code that can be scanned to verify an approved request. Details are verified and updated automatically in the backend