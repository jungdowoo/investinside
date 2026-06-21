export type Investor = {
  id: string;
  slug: string;
  display_name: string;
  investor_name: string;
  firm_name: string;
  cik: string;
  description: string | null;
  style: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type Filing = {
  id: string;
  investor_id: string;
  accession_number: string;
  form_type: string;
  filing_date: string;
  report_date: string;
  sec_url: string;
  information_table_url: string | null;
  raw_submission?: Record<string, unknown> | null;
  created_at?: string;
};

export type Holding = {
  id?: string;
  filing_id: string;
  investor_id: string;
  report_date: string;
  issuer_name: string;
  title_of_class: string | null;
  cusip: string;
  ticker: string | null;
  value_usd: number;
  shares: number;
  share_type: string | null;
  put_call: string | null;
  investment_discretion: string | null;
  voting_sole: number | null;
  voting_shared: number | null;
  voting_none: number | null;
  portfolio_weight: number;
};

export type ChangeType = "NEW" | "EXIT" | "INCREASE" | "DECREASE" | "UNCHANGED";

export type HoldingChange = {
  id?: string;
  investor_id: string;
  current_filing_id: string;
  previous_filing_id: string | null;
  ticker: string | null;
  cusip?: string;
  issuer_name: string;
  change_type: ChangeType;
  previous_shares: number;
  current_shares: number;
  share_change: number;
  share_change_percent: number | null;
  previous_value_usd: number;
  current_value_usd: number;
  value_change_usd: number;
  report_date: string;
};

export type InvestorSnapshot = {
  investor: Investor;
  filing: Filing | null;
  previousFiling: Filing | null;
  holdings: Holding[];
  changes: HoldingChange[];
};

export type OverlapItem = {
  key: string;
  ticker: string | null;
  cusip: string;
  issuerName: string;
  owners: Array<{
    investorId: string;
    investorSlug: string;
    displayName: string;
    weight: number;
  }>;
};
