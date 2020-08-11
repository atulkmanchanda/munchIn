import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
  HashRouter,
  NavLink,
  Route,
  BrowserRouter as Router
} from "react-router-dom";
import Map from './components/Map/Map.js';
import SOSList from './components/SOSList/SOSList.js';
import Popup from 'reactjs-popup';
// import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import Button from 'muicss/lib/react/button';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';
import { Row, Col, Container, Navbar, Form, FormCheck } from 'react-bootstrap';
import firebaseConfig from './config.js';
import Firebase from 'firebase';
import Chat from './components/Chat/Chat.js'


class SOSForm extends React.Component {
  constructor(props){
    super(props)
    if (!Firebase.apps.length) {
      Firebase.initializeApp(firebaseConfig);
    }
    this.state = {
      category: null,
      name: null,
      contact: null,
      desc: null
    }
  }

  formFieldChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({[nam]: val});
  }

  send_sos(){
    const timestamp = new Date().getTime();
    const dummy_id = this.contact + "," + timestamp;
    const data = {
      name: this.state.name,
      category: this.state.category,
      phonenumber: this.state.contact,
      description: this.state.desc,
      latitude: parseFloat(window.localStorage.getItem("lat")),
      longitude: parseFloat(window.localStorage.getItem("lng")),
      timestamp: timestamp
    }
    console.log(data);
    Firebase.database().ref('sos/' + dummy_id).set(data);
    Firebase.database().ref("ChatsUnderYou/alerts/" + this.state.contact + "/" + this.state.contact + "," + timestamp).set({
      name: this.state.name,
      description: this.state.desc,
      phonenumber: this.state.contact,
      category: this.state.category,
      counter: 0,
      timestamp: 0,
      alerttimestamp: timestamp,
    });
    console.log('DATA SAVED');
  }

  render() {
    return (
      <Form onSubmit={e => { e.preventDefault(); }}>
        <span className="form_title">CREATE EMERGENCY</span>
        <Select placeholder="Select Category" name="category" onChange={this.formFieldChangeHandler}>
          <Option value="Emotional Support" label="Emotional Support" />
          <Option value="Food Supply" label="Food Supply" />
          <Option value="Adhoc" label="Others" />
        </Select>
        <Input placeholder="Your Name" name="name" onChange={this.formFieldChangeHandler} />
        <Input placeholder="Your Contact" name="contact" onChange={this.formFieldChangeHandler} />
        <Textarea placeholder="Description" name="desc" onChange={this.formFieldChangeHandler} />
        <Button variant="raised" onClick={() => { this.send_sos() }}>Submit</Button>
        <Button variant="raised">Cancel</Button>
      </Form>
    );
  }
}

class Navigation extends Component {
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
      [<div className="ab-header">
        UMID
        <i class="fa fa-filter" id="filter-icon" onClick={this.toggleBar}></i>
      </div>,
      <Container fluid style={{backgroundColor: '#f7f7f7'}}>
        <Row>
            <Col md="2">
              <div id="sideBar">
                <div className="f1">
                  <h6>EMERGENCY</h6><br></br>
                  <Form>
                    <div key='em_support' className="mb-3">
                      <Form.Check 
                        type='checkbox'
                        label='Emergency Support'
                      />
                    </div>
                    <div key='food_supply' className="mb-3">
                      <Form.Check 
                        type='checkbox'
                        label='Food Supply'
                      />
                    </div>
                    <div key='adhoc' className="mb-3">
                      <Form.Check 
                        type='checkbox'
                        label='Adhoc'
                      />
                    </div>
                  </Form>
                </div>
                <hr></hr>
                <div className="f2">
                  <h6>STORES</h6><br></br>
                  <Form>
                    <div key='dep_store' className="mb-3">
                      <Form.Check 
                        type='checkbox'
                        label='Departmental Store'
                      />
                    </div>
                    <div key='med_store' className="mb-3">
                      <Form.Check 
                        type='checkbox'
                        label='Medical Store'
                      />
                    </div>
                  </Form>
                </div>
                <div className="filterOptions">
                  <button id="applyBtn">Apply</button>
                  <button id="closeBtn" onClick={this.closeBar}>Cancel</button>
                </div>
              </div>
            </Col>
            <Col md="8" id="content" style={{marginTop: '90px'}}>
            <Router>
              <Row id="panelRow">
                <Col>
                <div className="left-div">
                  <Popup modal trigger={<Button variant="danger" className="sos_button">Create SOS</Button>}>
                    <SOSForm className="form_box"/>
                  </Popup>
                </div>
                </Col>
                <Col className="navigator-block">
                <div className="right-div">
                  <ul>
                  <li className="navigators">
                    <NavLink to="/dashboard">
                      <svg class="sc-bdVaJa fUuvxv ab-icon ab-icon--sm" id="MyId64" fill="#000000" width="22px" height="22px" viewBox="0 0 1024 1024" rotate="0">
                        <path
                            d="M160 560h512v96h-512v-96z M160 368h640v96h-640v-96z M160 176h704v96h-704v-96z M160 752h576v96h-576v-96z">
                        </path>
                    </svg> &nbsp; List
                    </NavLink>
                    </li>
                    <li className="navigators">
                    <NavLink to="/map"><div>
                    <svg class="sc-bdVaJa fUuvxv ab-icon ab-icon--sm" fill="#000000" width="22px" height="22px" viewBox="0 0 1024 1024" rotate="0">
                      <path
                          d="M512 96c-159 0-288 119.8-288 267.4 0 208 288 564.6 288 564.6s288-356.6 288-564.6c0-147.6-129-267.4-288-267.4zM512 477.8c-51.8 0-93.8-42-93.8-93.8s42-93.8 93.8-93.8 93.8 42 93.8 93.8-42 93.8-93.8 93.8z">
                      </path>
                    </svg>&nbsp; Map</div></NavLink>
                    </li>
                  </ul>
                </div>
                </Col>
              </Row>
              <Row className="view">
                <Route exact path="/dashboard" component={SOSList}/>
                <Route path="/map" component={Map}/>
              </Row>
            </Router>
            </Col>
          <Row><Chat/></Row>
        </Row>
      </Container>
      ]
    )
  }
}

export default Navigation;
