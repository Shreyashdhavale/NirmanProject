import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WorkerLogin = ({ onLogin }) => {
  const [workerId, setWorkerId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWorkerData = async () => {
    if (!workerId.trim()) {
      toast.error("Please enter Worker ID!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/workers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data && data.workerId) {
        onLogin({
          ...data,
          type: "worker",
          workerId,
          workerName: data.name || "Worker"
        });

        toast.success("Logged in successfully! 👷‍♂️", {
          style: {
            background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            border: "none",
            color: "#fff",
          }
        });

        setTimeout(() => {
          navigate('/worker-home', { state: { workerId } });
        }, 2000);
      } else {
        throw new Error("Worker not found or invalid response");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer position="top-right" autoClose={3000} />

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
                      Logging in...
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
