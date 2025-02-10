
export interface LedgerEntry {
  id: number;
  vendorId: string;
  challanNo: string;
  debit: number;
  credit: number;
  ledger: string;
  details: DetailEntry[];
}

export interface DetailEntry {
  id: number;
  description: string;
  quantity: number;
  priceMtr: number;
}
