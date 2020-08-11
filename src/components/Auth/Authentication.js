import React, { Component } from 'react';
import { render } from '@testing-library/react';
import Firebase from "firebase";
import config from "../../config";
import {
  BrowserRouter as Router,
  Link,
  Route
} from 'react-router-dom'
import './Authentication.css'
// import { faHome } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from './Logo-White.jpg' 
import _ from 'lodash';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import Navigation from '../../navigation.js';


class Authentication extends Component
{
 b64_table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

constructor(props)
{
    super(props)
    if (!Firebase.apps.length) {
        Firebase.initializeApp(config);
    } 

    this.state={
      login:"true",
      signup :"false",
      name:"",
      phonenumber:"",
      address:"",
      city:"",
      state:"",
      categoryType:"",
      category:"",
      password:"",
      phonenumber:"",
      errorMessage:'',
      errorOccurred:"false"
    }
}

    encode(key, data) {
      console.log(key,data)
      data = this.xor_encrypt(key, data);
      return this.b64_encode(data);
    }
    decode(key, data) {
      data = this.b64_decode(data);
      return this.xor_decrypt(key, data);
    }
 

 
b64_encode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";
    if (!data) { return data; }
    do {
      o1 = data[i++];
      o2 = data[i++];
      o3 = data[i++];
      bits = o1 << 16 | o2 << 8 | o3;
      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;
      enc += this.b64_table.charAt(h1) + this.b64_table.charAt(h2) + this.b64_table.charAt(h3) + this.b64_table.charAt(h4);
    } while (i < data.length);
    r = data.length % 3;
    return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
  }
 b64_decode(data) {
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];
    if (!data) { return data; }
    data += "";
    do {
      h1 = this.b64_table.indexOf(data.charAt(i++));
      h2 = this.b64_table.indexOf(data.charAt(i++));
      h3 = this.b64_table.indexOf(data.charAt(i++));
      h4 = this.b64_table.indexOf(data.charAt(i++));
      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
      o1 = bits >> 16 & 0xff;
      o2 = bits >> 8 & 0xff;
      o3 = bits & 0xff;
      result.push(o1);
      if (h3 !== 64) {
        result.push(o2);
        if (h4 !== 64) {
          result.push(o3);
        }
      }
    } while (i < data.length);
    return result;
  }
 
 xor_encrypt(key, data) {
   console.log(data,key);
    return _.map(data, function(c, i) {
      return c.charCodeAt(0) ^ key.charCodeAt( Math.floor(i % key.length) );
    });
  }
xor_decrypt(key, data) {
    return _.map(data, function(c, i) {
      return String.fromCharCode( c ^ key.charCodeAt( Math.floor(i % key.length) ) );
    }).join("");
  }
 


handleChange(event) {
  console.log(event.target.name)
  this.setState({
    [event.target.name]: event.target.value
});
}
switch(type) {
  console.log(this.state);
  if (type=='login') {
    this.setState(
         {login : "true", signup :"false",name:"", phonenumber:"", address:"", city:"",state:"",categoryType:"",
         category:"",password:"",phonenumber:"",errorMessage:'',errorOccurred:"false" }
    )
  }
    else {
      this.setState(
        {login : "false", signup :"true",name:"", phonenumber:"", address:"", city:"",state:"",categoryType:"",
        category:"",password:"",phonenumber:"",errorMessage:'',errorOccurred:"false" }
   )
  }
  console.log(this.state);
}

