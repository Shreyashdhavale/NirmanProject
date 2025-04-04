import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const WorkerLogin = ({ onLogin }) => {
    const [workerId, setWorkerId] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchWorkerData = async () => {
        if (!workerId.trim()) {
            alert("Please enter Worker ID!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/workers/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ workerId })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to login');
            }

            const data = await response.json();

            if (data && data.workerId) {
                onLogin({ ...data, type: "worker" }); // Call onLogin to update state in App.js
                navigate('/worker-home'); // Redirect to worker home after login
            } else {
                throw new Error('Worker not found or invalid response');
            }
        } catch (error) {
            console.error("Error fetching worker data:", error);
            alert(`Error: ${error.message || 'Failed to fetch data'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-header bg-primary text-white text-center py-4">
                            <h2 className="m-0 font-weight-bold">Worker Login</h2>
                        </div>
                        <div className="card-body p-4">
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="workerId"
                                    placeholder="Enter Worker ID"
                                    value={workerId}
                                    onChange={(e) => setWorkerId(e.target.value)}
                                />
                                <label htmlFor="workerId">Worker ID</label>
                            </div>
                            <div className="d-grid">
                                <button 
                                    className="btn btn-primary btn-lg" 
                                    onClick={fetchWorkerData}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </>
                                    ) : "Login"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerLogin;
