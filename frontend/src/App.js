import React, { Component } from 'react';
// import logo from './logo.svg';
import './index.css';
import SignIn from './components/Login/SignIn'
import MainApp from './components/MainApp';
import Loader from './components/Loader';

class App extends Component {

  constructor(props) {
    super(props)
    this.signInHandler = this.signInHandler.bind(this)
  }

  state = {
    loading: false,
    loggedIn: true,
    showLogIn: true,
  }

  signInHandler = () => {
    this.setState({ loading: true })
    setTimeout(() => this.setState({ loading: false, loggedIn: true }), 2000)
  }
  
  render() {
    const { loading, loggedIn, showLogIn } = this.state
    return (
      <div>
        { loading && <Loader />}
        { !loading && !loggedIn && showLogIn && <SignIn signInHandler={this.signInHandler} />}
        { loggedIn && <MainApp />}
      </div>
    )
  }
}

//     	<div>
//     	        <h1 class="login-title">Interview 101</h1>

//     	        <form>
//   	<div class="form-group">
//     <label for="exampleInputEmail1">Email address</label>
//     <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
//     <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
//   </div>
//   <div class="form-group">
//     <label for="exampleInputPassword1">Password</label>
//     <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"/>
//   </div>
//   <div class="form-group form-check">
//     <input type="checkbox" class="form-check-input" id="exampleCheck1"/>
//     <label class="form-check-label" for="exampleCheck1">Check me out</label>
//   </div>
//   <button type="submit" class="btn btn-primary">Submit</button>
// </form>

//     	</div>
//     );


//     	<div>
       
        
        
//         <form>
//   	<div class="form-group">
//     <label for="exampleInputEmail1">Email address</label>
//     <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
//     <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
//   </div>
//   <div class="form-group">
//     <label for="exampleInputPassword1">Password</label>
//     <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
//   </div>
//   <div class="form-group form-check">
//     <input type="checkbox" class="form-check-input" id="exampleCheck1">
//     <label class="form-check-label" for="exampleCheck1">Check me out</label>
//   </div>
//   <button type="submit" class="btn btn-primary">Submit</button>
// </form>
// 	</div>
      
             
//     );
//   }
// }

export default App;
