import React, { Component } from 'react';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import MainPage from '../../pages/MainPage/MainPage';
import VendorsPage from '../../pages/VendorsPage/VendorsPage';
import StorePage from '../../pages/StorePage/StorePage';
import ProductPage from '../../pages/ProductPage/ProductPage';

import AdminPage from '../../pages/AdminPage/AdminPage';
import CreateStore from '../../components/Admin/CreateStore';
import EditStore from '../../components/Admin/EditStore';
import SignupPage from './SignupPage/SignupPage';
import LoginPage from './LoginPage/LoginPage';
import userService from '../../utils/userService';
import Map from '../../components/Map/Map';
// import tokenService from '../../utils/tokenService';

class App extends Component {

  state = {
    user: null,
    lat: null,
    lng: null,
    temp: null,
    icon: ''
  };

  getCurrentLatLng() {
    console.log("function is executing")
    return new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(pos => {
        console.log("current position is", pos)
        resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      })});
    });
  }

  async componentDidMount() {
    console.log('mounting component didrun')
    let {lat, lng} = await this.getCurrentLatLng()
    console.log('the lat and lng are', lat, lng)

    let endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=imperial&appid=501a06495d77adca55164be4b5807bf4`;
    let fetchResult = await fetch(endpoint);
    let weatherData = await fetchResult.json();
    this.setState({
      lat,
      lng,
      // Add temp & icon to state
      temp: Math.round(weatherData.main.temp),
      icon: weatherData.weather[0].icon
    });
    console.log(Math.round(weatherData.main.temp));
  }

  handleLogout = () => {
    userService.logout();
    this.setState({ user: null });
  }

  handleSignup = () => {
    this.setState({user: userService.getUser()});
  }

  handleSignupOrLogin = () => {
    this.setState({user: userService.getUser()});
  }
  
  render() {
    return (
      <div className="App">
        <Map lat={this.state.lat} lng={this.state.lng}/>
        
        <Switch>
          <Route exact path='/' render={() => 
            <div>
              <MainPage handleLogout={this.handleLogout} user={this.state.user}/>
              <header className='App-header'>
                <div>{this.state.temp}&deg;</div>
                {this.state.icon && 
                <img
                    src={`https://openweathermap.org/img/w/${this.state.icon}.png`}
                    alt='Current Conditions'
                />
                }
              </header>
            </div>
        }/> 

          <Route exact path='/vendors' render={() => 
          <VendorsPage />
          } />
           <Route exact path='/store' render={() => 
          <StorePage />
          } />
           <Route exact path='/product' render={() => 
          <ProductPage />
          } />
          <Route exact path='/admin' render={() => 
          <AdminPage />
          } />
            <Route exact path='/admin/createstore' render={() => 
          <CreateStore />
          } />
           <Route exact path='/editstore' render={() => 
          <EditStore />
          } />
          <Route exact path ='/signup' render={({history}) =>
          <SignupPage history={history}
          handleSignupOrLogin={this.handleSignupOrLogin}
          />
          }/>
          <Route exact path='/login' render={({ history }) => 
            <LoginPage
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          }/>
          :
          <Redirect to='/login'/>
        
        </Switch>
      </div>
    );
  }

}


export default App;
