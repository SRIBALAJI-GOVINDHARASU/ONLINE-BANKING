import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';
import { useTheme } from '../services/themeService.jsx';
import api from '../services/api';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [usersRes, txRes] = await Promise.all([api.get('/admin/users'), api.get('/admin/transactions')]);
      setCustomers(usersRes.data.users);
      setTransactions(txRes.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h2>Staff Dashboard</h2>
          <p>{user.email}</p>
        </div>
        <div className="header-actions">
          <button className="btn" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'} Theme
          </button>
          <button className="btn" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </header>

      {error && <div className="notification">{error}</div>}

      <section className="card">
        <h3>Customers</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.role}</td>
                  <td>{c.isDisabled ? 'Disabled' : 'Active'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Recent Transactions</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 20).map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                  <td>{tx.type}</td>
                  <td>₹{tx.amount}</td>
                  <td>{tx.customer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
