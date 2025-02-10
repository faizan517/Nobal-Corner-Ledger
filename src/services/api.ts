// API base URL
const BASE_URL = 'http://localhost:5000/api';

// User APIs
export const userApi = {
  register: async (userData: any) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();
  },

  login: async (credentials: { username: string; password: string }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Invalid username or password');
      }
      
      return data;
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        throw new Error('Invalid username or password');
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  updateUser: async (id: string, userData: any) => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Update failed');
    return response.json();
  },

  deleteUser: async (id: string) => {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Delete failed');
    return response.json();
  },
};

// Vendor APIs
export const vendorApi = {
  addVendor: async (vendorData: any) => {
    const response = await fetch(`${BASE_URL}/vendors/addvendor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) throw new Error('Failed to add vendor');
    return response.json();
  },

  updateVendor: async (id: string, vendorData: any) => {
    const response = await fetch(`${BASE_URL}/vendors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) throw new Error('Failed to update vendor');
    return response.json();
  },

  deleteVendor: async (id: string) => {
    const response = await fetch(`${BASE_URL}/vendors/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete vendor');
    return response.json();
  },

  getAllVendors: async () => {
    const response = await fetch(`${BASE_URL}/vendors/getvendors`);
    if (!response.ok) throw new Error('Failed to fetch vendors');
    return response.json();
  },
};

// Ledger APIs
export const ledgerApi = {
  addLedgerEntry: async (entryData: any) => {
    const response = await fetch(`${BASE_URL}/ledgers/addnew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    if (!response.ok) throw new Error('Failed to add ledger entry');
    return response.json();
  },

  updateLedgerEntry: async (id: string, entryData: any) => {
    const response = await fetch(`${BASE_URL}/ledgers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entryData),
    });
    if (!response.ok) throw new Error('Failed to update ledger entry');
    return response.json();
  },

  deleteLedgerEntry: async (id: string) => {
    const response = await fetch(`${BASE_URL}/ledgers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete ledger entry');
    return response.json();
  },

  getLedgersByCompany: async (vendorId: string) => {
    const response = await fetch(`${BASE_URL}/ledgers/company/${vendorId}`);
    if (!response.ok) throw new Error('Failed to fetch company ledgers');
    return response.json();
  },

  getAllLedgers: async () => {
    const response = await fetch(`${BASE_URL}/ledgers/companies`);
    if (!response.ok) throw new Error('Failed to fetch all ledgers');
    return response.json();
  },
};
