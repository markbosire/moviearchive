import React from 'react';
import { Router, Route, Link } from 'wouter';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserCollection from './pages/UserCollection';
import Home from './Home';
import ReviewPage from './pages/ReviewPage';

const App = () => {
  return (
    <Router>
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/collections" component={UserCollection} />
      <Route path='/reviews' component={ReviewPage} />
      <Route path="/" component={Home} />

      {/* Define other routes (e.g., /home) */}
    </Router>
  );
};

export default App;
