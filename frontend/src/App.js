import React from 'react';
import './App.css';
import { Header } from './components/Header';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

function App () {
  return (
    <Router>
      <div className={'main'}>
        <Header/>
        <div className={'content'}>
          <Switch>
            <Route exact path="/">
              /
            </Route>
            <Route exact path="/about">
              About
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
