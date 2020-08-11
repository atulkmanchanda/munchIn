import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  BrowserRouter as Router,
  Link,
  Route
} from "react-router-dom";
// import Map from './components/Map/Map.js';
// import SOSList from './components/SOSList/SOSList.js';
import Authentication from './components/Auth/Authentication.js';
import Navigation from './navigation.js';
// import Popup from 'reactjs-popup';
// // import Form from 'muicss/lib/react/form';
// import Input from 'muicss/lib/react/input';
// import Textarea from 'muicss/lib/react/textarea';
// import Button from 'muicss/lib/react/button';
// import Option from 'muicss/lib/react/option';
// import Select from 'muicss/lib/react/select';
// import { Row, Col, Container, Navbar, Form, FormCheck } from 'react-bootstrap';
// import firebaseConfig from './config.js';
// import Firebase from 'firebase';


// class SOSForm extends React.Component {
//   constructor(props){
//     super(props)
//     if (!Firebase.apps.length) {
//       Firebase.initializeApp(firebaseConfig);
//     }
//     this.state = {
//       category: null,
//       name: null,
//       contact: null,
//       desc: null
//     }
//   }

//   formFieldChangeHandler = (event) => {
//     let nam = event.target.name;
//     let val = event.target.value;
//     this.setState({[nam]: val});
//   }

//   send_sos(){
//     const timestamp = new Date().getTime();
//     const dummy_id = this.contact + "," + timestamp;
//     const data = {
//       name: this.state.name,
//       category: this.state.category,
//       phonenumber: this.state.contact,
//       description: this.state.desc,
//       latitude: parseFloat(window.localStorage.getItem("lat")),
//       longitude: parseFloat(window.localStorage.getItem("lng")),
//       timestamp: timestamp
//     }
//     console.log(data);
//     Firebase.database().ref('sos/' + dummy_id).set(data);
//     Firebase.database().ref("ChatsUnderYou/alerts/" + this.state.contact + "/" + this.state.contact + "," + timestamp).set({
//       name: this.state.name,
//       description: this.state.desc,
//       phonenumber: this.state.contact,
//       category: this.state.category,
//       counter: 0,
//       timestamp: 0,
//       alerttimestamp: timestamp,
//     });
//     console.log('DATA SAVED');
//   }

//   render() {
//     return (
//       <Form onSubmit={e => { e.preventDefault(); }}>
//         <span className="form_title">CREATE EMERGENCY</span>
//         <Select placeholder="Select Category" name="category" onChange={this.formFieldChangeHandler}>
//           <Option value="Food Supply" label="Food Supply" />
//           <Option value="Adhoc" label="Others" />
//         </Select>
//         <Input placeholder="Your Name" name="name" onChange={this.formFieldChangeHandler} />
//         <Input placeholder="Your Contact" name="contact" onChange={this.formFieldChangeHandler} />
//         <Textarea placeholder="Description" name="desc" onChange={this.formFieldChangeHandler} />
//         <Button variant="raised" onClick={() => { this.send_sos() }}>Submit</Button>
//         <Button variant="raised">Cancel</Button>
//       </Form>
//     );
//   }
// }

class App extends Component {
  constructor(props){
    super(props)
    navigator.geolocation.getCurrentPosition(function(position) {
      window.localStorage.setItem("lat", position.coords.latitude);
      window.localStorage.setItem("lng", position.coords.longitude);
    });
    
  }

  toggleBar = (event) => {
    console.log("bar");
    document.getElementById('sideBar').style.display = 'block';
    document.getElementById('content').style.display = 'none';
  }

  closeBar = (event) => {
    document.getElementById('sideBar').style.display = 'none';
    document.getElementById('content').style.display = 'block';
  }
  
  render() {
    return(
       <Router>
        <Route exact path='/' component={Authentication} />
        <Route path='/dashboard' component = {Navigation} />
    </Router>
    )
  }
}

export default App;
