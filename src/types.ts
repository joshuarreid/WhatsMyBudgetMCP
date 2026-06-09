export type AnalyticsPeriodsResponse = {
  periods: string[];
  count: number;
};

export type AnalyticsPeriodOverviewResponse = {
  statementPeriod: string | null;
  paymentMethod: string | null;
  account: string | null;
  totalAmount: number;
  transactionCount: number;
};

export type AnalyticsCategoryBreakdownResponse = {
  category: string;
  totalAmount: number;
  transactionCount: number;
};

export type AnalyticsCriticalityBreakdownResponse = {
  criticality: string;
  totalAmount: number;
  transactionCount: number;
};

export type AnalyticsAccountBreakdownResponse = {
  account: string;
  totalAmount: number;
  transactionCount: number;
};

export type AnalyticsPaymentMethodBreakdownResponse = {
  paymentMethod: string;
  totalAmount: number;
  transactionCount: number;
};

export type AnalyticsDailyTotalResponse = {
  date: string;
  totalAmount: number;
  transactionCount: number;
};

export type AnalyticsDuplicateResponse = {
  rowHash: string;
  occurrences: number;
  totalAmount: number;
};

export type BudgetTransaction = {
  id?: number;
  name?: string;
  amount: number;
  category?: string;
  criticality?: string;
  transactionDate?: string;
  account?: string;
  paymentMethod?: string;
  statementPeriod?: string;
  rowHash?: string;
};

export type AnalyticsStatementPeriodSummaryResponse = {
  statementPeriod: string;
  periodStartDate: string | null;
  periodEndDate: string | null;
  totalAmount: number;
  transactionCount: number;
  essentialAmount: number;
  essentialCount: number;
  nonessentialAmount: number;
  nonessentialCount: number;
  categoryBreakdown: Record<string, AnalyticsCategoryBreakdownResponse[]>;
  criticalityBreakdown: Record<string, AnalyticsCriticalityBreakdownResponse[]>;
  accountBreakdown: Record<string, AnalyticsAccountBreakdownResponse>;
  paymentMethodBreakdown: Record<string, AnalyticsPaymentMethodBreakdownResponse[]>;
  outliers: Record<string, BudgetTransaction[]>;
  generatedAt: string;
};

