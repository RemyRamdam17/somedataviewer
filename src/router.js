import React, { useState, useEffect } from 'react' ;
import Login from './screens/login.js' ;
import Live from './screens/live.js' ;
import BeatMaster from './screens/beatmaster.js' ;
import TrackingMaster from './screens/trackingmaster.js' ;

import { Route, Switch, Redirect } from 'react-router-dom' ;
import { PrivateRoute } from './privateRoute' ;

import { useAuth } from './authentificationProvider.js' ;

export const Routes = () => {

  const { currentUser } = useAuth() ;
  const [ loggedIn, setLoggedIn ] = useState(false) ;

  useEffect( () => {
    if (currentUser !== undefined)
      setLoggedIn(false) ;
    if (currentUser !== null)
      setLoggedIn(true) ;
    else
      setLoggedIn(false) ;

  }, [])

  return (
    <div>
      <Switch>
        <PrivateRoute exact path = "/live" loggedIn = {loggedIn} component = { Live } />
        <PrivateRoute exact path = "/beatmaster" loggedIn = {loggedIn} component = { BeatMaster } />
        <PrivateRoute exact path = "/trackingmaster" loggedIn = {loggedIn} component = { TrackingMaster } />
        <Route exact path = "/login" component = { Login } />
        <Redirect  from = "/"  to = "/live"  exact  />
      </Switch>
    </div>
  ) ;
} ;