import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'

import { Container } from 'semantic-ui-react'
import { MenuBar } from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
function App() {
  return (
    <div>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </Container>
      </Router>
    </div>
  );
}

export default App;
