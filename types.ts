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

export interface Customer {
  name: string;
  nif: string;
  address: string;
  postalCode: string;
  city: string; // Local do serviço
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
  technicianName: string;
  status: ServiceStatus;
  channel: string; // Phone, Email, Web, etc.
  startDate: string; // ISO String
  endDate: string; // ISO String
  vehicle: string;
  
  // Customer Data
  customer: Customer;

  // Work Details
  scope: string; // Âmbito
  report: string; // Relatório
  observations: string;

  // Media & Signatures
  images: ServiceImage[];
  technicianSignature?: string; // Data URL
  customerSignature?: string; // Data URL
}

export type ViewMode = 'dashboard' | 'calendar' | 'list' | 'edit';
