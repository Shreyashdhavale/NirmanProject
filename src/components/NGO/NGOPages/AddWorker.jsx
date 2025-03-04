// src/pages/AddWorker.jsx
import React from 'react';
import NGOHomeNavbar from './NGOHomeNavbar';
import WorkerRegistrationForm from './form/WorkerRegistrationForm';

const AddWorker = ({ setIsAuthenticated }) => {
  return (
    <>
      {/* <NGOHomeNavbar setIsAuthenticated={setIsAuthenticated} /> */}
      <WorkerRegistrationForm />
    </>
  );
};

export default AddWorker;
