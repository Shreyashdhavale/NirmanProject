// Home.jsx
import React from 'react';
import './Home.css';
import ServicesSection from './ServicesSection';
import SuccessStories from './SuccessStories';
import Footer from './Footer';
import Contact from './Contact';
import EventSection from './Events';

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-grid">
            <div className="hero-image">
              <img
                src="/Images/labour-modified.jpg"
                alt="Daily Wage Worker"
                className="hero-img"
              />
            </div>
            <div className="hero-text">
              <h2 className="hero-title">Empowering Daily Wage Workers</h2>
              <p className="hero-description">
                Connecting skilled daily wage workers with opportunities across India.
                We aim to bridge the gap between workers and job providers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services">
        <h3 className="services-title">Our Services</h3>
        <div className="service-grid">
          {[1, 3, 4, 12, 5, 6, 7, 8].map((num) => (
            <div key={num} className="service-card">
              <div className="card">
                <img 
                  src={`/Images/img${num}.jpg`} 
                  className="card-image" 
                  alt={`Service ${num}`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <EventSection/>
      <SuccessStories />
      <ServicesSection />
      <Contact />
      <Footer />
    </div>
  );
}