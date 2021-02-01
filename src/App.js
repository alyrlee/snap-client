import React from 'react';
import './App.css';
import Header from './Components/Headers/Header';
import LandingPage from './Components/LandingPage /LandingPage';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import LoginForm from '../src/Components/LoginForm/LoginForm';
import PrivateRoute from '../src/Utils/PrivateRoute';
import PublicOnlyRoute from '../src/Utils/PublicOnlyRoute';
import About from '../src/Components/About/About';
import Profile from './Components/LoginForm/Profile';
import MapLanding from './Components/GoogleMap/MapLanding';
import { Route, Router } from "react-router-dom";
import history from './Contexts/history';

function App() {
    return (
      <div className='App'>
    <Router history={history}>
        <header className="ui container">
          <Header />
        </header>
            <Route path={'/'} exact component={LandingPage}/>
            <Route path={'/about'} exact component={About} />
            <Route path={'/find'} exact component={MapLanding}/>
            <PublicOnlyRoute path={'/login'} component={LoginForm}/>
            <PublicOnlyRoute path={'/register'} component={RegistrationForm}/>
            <PrivateRoute path={'/profile'} exact component={Profile}/>
       </Router> 
      </div>
    );
  }

export default App;