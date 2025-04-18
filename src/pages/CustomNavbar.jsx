import React, { useEffect, useRef, useState } from 'react';
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Avatar } from "@mui/material";
import './CustomNavbar.css';

const CustomNavbar = ({ isAuthenticated, user, homeRoute, profileSliderOpen, setProfileSliderOpen, handleLogout }) => {
  const sliderRef = useRef(null);
  const profileButtonRef = useRef(null);
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Home"); // Default title

  // Function to get the correct user name
  const getUserName = () => {
    if (!user) return "User";
    return user.workerName || user.ngoName || user.providerName || user.name || "User";
  };

  // Get the first character for the avatar
  const getAvatarInitial = () => {
    return getUserName().charAt(0).toUpperCase();
  };

  // Function to update the page title based on the path
  useEffect(() => {
    const pathTitleMap = {
      "/": "Home",
      "/ngohome": "NGO Dashboard",
      "/worker-home": "My Profile",
      "/jobproviderhome": "Job Provider Dashboard",
      "/add-worker": "Add Worker",
      "/search-worker": "Search Worker",
      "/job-request": "Job Requests",
      "/jobproviderform": "Post Job",
      "/contact": "Contact",
      "/about": "About Us",
    };
    
    setPageTitle(pathTitleMap[location.pathname] || "Home");
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        sliderRef.current &&
        !sliderRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setProfileSliderOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setProfileSliderOpen]);

  return (
    <>
      <Navbar bg="light" expand="lg" className="custom-navbar shadow-sm">
        <Container fluid className="px-3">
          <Navbar.Brand as={Link} to={homeRoute} className="logo py-2">
            <img src="/Images/NirmanLogo.png" alt="Logo" height="60" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">
            <Nav className="mx-auto text-center">
              <Nav.Link as={Link} to={homeRoute}>{pageTitle}</Nav.Link>
              {!isAuthenticated && (
                <>
                  <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                  <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                </>
              )}
            </Nav>

            <Nav className="d-flex align-items-center">
              {!isAuthenticated ? (
                <div className="d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="light">Login</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/login/ngo">NGO</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/login/provider">Job Provider</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/login/worker">Worker</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown>
                    <Dropdown.Toggle variant="light">Signup</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/signup/ngo">NGO</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/signup/provider">JobProvider</Dropdown.Item>
                   
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div className="profile-container d-flex align-items-center gap-2">
                  <span className="fw-bold d-none d-lg-inline">{getUserName()}</span>
                  <Avatar
                    ref={profileButtonRef}
                    src={user?.profileImage || undefined}
                    sx={{ width: 45, height: 45, bgcolor: "#007bff", cursor: "pointer" }}
                    onClick={() => setProfileSliderOpen(!profileSliderOpen)}
                  >
                    {getAvatarInitial()}
                  </Avatar>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isAuthenticated && (
        <div ref={sliderRef} className={`profile-slider ${profileSliderOpen ? 'open' : ''}`}>
          <div className="p-4">
            <div className="text-center mb-4">
              <Avatar
                src={user?.profileImage || undefined}
                sx={{ width: 80, height: 80, bgcolor: "#007bff", fontSize: "1.5rem", margin: "0 auto 16px auto" }}
              >
                {getAvatarInitial()}
              </Avatar>
              <h4 className="mb-1">{getUserName()}</h4>
              <p className="text-muted">{user?.type?.toUpperCase()}</p>
            </div>

            <div className="d-flex flex-column gap-2">
              {user?.type === "worker" && <Link to="/worker-home" className="btn btn-outline-primary w-100">My Profile</Link>}
              {user?.type === "ngo" && (
                <>
                  <Link to="/ngohome" className="btn btn-outline-primary w-100">Dashboard</Link>
                  <Link to="/add-worker" className="btn btn-outline-primary w-100">Add Worker</Link>
                  <Link to="/search-worker" className="btn btn-outline-primary w-100">Search Worker</Link>
                  <Link to="/job-request" className="btn btn-outline-primary w-100">Job Requests</Link>
                </>
              )}
             {user?.type === "provider" && (
  <>
    <Link to="/jobproviderhome" className="btn btn-outline-primary w-100">Dashboard</Link>
    <Link to="/jobproviderform" className="btn btn-outline-primary w-100">Post Job</Link>
    <Link to="/delete-jobs" className="btn btn-outline-danger w-100">Delete Job Posts</Link>
  </>
)}

              <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomNavbar;
