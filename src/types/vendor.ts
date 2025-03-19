
export interface VendorLedgerEntry {
  id: string;
  date: string;
  challan_no: string;
  company_name: string;
  vendor_name: string;
  debit: number;
  credit: number;
  balance: number;
  payment_method: string;
  cheque_number?: string;
  description?: string;
  quantity?: string;
  price_per_meter?: string;
  descriptions?: string[];
  quantities?: string[];
  prices?: string[];
  units?: string[];
}

export interface NewLedgerEntry {
  date: string;
  challanNo: string;
  debit: number | string;
  credit: number | string;
  paymentMethod: string;
  vendorName: string;
  chequeNumber?: string;
  descriptions: string[];
  quantities: string[];
  price_per_meter: string[];
  units: string[];
}

export interface LedgerAPIResponse {
  ledgers: VendorLedgerEntry[];
}
