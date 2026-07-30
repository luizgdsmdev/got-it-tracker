export interface Person {
  id: string;
  name: string;
  email?: string;     // Request: "Usuário possui campos de: Nome, email, idade, senha"
  password?: string;  // Request: "Usuário possui campos de: Nome, email, idade, senha"
  avatarUrl?: string;
  initials: string;
  age: number;
  tag: string;
  role: string;
  spendingLimit: number;
  permissionEnabled: boolean;
  colorTheme: string;
}

export interface Transaction {
  id: string;
  description: string; // Request: "descrição"
  value: number;       // Request: "valor"
  type: 'expense' | 'income'; // Request: "tipo (gasto ou ganho)"
  date: string;        // Request: "data"
  personId: string;
  category: string;
  playgroundId?: string;
  isPublic?: boolean;
  approvalStatus?: number;
}

export interface Playground {
  id: string;
  name: string;        // Request: "Nome"
  description: string; // Request: "descrição"
  ownerName: string;   // Request: "dono" (Mapped to ownerName / owner)
  owner?: string;      // Alias for owner
  balance: number;
  target?: number;
  progress?: number;
  image: string;
  colorTheme?: string;
  requireVerification: boolean; // Request: "solicitar aprovação" (mapped to requireVerification / requireApproval)
  requireApproval?: boolean;    // Alias for solicitar aprovação
  memberIds?: string[];
  memberLimits?: Record<string, number>;
  memberPermissions?: Record<string, boolean>;
}

export interface Approval {
  id: string;
  title: string;
  playgroundName: string; // Request: "playground name"
  playgroundId?: string;
  value: number;          // Request: "valor"
  type: 'expense' | 'income'; // Request: "tipo (ganho ou gasto)"
  requesterName: string;  // Request: "requisitor name"
  reviewerName: string;   // Request: "nome do revisor"
  visibility: 'Public' | 'Private'; // Request: "public (toggle sim ou não)" (mapped to visibility / publicToggle)
  publicToggle?: boolean; // Toggle sim ou não
  description: string;    // Request: "descrição"
  reason?: string;        // Request: "motivo de aceitação/negação"
  status: 'pending' | 'approved' | 'rejected'; // Request: "status"
  personId?: string;
  requestedAt?: string;
}

export interface GlobalSettings {
  defaultCurrency: 'USD' | 'EUR' | 'GBP' | 'JPY';
  monthlyClosingDate: number;
  autoExport: boolean;
  limitBreachAlerts: boolean;
}

export type ScreenId =
  | 'dashboard'
  | 'people'
  | 'reports'
  | 'admin'
  | 'playgrounds'
  | 'add-transaction'
  | 'configure-playground'
  | 'approvals'
  | 'login'
  | 'playground-detail';
