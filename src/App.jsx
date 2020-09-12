import React from 'react';
import Classes from './Classes.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: 'student',
    }
  }

  render() {
    return (<div>
      <div style={{width: "66%", display: "inline-block"}}>{this.state.userType === '' ? 'Please select a user' : ''}</div>
      <div style={{width: "33%", display: "inline-block"}}>Navigator</div>
    </div>);
  }
}

export default App;
