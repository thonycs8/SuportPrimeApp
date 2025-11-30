
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

export interface Customer {
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string; 
  contacts: string;
}

export interface ServiceImage {
  id: string;
  url: string;
  name: string;
  description: string;
}

export interface ServiceOrder {
  id: string;
  processNumber: string;
  priority: Priority;
  
  // Team
  technicianName: string;
  assistantTechnicianName?: string;
  
  status: ServiceStatus;
  channel: string;
  startDate: string;
  endDate: string;
  vehicle: string;
  
  // Customer Data
  customer: Customer;

  // Work Details
  scope: string; 
  report: string; 
  observations: string;

  // Media & Signatures
  images: ServiceImage[];
  technicianSignature?: string; 
  customerSignature?: string; 
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
  status: LeadStatus;
  notes: string;
  createdAt: string;
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

export type ViewMode = 'landing' | 'login' | 'public-tracking' | 'dashboard' | 'calendar' | 'list' | 'edit' | 'read-pdf' | 'settings' | 'admin-panel';
