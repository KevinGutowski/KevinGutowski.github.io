import React, { Component } from 'react';
import name from './name.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="home-title">
          <img src={name} className="App-logo" alt="logo" />
        </div>
        <div className="home-description">
          <p>Half-snack pixel miner at <a href="https://www.gradescope.com">Gradescope</a>.</p>
          <p>I write stuff on <a href="https://medium.com/@kevingutowski">Medium</a>.</p>
          <p>Here's some stuff on <a href="">accessible color spaces</a>.</p>
        </div>
      </div>
    );
  }
}

export default App;
