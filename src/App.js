//Created by: Byron Georgopoulos
//Created on: 24/07/2020
//Last Updated on: 29/07/2020
//Created for: HyperionDev: L02T12 - Capstone I
//Description: This is the main App.js component for my Blackjack game, made using 'npx create-react-app.

//Import React
import React, { Component } from 'react';

//Import Component(s)
import Blackjack from './Components/Blackjack.js';

//Styling
//My custom CSS
import './App.css';
//React-Boostrap
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='App'>
          <Blackjack/>
      </div>
    );
  }
}

export default App;