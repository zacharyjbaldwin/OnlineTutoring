import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import './App.css';
import ToolBar from './components/Navigation/Toolbar';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Login from './pages/Login';
import TutorSignup from './pages/TutorSignup';
import SignUp from './pages/Signup';
import Profile from './pages/Profile';
import TutorList from './pages/TutorList';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import Footer from './components/Footer';

function App() {

  const { token, login, logout, userId, email, firstName, lastName, isAdmin, isTutor } = useAuth();

  let routes;
  if (userId) {
    // show these routes if the user is logged in
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/tutors">
          <TutorList />
        </Route>
        <Route path="/tutorsignup">
          <TutorSignup />
        </Route>
        <Redirect to="/profile" />
      </Switch>
    );
  } else {
    // show these routes if the user is not logged in
    routes = (
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token,
      userId,
      email,
      firstName,
      lastName,
      isAdmin,
      isTutor,
      login: login,
      logout: logout
    }}>
      <Router>
        <ToolBar />
        <main className='mt-3'>
          <div className='container'>
            <div className='row'>
              <div className='col-md-12'>
                {routes}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
