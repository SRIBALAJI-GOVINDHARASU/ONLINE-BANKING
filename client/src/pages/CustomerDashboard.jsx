import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';
import { useTheme } from '../services/themeService.jsx';
import api from '../services/api';
import { getAccount, getBalance, verifyPin, updateProfile } from '../services/accountApi';
import { getTransactions, deposit, withdraw, transfer } from '../services/transactionApi';
import { payBill } from '../services/billApi';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState(null);
  const [atmPin, setAtmPin] = useState('');
  const [atmInfo, setAtmInfo] = useState(null);
  const [withdrawPin, setWithdrawPin] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
  const [form, setForm] = useState({ amount: '', toAccount: '', billType: 'electricity' });

  const getData = async () => {
    try {
      const [acctRes, notifRes, balRes, trxRes] = await Promise.all([
        getAccount(),
        api.get('/notifications'),
        getBalance(),
        getTransactions(),
      ]);

      setAccount(acctRes.data);
      setProfile({
        name: acctRes.data.name || user?.name,
        phone: acctRes.data.phone || '',
        address: acctRes.data.address || '',
      });
      setNotifications(notifRes.data.notifications);
      setBalance(balRes.data.balance);
      setTransactions(trxRes.data.transactions);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (event, action) => {
    event.preventDefault();
    setMessage(null);

    try {
      if (action === 'deposit') {
        await deposit({ accountNumber: account.accountNumber, amount: Number(form.amount) });
      } else if (action === 'withdraw') {
        await withdraw({
          accountNumber: account.accountNumber,
          amount: Number(form.amount),
          atmPin: withdrawPin,
        });
      } else if (action === 'transfer') {
        await transfer({
          fromAccountNumber: account.accountNumber,
          toAccountNumber: form.toAccount,
          amount: Number(form.amount),
        });
      } else if (action === 'bill') {
        await payBill({
          accountNumber: account.accountNumber,
          billType: form.billType,
          amount: Number(form.amount),
        });
      }
      await getData();
      setMessage('Action completed successfully');
      setForm({ amount: '', toAccount: '', billType: 'electricity' });
      setWithdrawPin('');
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const handlePin = async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
      const response = await verifyPin(atmPin);
      setAtmInfo(response.data);
      setMessage('ATM card details unlocked (card number, CVV, expiry).');
      setAtmPin('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Invalid ATM PIN');
    }
  };

  const handleProfileSave = async () => {
    try {
      await updateProfile(profile);
      setMessage('Profile updated');
      setEditMode(false);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message);
    }
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="page">
      <header className="header">
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p>{user?.email}</p>
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

      <section className="card">
        <h3>Account Overview</h3>
        <p>
          <strong>Account:</strong> {account?.accountNumber}
        </p>
        <p>
          <strong>Balance:</strong> ₹{balance}
        </p>
        <p>
          <strong>ATM Card:</strong> {account?.atmCardNumber}
        </p>
        <p>
          <strong>Passbook ID:</strong> {account?.mobilePassbookId}
        </p>
      </section>

      <section className="card">
        <h3>ATM Card Details (PIN Required)</h3>
        <form onSubmit={handlePin} className="form">
          <label>
            Enter ATM PIN to view card details
            <input
              type="password"
              value={atmPin}
              onChange={(e) => setAtmPin(e.target.value)}
              maxLength={6}
              required
            />
          </label>
          <button className="btn" type="submit">
            Show Card Details
          </button>
          <p className="muted">
            The ATM PIN is only used to view card details and to authorize withdrawals.
          </p>
        </form>

        {atmInfo && (
          <div>
            <p>
              <strong>ATM Card:</strong> {atmInfo.atmCardNumber}
            </p>
            <p>
              <strong>CVV:</strong> {atmInfo.atmCvv}
            </p>
            <p>
              <strong>Expiry:</strong> {atmInfo.atmExpiry}
            </p>
          </div>
        )}
      </section>

      {message && <div className="notification">{message}</div>}

      <section className="card">
        <h3>Profile</h3>
        {editMode ? (
          <div className="form">
            <label>
              Name
              <input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </label>
            <label>
              Phone
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </label>
            <label>
              Address
              <input
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              />
            </label>
            <div className="row">
              <button className="btn" type="button" onClick={handleProfileSave}>
                Save
              </button>
              <button className="btn" type="button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone}
            </p>
            <p>
              <strong>Address:</strong> {profile.address}
            </p>
            <button className="btn" type="button" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </section>

      <section className="card">
        <h3>Notifications</h3>
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul>
            {notifications.slice(0, 5).map((note) => (
              <li key={note._id}>
                <strong>{new Date(note.createdAt).toLocaleString()}:</strong> {note.message}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid">
        <div className="card">
          <h3>Deposit / Withdraw</h3>
          <form onSubmit={(e) => handleSubmit(e, 'deposit')} className="form">
            <label>
              Amount
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>
            <label>
              ATM PIN (required for withdrawal)
              <input
                type="password"
                value={withdrawPin}
                onChange={(e) => setWithdrawPin(e.target.value)}
                maxLength={6}
                placeholder="Enter ATM PIN"
              />
            </label>
            <div className="row">
              <button className="btn" type="submit">
                Deposit
              </button>
              <button className="btn" type="button" onClick={(e) => handleSubmit(e, 'withdraw')}>
                Withdraw
              </button>
            </div>
          </form>
        </div>

        <div className="card">
          <h3>Transfer</h3>
          <form onSubmit={(e) => handleSubmit(e, 'transfer')} className="form">
            <label>
              To Account
              <input
                value={form.toAccount}
                onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
                required
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>
            <button className="btn" type="submit">
              Transfer
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Bill Payment</h3>
          <form onSubmit={(e) => handleSubmit(e, 'bill')} className="form">
            <label>
              Bill Type
              <select
                value={form.billType}
                onChange={(e) => setForm({ ...form, billType: e.target.value })}
              >
                <option value="electricity">Electricity</option>
                <option value="mobile">Mobile</option>
                <option value="internet">Internet</option>
                <option value="emi">EMI</option>
                <option value="rent">Rent</option>
              </select>
            </label>
            <label>
              Amount
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </label>
            <button className="btn" type="submit">
              Pay Bill
            </button>
          </form>
        </div>
      </section>

      <section className="card">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Credit / Debit</th>
                <th>Amount</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((tx) => {
                const isCredit = tx.type === 'deposit';
                return (
                  <tr key={tx._id}>
                    <td>{new Date(tx.createdAt).toLocaleString()}</td>
                    <td style={{ textTransform: 'capitalize' }}>{tx.type}</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          background: isCredit ? '#d4edda' : '#f8d7da',
                          color: isCredit ? '#155724' : '#721c24',
                        }}
                      >
                        {isCredit ? '⬆ Credit' : '⬇ Debit'}
                      </span>
                    </td>
                    <td style={{ color: isCredit ? 'green' : 'red', fontWeight: 'bold' }}>
                      {isCredit ? '+' : '-'}₹{tx.amount}
                    </td>
                    <td>{tx.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
