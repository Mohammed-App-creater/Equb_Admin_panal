
export interface User {
  id: string;
  phone: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardSummary {
  totalEqubs: number;
  totalMembers: number;
  activeCycles: number;
  totalSavings: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'payment' | 'draw' | 'new_member';
  message: string;
  timestamp: string;
}

export interface EqubListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Equb[];
}

export interface EqubType {
  id: string;
  name: string;
  description: string;
}

export interface EqubCategory {
  id: string;
  name: string;
  image: string;
  description: string;
  is_favorite: boolean;
}

export interface Equb {
  id: string;
  members: number;
  pending_members: number;
  pending_payments: number;
  equb_type: EqubType;
  category: EqubCategory;
  name: string;
  start_date: string;
  end_date: string;
  lottery_draw_schedule: string;
  rules: string;
  rules_approved: boolean;
  payout_system: string; // You might want to define specific types like 'first_come_first_serve' | 'lottery' | etc.
  total_members: number;
  contribution_amount: string;
  total_payout: string;
  total_equb_value: string;
  status: string; // You might want to define specific types like 'active' | 'completed' | 'pending' | etc.
  created_at: string;
  updated_at: string;
}
// WEEK 2 NEW TYPES
export type Status = 'pending' | 'approved' | 'rejected';

export interface Member {
  id: string;
  user_name: string;
  phone: string;
  joined_at: string;
  status: Status;
  totalContributed: number;
}

export interface Payment {
  id: string;
  amount: string;
  payment_method: string;
  transaction_id: string;
  paid_at: string | null;
  receipt_image: string;
  status: string;
  approved_at: string | null;
  rejected_reason: string | null;
  round_number: number;
  created_at: string;
  updated_at: string;
  equb_member: string;
  approved_by: string | null;
}

export interface Round {
  id: string;
  roundNumber: number;
  status: 'pending' | 'completed';
  winnerName?: string;
  drawDate?: string;
}
