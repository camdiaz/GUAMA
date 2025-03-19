export interface Transaction {
  id?: number;
  name: string;
  date: string;
  amount: number;
  status: 'PENDING' | 'PAID';
}

export interface TransactionFilter {
  name?: string;
  date?: string;
  status?: string;
} 