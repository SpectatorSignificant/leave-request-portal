import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./Home";
import Application from "./Application";
import Login from "./Login";
import Settings from "./Settings"
import Pending from './Pending';
import Past from "./Past";
import './App.css';

class App extends Component {

  render() {
    return (
      <Router>
            <Routes>
                <Route exact path="/" Component={Login}/>
                <Route path="/home" Component={Home} />
                <Route path="/application" Component={Application} />
                <Route path="/pending" Component={Pending} />
                <Route path="/past" Component={Past} />
                <Route path='/settings' Component={Settings} />
            </Routes>
      </Router>
    );
  }
}

export default App;