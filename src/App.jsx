import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import CustomNavbar from './pages/CustomNavbar.jsx';
import NGOLogin from './components/NGO/NGOPages/LoginNGO.jsx';
import LoginProvider from './components/JobProvider/LoginProvider.jsx';
import NGOSignup from './components/NGO/NGOPages/SignupNGO.jsx';
import ProviderSignup from './components/JobProvider/SignupProvider.jsx';
import Home from './pages/Home';
import Contact from './pages/Contact';
import NGOHome from './components/NGO/NGOPages/NGOHome.jsx';
import JobProviderHome from './components/JobProvider/JobProviderHome.jsx';
import JobProviderForm from './components/JobProvider/JobProviderForm';
import About from './pages/About.jsx';
import AddWorker from './components/NGO/NGOPages/AddWorker.jsx';
import WorkerSearch from './components/NGO/NGOPages/WorkerSearch.jsx';
import JobRequest from './components/NGO/NGOPages/JobRequest.jsx';

export const UserContext = createContext(null);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profileSliderOpen, setProfileSliderOpen] = useState(false);

  return (
    <UserContext.Provider value={{ user, isAuthenticated }}>
      <Router>
        <AppRoutes
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          user={user}
          setUser={setUser}
          profileSliderOpen={profileSliderOpen}
          setProfileSliderOpen={setProfileSliderOpen}
        />
      </Router>
    </UserContext.Provider>
  );
};

const AppRoutes = ({ isAuthenticated, setIsAuthenticated, user, setUser, profileSliderOpen, setProfileSliderOpen }) => {
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    if (userData.type === 'ngo') {
      navigate('/ngohome');
    } else if (userData.type === 'provider') {
      navigate('/jobproviderhome');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setProfileSliderOpen(false);
    navigate('/');
    alert('You have been logged out.');
  };

  // Determine dynamic home route
  const homeRoute = isAuthenticated
    ? user?.type === 'ngo'
      ? '/ngohome'
      : '/jobproviderhome'
    : '/';

  return (
    <>
      <CustomNavbar
  isAuthenticated={isAuthenticated}
  user={user}
  homeRoute={homeRoute}
  profileSliderOpen={profileSliderOpen}
  setProfileSliderOpen={setProfileSliderOpen}
  handleLogout={handleLogout}
/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login/ngo" element={<NGOLogin onLogin={handleLogin} />} />
        <Route path="/login/provider" element={<LoginProvider onLogin={handleLogin} />} />
        <Route path="/signup/ngo" element={<NGOSignup onSignup={handleLogin} />} />
        <Route path="/signup/provider" element={<ProviderSignup onSignup={handleLogin} />} />
        <Route path="/ngohome" element={isAuthenticated && user?.type === 'ngo' ? <NGOHome /> : <h2>Unauthorized Access</h2>} />
        <Route path="/add-worker" element={isAuthenticated && user?.type === 'ngo' ? <AddWorker /> : <h2>Unauthorized Access</h2>} />
        <Route path="/search-worker" element={isAuthenticated && user?.type === 'ngo' ? <WorkerSearch /> : <h2>Unauthorized Access</h2>} />
        <Route path="/job-request" element={isAuthenticated && user?.type === 'ngo' ? <JobRequest /> : <h2>Unauthorized Access</h2>} />
        <Route path="/jobproviderhome" element={isAuthenticated && user?.type === 'provider' ? <JobProviderHome user={user}/> : <h2>Unauthorized Access</h2>} />
        <Route path="/jobproviderform" element={isAuthenticated && user?.type === 'provider' ? <JobProviderForm user={user} /> : <h2>Unauthorized Access</h2>} />
      </Routes>
    </>
  );
};

export default App;
