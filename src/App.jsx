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
    this.handleDeenroll = this.handleDeenroll.bind(this);
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
        if (this.state.userType === 'parent') {
          var childLastName = results.data.pop()
          var childFirstName = results.data.pop();
          this.setState({
            childFirstName: childFirstName,
            childLastName: childLastName,
          });
        }
        var pod = results.data.pop();
        this.setState({
          loaded: true,
          classList: results.data,
          pod: pod,
        });
      }).catch((err) => {
        console.log(err, this.state.firstName);
      });
  }

  handleDeenroll(e) {
    axios.post('/user/', {
      deleteThisClass: e.target.value,
      childLastName: this.state.childLastName,
      childFirstName: this.state.childFirstName,
    })
      .then((results) => {
        this.handleSubmit();
      })
  }

  render() {
    var isParent = this.state.userType === 'parent';
    var isNotStudent = this.state.userType !== 'student';
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
        <br></br>
        <h3 style={isParent && this.state.loaded ? {} : {display: "none"}}>{this.state.childFirstName}'s Current Classes</h3>
        {this.state.classList.length === 0 ? '' : this.state.classList.map((item) => {
          return (
            <div>
              <h4>{item.class_name}<br></br></h4>
              <span>Start Date: {item.start_date}<br></br></span>
              <span>End Date: {item.end_date}<br></br></span>
              <span>Days: {item.days}<br></br></span>
              <span>Zoom Room: <a href={'"' + item.export_zoom + '"'}>{item.expert_zoom}</a><br></br></span>
              <span style={isNotStudent ? {} : {display: "none"}}>Session Rate: ${item.rate}<br></br></span>
              <span style={isNotStudent ? {} : {display: "none"}}>Weekly Rate: ${parseInt(item.rate) * item.days.length}<br></br></span>
              <button style={isParent ? {marginTop: "4px", marginLeft: "auto", marginRight: "auto", display: "block"} : {display: "none"}} type="button" onClick={this.handleDeenroll} value={item.class_name}> De-enroll from {item.class_name} </button>
            </div>
          );
        })}
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
          <form style={{marginTop: "4px", marginLeft: "auto", marginRight: "auto", display: "block"}}>
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
            <button style={{marginTop: "4px", marginLeft: "auto", marginRight: "auto", display: "block"}} type="button" onClick={this.handleSubmit}> Log In </button>
            <br></br>
          </form>
          <span style={!isParent ? {display: "none"} : {}}> Child First Name: {this.state.childFirstName}<br></br></span>
          <br></br>
          <span style={!isParent ? {display: "none"} : {}}> Child Last Name: {this.state.childLastName}<br></br></span>
          <br></br>
          <span> Pod: {this.state.pod}<br></br></span>
          <br></br>
          <div> Classes:
          <br></br>
            {
              this.state.classList.map((item) => {
                return (<span><br></br>{item.class_name}</span>);
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
