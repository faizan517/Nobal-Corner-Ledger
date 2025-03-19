
// API base URL
const BASE_URL = 'https://ncvl-api.thementorhealth.com/api';

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

  login: async (credentials: { email: string; password: string }) => {
    console.log("Sending login request with credentials:", credentials);
    
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Login failed with status:", response.status);
      console.error("Error response:", errorData);
      throw new Error(`Login failed: ${errorData.message || 'Unknown error'}`);
    }
    
    return response.json();
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
  
  getAllUsers: async () => {
    const response = await fetch(`${BASE_URL}/users/getall`);
    if (!response.ok) throw new Error("Failed to fetch users");
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
    console.log('Sending data to API:', entryData);
    try {
      const response = await fetch(`${BASE_URL}/ledgers/addnew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to add ledger entry: ${errorData.message || response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      console.error('Error in addLedgerEntry:', error);
      throw error;
    }
  },

  updateLedgerEntry: async (id: string, entryData: any) => {
    console.log('Updating data for ID:', id, 'with data:', entryData);
    try {
      const response = await fetch(`${BASE_URL}/ledgers/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(`Failed to update ledger entry: ${errorData.message || response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      console.error('Error in updateLedgerEntry:', error);
      throw error;
    }
  },

  deleteLedgerEntry: async (id: string) => {
    const response = await fetch(`${BASE_URL}/ledgers/delete/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete ledger entry');
    return response.json();
  },

  getLedgersByCompany: async (vendorName: string) => {
    const response = await fetch(`${BASE_URL}/ledgers/ledgers/${vendorName}`);
    if (!response.ok) throw new Error('Failed to fetch company ledgers');
    return response.json();
  },

  getAllLedgers: async () => {
    const response = await fetch(`${BASE_URL}/ledgers/companies`);
    if (!response.ok) throw new Error('Failed to fetch all ledgers');
    return response.json();
  },

  getLedgerReport: async (vendorName: string, startDate: string, endDate: string, format: 'pdf' | 'excel' = 'pdf') => {
    const url = `${BASE_URL}/ledger-report/${encodeURIComponent(vendorName)}?format=${format}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ledger report');
    }
    
    return response.blob();
  }
};
