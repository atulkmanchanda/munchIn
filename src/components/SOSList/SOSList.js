import React, { Component } from 'react';
import './SOSList.css';
import { ListGroup, Button } from 'react-bootstrap';
import firebaseConfig from '../../config.js';
import Firebase from 'firebase';
import { getDistance } from 'geolib';
import Chat from '../Chat/Chat';
import {chatService} from '../../chatService';
const x = getDistance(
    { latitude: 51.5103, longitude: 7.49347 },
    { latitude: "51° 31' N", longitude: "7° 28' E" }
);

class SOSList extends Component {
    constructor(props){
        super(props)
        if (!Firebase.apps.length) {
          Firebase.initializeApp(firebaseConfig);
        }
        // this.createChat = this.createChat.bind(this);
        this.user=JSON.parse(localStorage.getItem("user"));
        this.contact=this.user["phone"];
        this.state = {
            currentPosition: {
                lat: 51, lng: 7
            },
            chatList:[],
            sos: []
        }
    }

    componentDidMount(){
        window.navigator.geolocation.getCurrentPosition(
            success => this.setState({
              currentPosition: { lat: success.coords.latitude, lng: success.coords.longitude }
            })
        );
        Firebase.database().ref("sos").on("value", snapshot => {
            let sos_markers = [];
            snapshot.forEach((snap) => {
              sos_markers.push(snap.val());
            });
            console.log(sos_markers);
             this.setState({sos: sos_markers});
            console.log(this.state.sos);
        });
    }


    render() {
       const createChat=(e,obj)=> {
            chatService.sendMessage('Messg');
             console.log("obj",obj)
             var c = 0
             if(this.state.chatList.length!=0){
             this.state.chatList.forEach(chat => {
               if(chat.category == "shops"){
                 if(chat.phonenumber == obj.phonenumber)
                 {
                     console.log("Im in")
                     c++;
                 }
             }
             else{
                 if(chat.alerttimestamp == obj.timestamp)
                 {
                     console.log("Im in")
                     c++;
                 }
             }
             
             })}
             // console.log(c)
             if(c==0){
                 if(obj.category == "Emotional Support"){
                       Firebase.database().ref("ChatsUnderYou/Anonymous/"+this.contact+"/"+obj.phonenumber+","+obj.timestamp).set({
                         name: obj.name,
                         description: obj.description,
                         phonenumber:obj.phonenumber,
                         category: obj.category,
                         timestamp: 0,
                         alerttimestamp: obj.timestamp,
                     }).then(() => {
                         Firebase.database().ref("ChatsUnderYou/Anonymous/"+obj.phonenumber+"/"+this.contact+","+obj.timestamp).set({
                             name: obj.name,
                             description: obj.description,
                             phonenumber:this.contact,
                             category: obj.category,
                             timestamp: 0,
                             alerttimestamp: obj.timestamp,
                         })
                         }).then(() => {
                           //this.router.navigate(['/dashboard/chat']);
                         })
                       }
                         else if(obj.category == "kirana" || obj.category == "chemist") {
                             Firebase.database().ref("ChatsUnderYou/vendors/"+this.contact+"/"+obj.PhoneNumber).set({
                                 name: obj.name,
                                 phonenumber:this.contact,
                                 category: "shops",
                                 timestamp: 0,
                             }).then(() => {
                                 Firebase.database().ref("ChatsUnderYou/vendors/"+obj.PhoneNumber+"/"+this.contact).set({
                                     name: obj.name,
                                     phonenumber:obj.PhoneNumber,
                                     category: "shops",
                                     timestamp: 0,
                                 })
                                 }).then(() => {
                                 //  this.router.navigate(['/dashboard/chat']);
                                 })
                         }
                 else {
                     console.log("here");
                     Firebase.database().ref("ChatsUnderYou/alerts/"+this.contact+"/"+obj.phonenumber+","+obj.timestamp).set({
                         name: obj.name,
                         description: obj.description,
                         phonenumber:obj.phonenumber,
                         category: obj.category,
                         timestamp: 0,
                         alerttimestamp: obj.timestamp,
                     }).then(() => {
                      // this.router.navigate(['/dashboard/chat']);
                     })}
             }else{
              // this.router.navigate(['/dashboard/chat']);
             }
           }
        return(
            <>
            <ListGroup id="list-view">
                {this.state.sos.map(function(s, index) {
                    return (
                    <ListGroup.Item className="list-item" key={index}>
                        <div className="list-div" id="main_div">
                            <h5>{s.category}</h5>
                            <span>{s.name}</span>
                            <br></br>
                            <span>Distance: 1.98 km</span>
                        </div>
                        <div className="list-div featured-btn">
                            <button className="functional-btn btn-class" onClick={(e)=>createChat(e,s)}>Chat</button>
                            <button className="functional-btn btn-class">Call</button>
                            <button className="functional-btn btn-class">Delete</button>
                        </div>
                    </ListGroup.Item>)
                })}
            </ListGroup>
            {/* <Chat/> */}
            </>
        )
    }
}


export default SOSList;