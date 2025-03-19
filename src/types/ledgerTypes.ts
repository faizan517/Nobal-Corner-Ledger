
// Define types for ledger-related data

export interface Vendor {
  id?: number;
  company_name: string;
  supplier_name: string;
  phone_no: string;
  balance: number;
}

export interface LedgerEntry {
  date: string;
  vendor_name: string;
  phone_no?: string;
  challan_no: string;
  debit: number;
  credit?: number;
  balance: number;
  payment_method: string;
  cheque_number?: string;
  descriptions: string[];
  quantities: number[];
  price_per_meters: string[];
  units?: string[];
}

export interface LedgerEntryFormData {
  descriptions: string[];
  quantities: string[];
  price_per_meter: string[];
  units: string[];
  date: string;
  vendor_name: string;
  phone_no?: string;
  challan_no: string;
  debit: string | number;
  credit: string | number;
  balance: string | number;
  payment_method: string;
  cheque_number?: string;
}
