const API_BASE = "http://localhost:8080/api/ledger";

export const getAccounts = () => fetch(`${API_BASE}/accounts`).then(r => r.json());

export const createAccount = (data) => fetch(`${API_BASE}/accounts`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
}).then(r => r.json());

export const getTransactions = () => fetch(`${API_BASE}/transactions`).then(r => r.json());