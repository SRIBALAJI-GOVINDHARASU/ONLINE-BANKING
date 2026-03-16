import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await login(email, password);
      if (response.data?.user?.role === 'admin') {
        navigate('/admin');
      } else if (response.data?.user?.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>🏦 Online Banking</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            UPI Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="btn" type="submit">
            Login
          </button>
        </form>
        <p>
          New? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
