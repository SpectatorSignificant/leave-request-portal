import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from "./Login";
import Home from "./Home";
import Chat from "./Chat";
import Pending from  "./Pending";
import Past from  "./Past";

class App extends Component {

  render() {
    return (
      <Router>
            <Routes>
                <Route exact path="/" Component={Login}/>
                <Route path="/home" Component={Home}/>
                <Route path="/pending" Component={Pending}/>
                <Route path="/past" Component={Past}/>
                {/* <Route path="/chat" Component={Chat}/> */}
            </Routes>
      </Router>
    );
  }
}

export default App;