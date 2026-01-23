export interface DailyStats {
  date: string;
  totalClients: number;
  newClientsToday: number;
  totalAccounts: number;
  newAccountsToday: number;
  totalBalance: number;
  dailyRevenue: number;
  totalTransactions: number;
  transactionsToday: number;
}

export interface Comparison {
  clientsGrowth: number;
  accountsGrowth: number;
  balanceGrowth: number;
}

export interface WeeklyStats {
  weeklyData: DailyStats[];
  comparison: Comparison;
}

export interface WeekResetResponse {
  reset: boolean;
  weekNumber: number;
}