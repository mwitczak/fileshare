import React from 'react';
import './App.css';
import { Header } from './components/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { Upload } from './components/Upload';
import { PublicFileTable } from './components/PublicFileTable';

function App () {
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
              <Route exact path="/user/files">
                <Upload />
              </Route>
              <Route exact path="/about">
                About
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
