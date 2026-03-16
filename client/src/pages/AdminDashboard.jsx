import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';
import { useTheme } from '../services/themeService.jsx';
import api from '../services/api';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [logs, setLogs] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState('');
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [usersRes, txRes, logsRes, collectionsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/transactions'),
        api.get('/admin/logs'),
        api.get('/admin/db/collections'),
      ]);
      setCustomers(usersRes.data.users);
      setTransactions(txRes.data.transactions);
      setLogs(logsRes.data.logs);
      setCollections(collectionsRes.data.collections);
      if (collectionsRes.data.collections.length) {
        setActiveCollection(collectionsRes.data.collections[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  const fetchDocs = async (collection) => {
    try {
      const res = await api.get('/admin/db/docs', {
        params: { collection, limit: 50 },
      });
      setDocuments(res.data.documents);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const toggleUser = async (id, disabled) => {
    try {
      await api.post('/admin/user-status', { userId: id, disabled });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeCollection) {
      fetchDocs(activeCollection);
    }
  }, [activeCollection]);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h2>Admin Dashboard</h2>
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
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.role}</td>
                  <td>{c.isDisabled ? 'Disabled' : 'Active'}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => toggleUser(c._id, !c.isDisabled)}
                    >
                      {c.isDisabled ? 'Enable' : 'Disable'}
                    </button>
                  </td>
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

      <section className="card">
        <h3>Audit Logs</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Action</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 20).map((item) => (
                <tr key={item._id}>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                  <td>{item.user || 'System'}</td>
                  <td>{item.action}</td>
                  <td>{item.ip || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Database Viewer</h3>
        <div className="form">
          <label>
            Select collection
            <select
              value={activeCollection}
              onChange={(e) => setActiveCollection(e.target.value)}
            >
              {collections.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <pre className="pre">{JSON.stringify(doc, null, 2)}</pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
