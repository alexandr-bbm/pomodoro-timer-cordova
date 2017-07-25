import React, { Component } from 'react';
import { render } from 'react-dom';
import Timer from './components/Timer/index.js';

import 'reset-css/reset.css';
import './styles/main.css';

class App extends Component {
  render() {
    return (
      <Timer />
    )
  }
}

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  render(<App />, document.getElementById('app'));
}
