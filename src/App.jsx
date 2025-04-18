import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import WorkerLogin from './components/Worker/WorkerLogin.jsx';
import WorkerHome from './components/Worker/Workerhome.jsx';
import DeleteJobsPage from './components/JobProvider/DeleteJobsPage.jsx';

export const UserContext = createContext(null);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profileSliderOpen, setProfileSliderOpen] = useState(false);

  // Load user from localStorage on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

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
    console.log("User logged in:", userData); // Debugging Log
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Persist user in localStorage

    if (userData.type === 'ngo') {
      navigate('/ngohome');
    } else if (userData.type === 'provider') {
      navigate('/jobproviderhome');
    } else if (userData.type === 'worker') {
      navigate('/worker-home');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setProfileSliderOpen(false);
    localStorage.removeItem("user"); // Remove user from localStorage
    navigate('/');
   
  };

  const homeRoute = isAuthenticated
    ? user?.type === 'ngo'
      ? '/ngohome'
      : user?.type === 'provider'
        ? '/jobproviderhome'
        : '/worker-home'
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
        <Route path="/login/worker" element={<WorkerLogin onLogin={handleLogin} />} />
        <Route path="/signup/ngo" element={<NGOSignup onSignup={handleLogin} />} />
        <Route path="/signup/provider" element={<ProviderSignup onSignup={handleLogin} />} />

        <Route path="/ngohome" element={isAuthenticated && user?.type === 'ngo' ? <NGOHome /> : <Navigate to="/login/ngo" />} />
        <Route path="/add-worker" element={isAuthenticated && user?.type === 'ngo' ? <AddWorker /> : <Navigate to="/login/ngo" />} />
        <Route path="/search-worker" element={isAuthenticated && user?.type === 'ngo' ? <WorkerSearch /> : <Navigate to="/login/ngo" />} />
        <Route path="/job-request" element={isAuthenticated && user?.type === 'ngo' ? <JobRequest /> : <Navigate to="/login/ngo" />} />

        <Route path="/jobproviderhome" element={isAuthenticated && user?.type === 'provider' ? <JobProviderHome user={user} /> : <Navigate to="/login/provider" />} />
        <Route path="/jobproviderform" element={isAuthenticated && user?.type === 'provider' ? <JobProviderForm user={user} /> : <Navigate to="/login/provider" />} />
        <Route path="/delete-jobs"  element={isAuthenticated && user?.type === 'provider' ? (<DeleteJobsPage user={user} />) : ( <Navigate to="/login/provider" /> ) }/>
        
        <Route path="/worker-home" element={isAuthenticated && user?.type === 'worker' ? <WorkerHome workerData={user} handleLogout={handleLogout} /> : <Navigate to="/login/worker" />} />
       

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
