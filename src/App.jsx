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
      restClasses: [],
      // extend state for createClass
      createClassName: '',
      createClassStartDate: '',
      createClassEndDate: '',
      createClassDays: '',
      createClassRate: '',
    }
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeenroll = this.handleDeenroll.bind(this);
    this.handleEnroll = this.handleEnroll.bind(this);
    this.handleCreateClassName = this.handleCreateClassName.bind(this);
    this.handleCreateClassStartDate = this.handleCreateClassStartDate.bind(this);
    this.handleCreateClassEndDate = this.handleCreateClassEndDate.bind(this);
    this.handleCreateClassDays = this.handleCreateClassDays.bind(this);
    this.handleCreateClassRate = this.handleCreateClassRate.bind(this);
    this.handleCreateClassPost = this.handleCreateClassPost.bind(this);
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

  handleCreateClassName(e) {
    this.setState({createClassName: e.target.value});
  }

  handleCreateClassStartDate(e) {
    this.setState({createClassStartDate: e.target.value});
  }

  handleCreateClassEndDate(e) {
    this.setState({createClassEndDate: e.target.value});
  }

  handleCreateClassDays(e) {
    this.setState({createClassDays: e.target.value});
  }

  handleCreateClassRate(e) {
    this.setState({createClassRate: e.target.value});
  }

  handleCreateClassPost() {
    axios.post('/create_class/', {
      createClassName: this.state.createClassName,
      createClassStartDate: this.state.createClassStartDate,
      createClassEndDate: this.state.createClassEndDate,
      createClassDays: this.state.createClassDays,
      createClassRate: this.state.createClassRate,
    })
      .then((results) => {
        alert('Class added for Expert Review');
        this.handleSubmit();
      })
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
      })
      .then(() => {
        if (this.state.userType === 'parent') {
          axios.get(`/classes/firstName${this.state.childFirstName}&lastName${this.state.childLastName}`)
            .then((results) => {
              this.setState({
                restClasses: results.data,
              })
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((err) => {
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

  handleEnroll(e) {
    axios.post('/enroll/', {
      enrollClass: e.target.value,
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
      <div>
        <div style={
          {
            width: "100%",
            display: "inline-block",
            textAlign: "left",
          }
        }>
          <h2>LEARNING POD</h2>
        </div>
        <hr style={{
          width: "66%",
          marginLeft: "0px",

        }}></hr>
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
                  <button style={isParent ? {marginTop: "4px", marginLeft: "15px", marginRight: "auto", display: "block"} : {display: "none"}} type="button" onClick={this.handleDeenroll} value={item.class_name}> De-enroll from {item.class_name} </button>
                </div>
              );
            })}
            <hr></hr>
            <h3 style={isParent && this.state.loaded ? {} : {display: "none"}}> Some other classes {this.state.childFirstName} might be interested in </h3>
            {this.state.restClasses.length === 0 ? '' : this.state.restClasses.map((item) => {
              return (
                <div>
                  <h4>{item.class_name}<br></br></h4>
                  <span>Start Date: {item.start_date}<br></br></span>
                  <span>End Date: {item.end_date}<br></br></span>
                  <span>Days: {item.days}<br></br></span>
                  <span>Zoom Room: <a href={'"' + item.export_zoom + '"'}>{item.expert_zoom}</a><br></br></span>
                  <span style={isNotStudent ? {} : {display: "none"}}>Session Rate: ${item.rate}<br></br></span>
                  <span style={isNotStudent ? {} : {display: "none"}}>Weekly Rate: ${parseInt(item.rate) * item.days.length}<br></br></span>
                  <button style={isParent ? {marginTop: "4px", marginLeft: "15px", marginRight: "auto", display: "block"} : {display: "none"}} type="button" onClick={this.handleEnroll} value={item.class_name}> Enroll {this.state.childFirstName} in {item.class_name} </button>
                </div>
              );
            })}
          </div>
          <div style=
            {
              {
                width: "33%",
                display: "inline-block",
                position: "fixed",
                top: 30,
                right: 0,
                backgroundColor: "000000",
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
              <span style={!isParent ? {display: "none"} : {}}> Child: {this.state.childFirstName} {this.state.childLastName}<br></br></span>
              <br></br>
              <span> Pod: {this.state.pod}<br></br></span>
              <div> <h4>Classes: </h4>
                {
                  this.state.classList.map((item) => {
                    return (<span>{item.class_name}<br></br></span>);
                    })
                }
              </div>
              <br></br>
              <div style={isParent ? {} : {display: "none"}}> Weekly Fee: ${this.state.classList.reduce((a, b) => {
                return a + b.rate * b.days.length;
              }, 0)}
              </div>
              <br></br>
              <div>
                Not seeing the curriculum you need for {this.state.childFirstName}'s education? Feel free to create a class below and we'll let you know when an expert is ready to begin teaching it.
                <br></br>
                <form style={{marginTop: "4px", marginLeft: "auto", marginRight: "auto", display: "block"}}>
                  <label
                    for="createClassName"
                    style={{display: "inline"}}
                  >
                    &nbsp;Class Name:&nbsp;
                  </label>
                  <input
                    type="text"
                    id="createClassName"
                    name="createClassName"
                    onChange={this.handleCreateClassName}
                    style={{display: "inline"}}
                  ></input>
                  <br></br>
                  <label
                    for="createClassStartDate"
                    style={{display: "inline"}}
                  >
                    &nbsp;Start Date:&nbsp;
                  </label>
                  <input
                    type="text"
                    id="createClassStartDate"
                    name="createClassStartDate"
                    onChange={this.handleCreateClassStartDate}
                    style={{display: "inline"}}
                  ></input>
                  <br></br>
                  <label
                    for="createClassEndDate"
                    style={{display: "inline"}}
                  >
                    &nbsp;End Date:&nbsp;
                  </label>
                  <input
                    type="text"
                    id="createClassEndDate"
                    name="createClassEndDate"
                    onChange={this.handleCreateClassEndDate}
                    style={{display: "inline"}}
                  ></input>
                  <br></br>
                  <label
                    for="createClassDays"
                    style={{display: "inline"}}
                  >
                    &nbsp;School Days (Capital letters, MTWHF) :&nbsp;
                  </label>
                  <input
                    type="text"
                    id="createClassDays"
                    name="createClassDays"
                    onChange={this.handleCreateClassDays}
                    style={{display: "inline"}}
                  ></input>
                  <br></br>
                  <label
                    for="createClassRate"
                    style={{display: "inline"}}
                  >
                    &nbsp;Rate per class per child:&nbsp;
                  </label>
                  <input
                    type="text"
                    id="createClassRate"
                    name="createClassRate"
                    onChange={this.handleCreateClassRate}
                    style={{display: "inline"}}
                  ></input>
                  <br></br>
                  <br></br>
                  <button style={{marginTop: "4px", marginLeft: "auto", marginRight: "auto", display: "block"}} type="button" onClick={this.handleCreateClassPost}> Create Class Request </button>
                  <br></br>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>);

  }
}

export default App;
