import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { getAccounts, createAccount, getTransactions } from './api';

// --- LAYOUT WITH NAVBAR ---
function Layout({ children }) {
  const location = useLocation();
  const linkStyle = (path) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    background: location.pathname === path ? 'white' : 'transparent',
    color: location.pathname === path ? 'black' : 'white',
    fontWeight: location.pathname === path ? 'bold' : 'normal',
  });
  return (
    <div style={{ minHeight: '100vh', background: '#0f1115', color: 'white', fontFamily: 'Inter, Arial' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#1a1d24', borderBottom: '1px solid #2a2d3a' }}>
        <h2 style={{ margin: 0 }}>🏦 LedgerLine</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/" style={linkStyle('/')}>Dashboard</Link>
          <Link to="/accounts" style={linkStyle('/accounts')}>Accounts</Link>
          <Link to="/transactions" style={linkStyle('/transactions')}>Transactions</Link>
        </div>
      </nav>
      <div style={{ maxWidth: '1000px', margin: 'auto', padding: '30px 20px' }}>{children}</div>
    </div>
  );
}

// --- PAGE 1: DASHBOARD ---
function Dashboard({ accounts, txns }) {
  const totalBalance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
  return (
    <div>
      <h1>Welcome back 👋</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ background: '#1e222e', padding: '20px', borderRadius: '12px' }}><p style={{ color: '#aaa' }}>Total Balance</p><h2>₹{totalBalance}</h2></div>
        <div style={{ background: '#1e222e', padding: '20px', borderRadius: '12px' }}><p style={{ color: '#aaa' }}>Total Accounts</p><h2>{accounts.length}</h2></div>
        <div style={{ background: '#1e222e', padding: '20px', borderRadius: '12px' }}><p style={{ color: '#aaa' }}>Total Transactions</p><h2>{txns.length}</h2></div>
      </div>
      <h3 style={{ marginTop: '30px' }}>Recent Transactions</h3>
      {txns.slice(-5).reverse().map(t => (
        <div key={t.id} style={{ background: '#1e222e', padding: '12px', marginBottom: '8px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span><b>{t.type}</b> {t.fromAccount ? `From ${t.fromAccount}` : ''}</span><span style={{ color: '#4ade80' }}>₹{t.amount}</span>
        </div>
      ))}
    </div>
  );
}

// --- PAGE 2: ACCOUNTS ---
function AccountsPage({ accounts, form, setForm, handleCreate }) {
  return (
    <div>
      <h1>Accounts</h1>
      <div style={{ background: '#1e222e', padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
        <h3>Create New Account</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
          <input placeholder="Owner Name" value={form.ownerName} onChange={e => setForm({...form, ownerName: e.target.value})} required style={{padding:'10px', borderRadius:'6px', background:'#2a2e3a', border:'1px solid #333', color:'white'}} />
          <input type="number" value={form.initialBalance} onChange={e => setForm({...form, initialBalance: e.target.value})} style={{padding:'10px', borderRadius:'6px', background:'#2a2e3a', border:'1px solid #333', color:'white'}} />
          <select value={form.accountType} onChange={e => setForm({...form, accountType: e.target.value})} style={{padding:'10px', borderRadius:'6px', background:'#2a2e3a', color:'white'}}>
            <option>SAVINGS</option><option>CURRENT</option>
          </select>
          <button type="submit" style={{padding:'10px 20px', background:'white', color:'black', borderRadius:'6px', fontWeight:'bold', cursor:'pointer'}}>Create</button>
        </form>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {accounts.map(acc => (
          <div key={acc.id} style={{ background: '#1e222e', padding: '20px', borderRadius: '12px', borderLeft: `4px solid ${acc.accountType === 'SAVINGS' ? '#8b5cf6' : '#22d3ee'}` }}>
            <h3 style={{margin:'0 0 5px 0'}}>{acc.ownerName}</h3><p style={{margin:0, color:'#aaa', fontSize:'13px'}}>{acc.accountNumber}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}><span style={{ background: '#2a2e3a', padding: '4px 8px', borderRadius: '4px', fontSize:'12px' }}>{acc.accountType}</span><b>₹{acc.balance}</b></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PAGE 3: TRANSACTIONS ---
function TransactionsPage({ txns }) {
  return (
    <div>
      <h1>All Transactions ({txns.length})</h1>
      <div style={{ background: '#1e222e', borderRadius: '12px', overflow: 'hidden', marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', padding: '12px 20px', background: '#252a38', color: '#aaa', fontSize:'13px' }}><span>Type</span><span>Amount</span><span>Date</span><span>Details</span></div>
        {txns.slice().reverse().map(t => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', padding: '14px 20px', borderBottom: '1px solid #2a2e3a', fontSize:'14px' }}>
            <span style={{ color: t.type === 'DEPOSIT' ? '#4ade80' : '#f87171' }}>{t.type}</span><span>₹{t.amount}</span><span style={{ color: '#aaa' }}>{new Date(t.timestamp || Date.now()).toLocaleDateString()}</span><span>{t.fromAccount || ''} {t.toAccount ? `→ ${t.toAccount}` : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN APP ---
function App() {
  const [accounts, setAccounts] = useState([]);
  const [txns, setTxns] = useState([]);
  const [form, setForm] = useState({ ownerName: '', initialBalance: '1000', accountType: 'SAVINGS' });

  const loadData = () => { getAccounts().then(setAccounts); getTransactions().then(setTxns); };
  useEffect(() => { loadData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createAccount(form);
    setForm({ ownerName: '', initialBalance: '1000', accountType: 'SAVINGS' });
    loadData();
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard accounts={accounts} txns={txns} />} />
          <Route path="/accounts" element={<AccountsPage accounts={accounts} form={form} setForm={setForm} handleCreate={handleCreate} />} />
          <Route path="/transactions" element={<TransactionsPage txns={txns} />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;