submitUser(event) {
  event.preventDefault();
  let category;
  // console.log(this.categorytype);
  
  if (this.state.categorytype == 'individual') {
    category = 'individual'
  } else {
    category = this.state.category
  }
  //add encryption
//check for the user
Firebase.database().ref('SignUpInComplete/'+this.state.phonenumber).limitToFirst(1).once("value", snapshot => {
  if (snapshot.exists()){
    this.setState({errorOccurred:"true"});
    this.setState({errorMessage:"User already exists"});
     console.log("exists!");
     return false;
  }
  else{
    let Password_for_Db = this.encode("U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=",this.state.password)
    console.log(Password_for_Db);
    Firebase.database().ref('SignUpInComplete/' + this.state.phonenumber).set({
      category: this.state.category,
      City: this.state.city,
      Password: Password_for_Db,
      State: this.state.state,
      address: this.state.address,
      name: this.state.name,
      PhoneNumber: this.state.phonenumber,
      Organisation: '',
      isRegistered: '',
      latitude: '',
      longitude: '' 
    }).then(res => {
      localStorage.setItem('user', JSON.stringify({'phone': this.state.phonenumber,'name': this.state.name}))
      this.props.history.push('/dashboard');
    }).catch(err => {
      // console.log(err);
      
    });
  }
})
  // .then(res => {
  //   console.log(res);
    
    // localStorage.setItem('user', this.PhoneNumber);
    // this.router.navigate(['/dashboard']);
  // }).catch(err => {
  //   alert('Something went wrong');
  // })
}

signIn(e) {
  console.log("yes");
  e.preventDefault();
  console.log("sign in")
  const data = {
    PhoneNumber: this.state.phonenumber,
    Password: this.state.password
  }

  let pro = new Promise((resolve,reject) => {
    Firebase.database().ref('SignUpInComplete/' + this.state.phonenumber).on("value", snapshot => {
      // const password = snapshot.val().Password;
      let bytes  = snapshot.val().Password;
      let originalText = this.decode("U2FsdGVkX1/Fn2uijfNNp61r1otCzb6VP1ss8rtsnSA=",bytes);
      console.log(originalText)
      if (originalText == this.state.password) {
        const data = {
          phone: snapshot.val().PhoneNumber,
          name: snapshot.val().name
        }
        console.log("here");
        resolve(data);
        
      } else {
        console.log("login failed");
        this.setState({errorOccurred:"true"});
        this.setState({errorMessage:"Invalid Credentials!!"});
        reject();
      }      
    });
  })

  pro.then(res => {
    console.log(res);
    console.log("login success");
    localStorage.setItem('user', JSON.stringify(res))
    this.props.history.push('/dashboard');
  }).catch(err => {
    this.errorOccurred="true";
    this.errorMessage="Wrong number or password";
  })

  

  // var chekcUser = this.fire.getUser(, this.Password);
  // if (chekcUser == 'true') {
  //   this.router.navigate(['/dashboard']);
  // }
}

