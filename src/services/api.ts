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
    console.log('Sending data to API:', entryData);
    try {
      const response = await fetch(`${BASE_URL}/ledgers/addnew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entryData,
          // Ensure units are properly formatted, convert array to comma-separated string if needed
          units: Array.isArray(entryData.units) ? entryData.units.join(',') : entryData.units,
          // Make sure descriptions, quantities, and prices are properly formatted
          descriptions: Array.isArray(entryData.descriptions) ? entryData.descriptions.join(',') : entryData.descriptions,
          quantities: Array.isArray(entryData.quantities) ? entryData.quantities.join(',') : entryData.quantities,
          price_per_meters: Array.isArray(entryData.price_per_meters) ? entryData.price_per_meters.join(',') : entryData.price_per_meters
        }),
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
      const response = await fetch(`${BASE_URL}/ledgers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entryData,
          // Ensure units are properly formatted, convert array to comma-separated string if needed
          units: Array.isArray(entryData.units) ? entryData.units.join(',') : entryData.units,
          // Make sure descriptions, quantities, and prices are properly formatted
          descriptions: Array.isArray(entryData.descriptions) ? entryData.descriptions.join(',') : entryData.descriptions,
          quantities: Array.isArray(entryData.quantities) ? entryData.quantities.join(',') : entryData.quantities,
          price_per_meters: Array.isArray(entryData.price_per_meters) ? entryData.price_per_meters.join(',') : entryData.price_per_meters
        }),
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

  getLedgerReport: async (companyName: string, startDate: string, endDate: string, format: 'pdf' | 'excel' = 'pdf') => {
    const url = `${BASE_URL}/ledger-report/${encodeURIComponent(companyName)}?format=${format}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch ledger report');
    }
    
    return response.blob();
  }
};
