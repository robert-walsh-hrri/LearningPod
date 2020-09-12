import React from 'react';
import Classes from './Classes.jsx';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userType: '',
      firstName: '',
      lastName: '',
      loaded: false,
      childFirstName: '',
      childLastName: '',
      pod: '',
      classList: [],
    }
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleRadioChange(e) {
    this.setState({userType: e.target.value});
  }

  handleFirstNameChange(e) {
    this.setState({firstName: e.target.value});
  }

  handleLastNameChange(e) {
    this.setState({lastName: e.target.value});
  }

  handleSubmit() {
    axios.get(`/user/userType:${this.state.userType}&firstName${this.state.firstName}&lastName${this.state.lastName}`)
      .then((results) => {
        this.setState({loaded: true});
      }).catch((err) => {
        console.log(err, this.state.firstName);
      });
  }

  render() {
    var isParent = this.state.userType === 'parent';
    return (
    <div style=
      {
        {
          display: "flex",
          flexDirection: "row",
        }
      }
    >
      <div style=
        {
          {
            width: "66%",
            display: "inline-block"
          }
        }
      >
        {this.state.loaded === false ? 'Please log in' : this.state.firstName + ' is logged in.'}
      </div>
      <div style=
        {
          {
            width: "33%",
            display: "inline-block",
          }
        }
      >

        <div>
          <form>
            <label
              for="firstName"
              style={{display: "inline"}}
            >
              &nbsp;First Name:&nbsp;
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={this.handleFirstNameChange}
              style={{display: "inline"}}
            ></input>
            <br></br>
            <label
              for="lastName"
              style={{display: "inline"}}
            >
              &nbsp;Last Name:&nbsp;
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={this.handleLastNameChange}
              style={{display: "inline"}}
            ></input>
            <br></br>
            <input
              type="radio"
              id="student"
              name="userType"
              value="student"
              onChange={this.handleRadioChange}
              style={{display: "inline"}}
            ></input>
            <label
              for="student"
            >
              Student
            </label>
            <input
              type="radio"
              id="parent"
              name="userType"
              value="parent"
              onChange={this.handleRadioChange}
              style={{display: "inline"}}
            ></input>
            <label
              for="parent"
            >
              Parent
            </label>
            <input
              type="radio"
              id="expert"
              name="userType"
              value="expert"
              onChange={this.handleRadioChange}
              style={{display: "inline"}}
            ></input>
            <label
              for="expert"
            >
              Expert
            </label>
            <br></br>
            <button type="button" onClick={this.handleSubmit}> Log In </button>
          </form>
          <span style={!isParent ? {display: "none"} : {}}> Child First Name: {this.state.childFirstName}</span>
          <br></br>
          <span style={!isParent ? {display: "none"} : {}}> Child Last Name: {this.state.childLastName}</span>
          <br></br>
          <span> Pod: {this.state.pod}</span>
          <br></br>
          <div> Classes:
            {
              this.state.classList.map((item) => {
                return (<span>{item}</span>);
                })
            }
          </div>
          <br></br>
        </div>
      </div>
    </div>);
  }
}

export default App;
