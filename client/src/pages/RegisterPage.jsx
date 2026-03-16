import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    aadhaarNumber: '',
    panNumber: '',
    address: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [pin, setPin] = useState(null);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setPin(null);

    try {
      const response = await register(fields);
      const pinFromServer = response.data?.pin || null;
      setPin(pinFromServer);

      // Admin users don't have an ATM PIN, so we navigate immediately.
      if (!pinFromServer) {
        if (response.data?.customer?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/customer');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Full Name
            <input name="name" value={fields.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={fields.email} onChange={handleChange} required />
          </label>
          <label>
            Phone
            <input name="phone" value={fields.phone} onChange={handleChange} required />
          </label>
          <label>
            Aadhaar Number
            <input name="aadhaarNumber" value={fields.aadhaarNumber} onChange={handleChange} required />
          </label>
          <label>
            PAN Number
            <input name="panNumber" value={fields.panNumber} onChange={handleChange} required />
          </label>
          <label>
            Address
            <input name="address" value={fields.address} onChange={handleChange} required />
          </label>
          <label>
            UPI Password
            <input
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">
            Register
          </button>
        </form>

        {pin && (
          <div className="notification">
            <strong>Your Account PIN:</strong> {pin} (store it securely)
            <div style={{ marginTop: '0.75rem' }}>
              <button
                className="btn"
                type="button"
                onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/customer')}
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        )}
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
