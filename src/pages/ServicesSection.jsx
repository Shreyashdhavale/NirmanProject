import React from 'react';
import { Link } from 'react-router-dom';
import './ServicesSection.css'; // Ensure CSS is included

const ServicesSection = () => {
  return (
    <div className="services-section">
      <h3 className="text-center mb-4">Explore More</h3>
      <div className="services-container">
        <Link to="/team" className="service-item">
          <img src="/Images/circleteam.jpeg" alt="Team" />
          <span>Team</span>
        </Link>
        <Link to="/contact" className="service-item">
          <img src="/Images/circleimage.jpg" alt="Contact" />
          <span>Contact</span>
        </Link>
        <Link to="/about" className="service-item">
          <img src="/Images/circleabout.jpeg" alt="Forum" />
          <span>About</span>
        </Link>
      </div>
    </div>
  );
};

export default ServicesSection;
