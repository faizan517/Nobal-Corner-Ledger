
export interface Vendor {
  id?: string;
  company_name: string;
  supplier_name: string;
  phone_no: string;
  balance: number;
}

export interface LedgerEntry {
  id: string;
  date: string;
  vendor_name: string;
  company_name?: string;
  challan_no: string;
  debit: number;
  credit: number;
  balance: number;
  payment_method: string;
  cheque_number?: string;
  description?: string; // Comma-separated
  quantity?: string; // Comma-separated
  price_per_meter?: string; // Comma-separated
  units?: string[] | string; // Array or comma-separated
  descriptions?: string[]; // For direct array access
  quantities?: string[]; // For direct array access
  prices?: string[]; // For direct array access
}

export interface LedgerEntryFormData {
  date: string;
  vendor_name: string;
  challan_no: string;
  debit: string | number;
  credit: string | number;
  balance: string | number;
  payment_method: string;
  cheque_number?: string;
  descriptions: string[];
  quantities: string[];
  price_per_meter: string[];
  units: string[];
}
