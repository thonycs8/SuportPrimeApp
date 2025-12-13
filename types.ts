
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

export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Administrador', 
  DIRECTOR = 'Diretor',
  MANAGER = 'Gestor',
  SUPERVISOR = 'Supervisor',
  TECHNICIAN = 'Técnico',
  ASSISTANT = 'Técnico Assistente',
  CLIENT = 'Cliente'
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
  trialEndsAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId: string;
  avatar?: string;
}

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
  id?: string;
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string; 
  contacts: string;
  email?: string;
  contractStatus?: ContractStatus;
  slaLevel?: SLALevel;
  tags?: string[];
  ltv?: number;
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

export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  userId: string;
  userName: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface ServiceOrder {
  id: string;
  organizationId: string;
  processNumber: string;
  priority: Priority;
  technicianName: string;
  assistantTechnicianName?: string;
  status: ServiceStatus;
  statusHistory: StatusHistoryEntry[]; 
  auditLog?: AuditLogEntry[];
  channel: string;
  startDate: string;
  endDate: string;
  actualStartTime?: string;
  actualEndTime?: string;
  vehicle: string;
  customer: Customer;
  scope: string; 
  report: string; 
  observations: string;
  checklist?: ChecklistItem[];
  images: ServiceImage[];
  technicianSignature?: string; 
  customerSignature?: string;
  npsScore?: number;
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
  nif?: string;
  status: LeadStatus;
  notes: string;
  createdAt: string;
  potentialValue?: number;
  probability?: number;
  lastContact?: string;
  proposedPlan?: PlanType;
  userCount?: number;
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

// --- INTEGRATIONS & WEBHOOKS ---
export enum WebhookEvent {
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_COMPLETED = 'order.completed',
  LEAD_CREATED = 'lead.created'
}

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  isActive: boolean;
  secret: string;
  lastTriggered?: string;
  failureCount: number;
}

// --- NEW MODULES TYPES ---

// Fleet & Assets
export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastService: string;
  mileage: number;
  assignedTo?: string;
}

export interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  category: string;
  status: 'available' | 'in_use' | 'repair';
  purchaseDate: string;
}

// Financial
export enum InvoiceStatus {
  DRAFT = 'Rascunho',
  SENT = 'Enviada',
  PAID = 'Paga',
  OVERDUE = 'Vencida'
}

export interface Invoice {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  items: number;
}

// HR
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joinDate: string;
}

// Extended ViewMode for Navigation
export type ViewMode = 
  | 'landing' | 'login' | 'public-tracking' 
  | 'dashboard' | 'tech-dashboard' | 'calendar' | 'admin-panel'
  | 'crm' | 'support' | 'settings'
  | 'list' | 'edit' | 'read-pdf' // Operational
  | 'fleet-list' | 'assets-list' // Resources
  | 'finance-invoices' | 'finance-expenses' // Financial
  | 'hr-employees' | 'hr-payroll'; // HR
