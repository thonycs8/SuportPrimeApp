
export enum ServiceStatus {
  PENDING = 'Pendente',
  IN_PROGRESS = 'Em Execução',
  DONE = 'Realizado',
  RESCHEDULE = 'Reagendar',
  CANCELED = 'Não Realizado'
}

export enum Priority {
  LOW = 'Baixa',
  NORMAL = 'Normal',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

// Roles defined in the prompt
export enum UserRole {
  SUPER_ADMIN = 'Super Admin', // New Root Level Access
  ADMIN = 'Administrador', 
  DIRECTOR = 'Diretor',
  MANAGER = 'Gestor', // Organization Owner
  SUPERVISOR = 'Supervisor',
  TECHNICIAN = 'Técnico',
  ASSISTANT = 'Técnico Assistente',
  CLIENT = 'Cliente' // End customer viewing their own data
}

export enum PlanType {
  FREE = 'Free',
  PRO = 'Pro',
  ENTERPRISE = 'Enterprise'
}

export enum OrganizationStatus {
  ACTIVE = 'Ativo',
  SUSPENDED = 'Suspenso',
  CANCELED = 'Cancelado'
}

export enum SuspensionReason {
  NON_PAYMENT = 'Falta de Pagamento',
  CONTRACT_BREACH = 'Quebra de Contrato',
  USAGE_ABUSE = 'Uso Indevido',
  OTHER = 'Outro'
}

export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  maxUsers: number;
  activeUsers: number;
  nif?: string;
  status: OrganizationStatus;
  suspensionReason?: SuspensionReason;
  joinedAt?: string;
  trialEndsAt?: string; // New field for Trial Logic
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
}

// PREMIUM: Contract & SLA Types
export enum ContractStatus {
  ACTIVE = 'Ativo',
  EXPIRED = 'Expirado',
  PENDING = 'Pendente',
  NONE = 'Sem Contrato'
}

export enum SLALevel {
  STANDARD = 'Standard (48h)',
  GOLD = 'Gold (24h)',
  PLATINUM = 'Platinum (4h)'
}

export interface Customer {
  id?: string; // Added ID for linking
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string; 
  contacts: string;
  email?: string;
  // Premium CRM Fields
  contractStatus?: ContractStatus;
  slaLevel?: SLALevel;
  tags?: string[];
  ltv?: number; // Lifetime Value
}

export interface ServiceImage {
  id: string;
  url: string;
  name: string;
  description: string;
}

export interface StatusHistoryEntry {
  status: ServiceStatus;
  timestamp: string;
  updatedBy: string;
}

// PREMIUM: Audit Log
export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// PREMIUM: Checklist
export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ServiceOrder {
  id: string;
  organizationId: string; // Tenant Isolation
  processNumber: string;
  priority: Priority;
  
  // Team
  technicianName: string;
  assistantTechnicianName?: string;
  
  status: ServiceStatus;
  statusHistory: StatusHistoryEntry[]; 
  auditLog?: AuditLogEntry[]; // Premium traceability
  
  channel: string;
  
  // Scheduled Time
  startDate: string;
  endDate: string;

  // Real Execution Time (New)
  actualStartTime?: string;
  actualEndTime?: string;
  
  vehicle: string;
  
  // Customer Data
  customer: Customer;

  // Work Details
  scope: string; 
  report: string; 
  observations: string;
  
  // Premium: Checklist
  checklist?: ChecklistItem[];

  // Media & Signatures
  images: ServiceImage[];
  technicianSignature?: string; 
  customerSignature?: string;
  
  // Quality Metrics (New)
  npsScore?: number; // 0 to 10
}

// --- CRM & Support Types ---

export enum LeadStatus {
  NEW = 'Novo',
  CONTACTED = 'Contactado',
  QUALIFIED = 'Qualificado',
  CONVERTED = 'Convertido',
  LOST = 'Perdido'
}

export interface Lead {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  nif?: string; // Added NIF
  status: LeadStatus;
  notes: string;
  createdAt: string;
  potentialValue?: number; // For pipeline forecast
  probability?: number;    // 0-100%
  lastContact?: string;
  
  // Commercial Proposal Details
  proposedPlan?: PlanType;
  userCount?: number; // 5, 10, 25, 50
}

export enum TicketStatus {
  OPEN = 'Aberto',
  IN_PROGRESS = 'Em Análise',
  RESOLVED = 'Resolvido',
  CLOSED = 'Fechado'
}

export interface TicketMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportTicket {
  id: string;
  organizationId: string;
  organizationName: string;
  subject: string;
  status: TicketStatus;
  priority: Priority;
  createdAt: string;
  messages: TicketMessage[];
}

export type ViewMode = 'landing' | 'login' | 'public-tracking' | 'dashboard' | 'tech-dashboard' | 'calendar' | 'list' | 'edit' | 'read-pdf' | 'settings' | 'admin-panel' | 'support';
