import React from "react";
import { Users, Briefcase, ShieldCheck, Building2 } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import { Link } from "react-router-dom";

// Reusable Card Component
const Card = ({ children, className }) => {
  return <div className={`card border border-primary shadow-sm ${className}`}>{children}</div>;
};

const CardContent = ({ children, className }) => {
  return <div className={`card-body ${className}`}>{children}</div>;
};

// About Page Component
const AboutPage = () => {
  const features = [
    {
      icon: <Briefcase className="text-primary" size={48} />,
      title: "Daily Job Opportunities",
      description: "Find immediate work opportunities in construction, maintenance, housekeeping, and more. New jobs posted daily to match your skills.",
    },
    {
      icon: <ShieldCheck className="text-primary" size={48} />,
      title: "Verified Employers",
      description: "All employers on our platform are verified to ensure safe and reliable work opportunities for our workers.",
    },
    {
      icon: <Users className="text-primary" size={48} />,
      title: "Worker Community",
      description: "Join a supportive community of daily wage workers. Share experiences, get support, and help each other grow.",
    },
    {
      icon: <Building2 className="text-primary" size={48} />,
      title: "Local Opportunities",
      description: "Find jobs in your local area to minimize travel time and maximize your earning potential.",
    },
  ];

  return (
    <div className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Connecting Workers with Daily Opportunities</h1>
        <p className="lead text-muted">
          We bridge the gap between skilled workers and employers, creating reliable income opportunities for thousands of daily wage workers across the country.
        </p>
      </div>

      {/* Mission Statement */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="h4 fw-bold">Our Mission</h2>
          <p className="text-muted">
            Our platform is dedicated to empowering daily wage workers by providing easy access to fair employment opportunities. We believe in creating a transparent and efficient marketplace that benefits both workers and employers while promoting dignity and financial security for all workers.
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="row">
        {features.map((feature, index) => (
          <div key={index} className="col-md-6 mb-4">
            <Card className="h-100 text-center">
              <CardContent className="p-4">
                <div className="mb-3">{feature.icon}</div>
                <h3 className="h5 fw-bold">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5">
        <h2 className="h4 fw-bold">Join Our Growing Community</h2>
        <p className="text-muted mb-4">
          Whether you're looking for work or hiring workers, our platform makes it easy to connect and create opportunities.
        </p>
        <div className="d-flex justify-content-center gap-3">
         <Link to="/Myjobposting" className="btn btn-primary">Post Job</Link>
       </div>
      </div>
    </div>
  );
};

export default AboutPage;
