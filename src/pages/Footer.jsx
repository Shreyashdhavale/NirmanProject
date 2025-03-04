import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';
import 'font-awesome/css/font-awesome.min.css'; // Import FontAwesome CSS

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          {/* Footer Column 1: About */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold">About Us</h5>
            <p>
              Empowering daily wage workers and connecting them with opportunities across India. We aim to bridge the gap between workers and employers.
            </p>
          </div>

          {/* Footer Column 2: Links */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/services" className="text-white">Services</a></li>
              <li><a href="/about" className="text-white">About Us</a></li>
              <li><a href="/contact" className="text-white">Contact</a></li>
            </ul>
          </div>

          {/* Footer Column 3: Social Media */}
          <div className="col-md-4">
            <h5 className="fw-bold">Follow Us</h5>
            <ul className="list-unstyled d-flex">
              <li className="me-3">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white">
                  <i className="fab fa-facebook fa-lg"></i>
                </a>
              </li>
              <li className="me-3">
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white">
                  <i className="fab fa-twitter fa-lg"></i>
                </a>
              </li>
              <li className="me-3">
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white">
                  <i className="fab fa-linkedin fa-lg"></i>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                  <i className="fab fa-instagram fa-lg"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom: Copyright */}
        <div className="text-center mt-4">
          <p className="mb-0">&copy; 2025 Empowering Daily Wage Workers. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
