import React, { useEffect, useRef } from 'react';
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Avatar } from "@mui/material";
import './CustomNavbar.css';

const CustomNavbar = ({ isAuthenticated, user, homeRoute, profileSliderOpen, setProfileSliderOpen, handleLogout }) => {
  const sliderRef = useRef(null);
  const profileButtonRef = useRef(null);

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
            <img
              src="/Images/NirmanLogo.png"
              alt="Logo"
              height="60"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" className="border-0 shadow-none" />

          <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-center">
            <Nav className="mx-auto text-center">
              <Nav.Link as={Link} to={homeRoute} className="px-4">
                Home
              </Nav.Link>

              {(!isAuthenticated || (user?.type !== "ngo" && user?.type !== "provider" && user?.type !== "worker")) && (
                <>
                  <Nav.Link as={Link} to="/contact" className="px-4">
                    Contact
                  </Nav.Link>
                  <Nav.Link as={Link} to="/about" className="px-4">
                    About Us
                  </Nav.Link>
                </>
              )}

              {isAuthenticated && user?.type === "ngo" && (
                <>
                  <Nav.Link as={Link} to="/add-worker" className="px-4">
                    Add Worker
                  </Nav.Link>
                  <Nav.Link as={Link} to="/search-worker" className="px-4">
                    Search Worker
                  </Nav.Link>
                  <Nav.Link as={Link} to="/job-request" className="px-4">
                    Job Request
                  </Nav.Link>
                </>
              )}

              {isAuthenticated && user?.type === "provider" && (
                <Nav.Link as={Link} to="/jobproviderform" className="px-4">
                  Job Request Form
                </Nav.Link>
              )}

              {/* Worker specific navbar items removed as requested */}
            </Nav>
           
            <Nav className="d-flex align-items-center justify-content-center">
              {!isAuthenticated ? (
                <div className="d-flex gap-2 flex-column flex-lg-row align-items-center">
                  <Dropdown className="w-100 w-lg-auto">
                    <Dropdown.Toggle variant="light" className="nav-dropdown w-100">
                      Login
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item as={Link} to="/login/ngo">As NGO</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/login/provider">As Job Provider</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/login/worker">As Worker</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown className="w-100 w-lg-auto">
                    <Dropdown.Toggle variant="light" className="nav-dropdown w-100">
                      Signup
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item as={Link} to="/signup/ngo">As NGO</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/signup/provider">As Job Provider</Dropdown.Item>
                      <Dropdown.Item as={Link} to="/signup/worker">As Worker</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div className="profile-container d-flex align-items-center gap-2">
                  <span className="fw-bold d-none d-lg-inline">
                    {user?.name}
                  </span>
                  <div className="d-flex align-items-center">
                    <button 
                      className="btn btn-danger me-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                    <Avatar
                      ref={profileButtonRef}
                      src={user?.profileImage || undefined}
                      sx={{
                        width: 45,
                        height: 45,
                        bgcolor: "#007bff",
                        cursor: "pointer",
                        fontSize: "1rem"
                      }}
                      onClick={() => setProfileSliderOpen(!profileSliderOpen)}
                    >
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                  </div>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div ref={sliderRef} className={`profile-slider ${profileSliderOpen ? 'open' : ''}`}>
        <div className="p-4">
          <h4 className="mb-4">{user?.name}'s Profile</h4>
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default CustomNavbar;