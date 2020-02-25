import React, { useContext } from 'react';
import './App.css';
import { Header } from './components/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect,
} from 'react-router-dom';
import { UserContext, UserProvider } from './contexts/UserContext';
import { UserFiles } from './components/UserFiles';
import { PublicFileTable } from './components/PublicFileTable';
import { UserProfile } from './components/UserProfile';

function App () {
  const LoggedInRoute = (props) => {
    const {user} = useContext(UserContext);
    if (!user) {
      return <Redirect to={'/'}/>;
    }
    return <Route {...props} />;
  };
  return (
    <UserProvider>
      <Router>
        <div className={'main'}>
          <Header/>
          <div className={'content'}>
            <Switch>
              <Route exact path="/">
                <PublicFileTable />
              </Route>
              <LoggedInRoute exact path="/user/files">
                <UserFiles />
              </LoggedInRoute>
              <LoggedInRoute exact path="/user">
                <UserProfile />
              </LoggedInRoute>
              <Route exact path="/about">
                Instashare is...
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