render()
    {
    return (
      <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-pic js-tilt" data-tilt>
            <div className="imgDiv">
               <img src={require("./Logo-White.jpg")} alt="IMG"/>
            </div>
          </div>
  
         {this.state.login==="true" &&  <form className="login100-form">
            <span className="login100-form-title">
              Member Login
            </span>
  
            <div className="wrap-input100 validate-input" >
              <input className="input100" type="text" value={this.state.phonenumber} onChange={this.handleChange.bind(this)}  name="phonenumber" placeholder="Phone Number" />
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>
  
            <div className="wrap-input100 validate-input" data-validate = "Password is required">
              <input className="input100" type="password" value={this.state.password} onChange={this.handleChange.bind(this)} name="password" placeholder="Password"/>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            
             

            <div className="container-login100-form-btn">
              <NavLink to='/dashboard'><button className="login100-form-btn" onClick={(e)=>this.signIn(e)}>
                Login
              </button>
              </NavLink>
            </div>
            {this.state.errorOccurred && <div  style={{marginTop:'10px', color : 'red', textAlign:'center'}} className="wrap-input100 validate-input" >
               {this.state.errorMessage}
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>}
            {/* <div className="text-center p-t-12">
              <span className="txt1">
                Forgot
              </span>
              <a className="txt2" href="#">
                Username / Password?
              </a>
            </div> */}
  
            <div className="text-center p-t-136" onClick={(type)=>{this.switch('signup')}}>
              <a className="txt2" href="#">
                Create your Account
                <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
              </a>
            </div>
          </form>
        }
          {this.state.signup==="true" &&  <form className="login100-form validate-form">
            <span className="login100-form-title">
              Member Signup
            </span>
  
            <div className="wrap-input50 validate-input">
            <div className="labelBox">
            <label style={{marginLeft:'10px'}}>Name</label>
            <input type="text" className="input50" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} placeholder="Name*"  required autoComplete="off" />
            </div>
            <div className="labelBox">
            <label style={{marginLeft:'10px'}}>Phone Number</label>
            <input type="text" className="input50" name="phonenumber" required placeholder="Phone Number*" value={this.state.phonenumber} onChange={this.handleChange.bind(this)} autoComplete="off"/>  
            </div> 
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>
            
            
            {/* <div className="wrap-input100 validate-input">
            <input type="text" className="input100" name="phonenumber" required placeholder="Phone Number*" value={this.state.phonenumber} onChange={this.handleChange.bind(this)} autoComplete="off"/>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div> */}


            <div className="wrap-input100 validate-input" >
            <div className="labelBox100">
            <label style={{marginLeft:'10px'}}>Address</label>
            <input className="input100" name="address" type="text" value={this.state.address} onChange={this.handleChange.bind(this)} required placeholder="Address*" autoComplete="off"/>
            </div> 
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>
            
            <div className="wrap-input50 validate-input">
            <div className='labelBox'>
              <label style={{marginLeft:'10px'}}>City</label>
            <input className="input50" name="city" type="text" value={this.state.city} onChange={this.handleChange.bind(this)} required placeholder="City*"  autoComplete="off"/>
            </div>
            <div className="labelBox">
              <label style={{marginLeft:'10px'}}>State</label>
            <input className="input50" name="state" type="text" value={this.state.state} onChange={this.handleChange.bind(this)} required placeholder="State*"  autoComplete="off"/>  
            </div>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

            {/* <div className="wrap-input100 validate-input" >
            <input className="input100" name="state" type="text" value={this.state.state} onChange={this.handleChange.bind(this)} required placeholder="State*"  autoComplete="off"/>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div> */}
           
            <div className="wrap-input100 validate-input" >
            <div className="labelBox100">
              <label style={{marginLeft:'10px'}}>Category</label>
            <select  className="input100" name="categoryType" value={this.state.categoryType} onChange={this.handleChange.bind(this)}  aria-placeholder="Category">
                 <option defaultValue="">Category*</option>
                <option value="individual">Individual</option>
                <option value="vendor">Vendor</option>
            </select>
            </div>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true"></i>
              </span>
            </div>

          {this.state.categoryType=='vendor' &&
           <div className="wrap-input100 validate-input radioButtons" data-validate = "Password is required">
              <input type="radio" id='kirana'  name="category" value="kirana" onChange={this.handleChange.bind(this)}></input>
              <label htmlFor="kirana">Kirana</label><br></br>
              <input type="radio" id="chemist"  name="category" value="chemist" onChange={this.handleChange.bind(this)} ></input>
              <label htmlFor="chemist">Chemist</label><br></br>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>}


            <div className="wrap-input100 validate-input" data-validate = "Password is required">
              <div className="labelBox100">
                <label style={{marginLeft:'10px'}}>Password</label>
              <input className="input100" type="password" value={this.state.password} onChange={this.handleChange.bind(this)} name="password" placeholder="Password"/>
              </div>
              <span className="focus-input100"></span>
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true"></i>
              </span>
            </div>
            
            <div className="container-login100-form-btn">
             <button className="login100-form-btn" onClick={(e)=>this.submitUser(e)}>
                SignUp
              </button>
            </div>
  
            {/* <div className="text-center p-t-12">
              <span className="txt1">
                Forgot
              </span>
              <a className="txt2" href="#">
                Username / Password?
              </a>
            </div>
   */}
            {this.state.errorOccurred=='true' && <div style={{marginTop:'10px', color:'red'}} className="text-center p-t-136">
               {this.state.errorMessage}
            </div>}
            <div className="text-center p-t-136" onClick={(type)=>{this.switch('login')}}>
              <a className="txt2" href="#">
                Login
                <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
              </a>
            </div>
           
          </form>
        }
        </div>
      </div>
    </div>
    
    
	
	
    
    );
    }

}
export default Authentication;