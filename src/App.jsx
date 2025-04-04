import React, { useState, createContext } from 'react';
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

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handles user login by setting authentication state and navigating to the appropriate home page.
 * @param {Object} userData - The user data containing information about the authenticated user.
 * @param {string} userData.type - The type of user, either 'ngo' or 'provider'.
 */

/******  e47547ec-11e2-4369-ba5d-ea0fcd0bce37  *******/
  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
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
    navigate('/');
    alert('You have been logged out.');
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const isFormData = updatedData instanceof FormData;
      
      const response = await fetch(`http://localhost:8080/api/workers/${user.workerId}`, {
        method: 'PUT',
        body: isFormData ? updatedData : JSON.stringify(updatedData),
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          ...(isFormData ? {} : { 'Content-Type': 'application/json' })
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile');
      }

      const savedData = await response.json();
      setUser(prev => ({ ...prev, ...savedData }));
      return savedData;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
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
      
        <Route 
          path="/ngohome" 
          element={isAuthenticated && user?.type === 'ngo' ? 
            <NGOHome /> : 
            <Navigate to="/login/ngo" />} 
        />
        <Route 
          path="/add-worker" 
          element={isAuthenticated && user?.type === 'ngo' ? 
            <AddWorker /> : 
            <Navigate to="/login/ngo" />} 
        />
        <Route 
          path="/search-worker" 
          element={isAuthenticated && user?.type === 'ngo' ? 
            <WorkerSearch /> : 
            <Navigate to="/login/ngo" />} 
        />
        <Route 
          path="/job-request" 
          element={isAuthenticated && user?.type === 'ngo' ? 
            <JobRequest /> : 
            <Navigate to="/login/ngo" />} 
        />
        
        <Route 
          path="/jobproviderhome" 
          element={isAuthenticated && user?.type === 'provider' ? 
            <JobProviderHome user={user}/> : 
            <Navigate to="/login/provider" />} 
        />
        <Route 
          path="/jobproviderform" 
          element={isAuthenticated && user?.type === 'provider' ? 
            <JobProviderForm user={user} /> : 
            <Navigate to="/login/provider" />} 
        />
        
        <Route 
          path="/worker-home" 
          element={isAuthenticated && user?.type === 'worker' ? 
            <WorkerHome 
              workerData={user} 
              handleLogout={handleLogout}
              handleSaveProfile={handleSaveProfile}
            /> : 
            <Navigate to="/login/worker" />} 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;