
import { User, UserRole, Organization, PlanType, OrganizationStatus, Lead, LeadStatus, SupportTicket, TicketStatus, Priority } from '../types';

export const MOCK_ORGS: Record<string, Organization> = {
  'org-admin': {
    id: 'org-admin',
    name: 'Suporte Prime HQ',
    plan: PlanType.ENTERPRISE,
    maxUsers: 999,
    activeUsers: 1,
    status: OrganizationStatus.ACTIVE,
    joinedAt: '2023-01-01'
  },
  'org-free': {
    id: 'org-free',
    name: 'Instalações Silva (Free)',
    plan: PlanType.FREE,
    maxUsers: 1, 
    activeUsers: 1,
    status: OrganizationStatus.ACTIVE,
    joinedAt: '2024-02-15'
  },
  'org-pro': {
    id: 'org-pro',
    name: 'ElectroPrime S.A. (Pro)',
    plan: PlanType.PRO,
    maxUsers: 5,
    activeUsers: 3,
    status: OrganizationStatus.ACTIVE,
    joinedAt: '2023-11-20'
  }
};

export const MOCK_USERS: User[] = [
  {
    id: 'u0',
    name: 'Anthony Charles',
    email: 'thonycs8@icloud.com',
    role: UserRole.SUPER_ADMIN,
    organizationId: 'org-admin'
  },
  {
    id: 'u1',
    name: 'Carlos Gestor (Pro)',
    email: 'carlos@electroprime.pt',
    role: UserRole.MANAGER,
    organizationId: 'org-pro'
  },
  {
    id: 'u2',
    name: 'João Técnico (Pro)',
    email: 'joao@electroprime.pt',
    role: UserRole.TECHNICIAN,
    organizationId: 'org-pro'
  },
  {
    id: 'u3',
    name: 'Pedro Free (Free)',
    email: 'pedro@silva.pt',
    role: UserRole.MANAGER,
    organizationId: 'org-free'
  },
  {
    id: 'u4',
    name: 'Cliente Final',
    email: 'cliente@empresa.com',
    role: UserRole.CLIENT,
    organizationId: 'org-pro' 
  }
];

export const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'Roberto Almeida',
    companyName: 'ClimaTech Soluções',
    email: 'roberto@climatech.pt',
    phone: '912345678',
    status: LeadStatus.NEW,
    notes: 'Interessado no plano PRO para 5 técnicos.',
    createdAt: new Date().toISOString(),
    potentialValue: 1000,
    probability: 20,
    lastContact: new Date().toISOString(),
    proposedPlan: PlanType.PRO,
    userCount: 5
  },
  {
    id: 'l2',
    name: 'Maria Fernades',
    companyName: 'Luz & Água Lda',
    email: 'maria@luzagua.pt',
    phone: '966554433',
    status: LeadStatus.CONTACTED,
    notes: 'Aguarda demonstração do módulo de assinaturas.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    potentialValue: 2000,
    probability: 60,
    lastContact: new Date(Date.now() - 86400000).toISOString(),
    proposedPlan: PlanType.PRO,
    userCount: 10
  },
  {
    id: 'l3',
    name: 'Eng. Sousa',
    companyName: 'Construções Norte',
    email: 'sousa@cnorte.pt',
    phone: '933221100',
    status: LeadStatus.QUALIFIED,
    notes: 'Grande potencial. Empresa com 25 técnicos.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    potentialValue: 4500,
    probability: 85,
    lastContact: new Date(Date.now() - 86400000 * 2).toISOString(),
    proposedPlan: PlanType.PRO,
    userCount: 25
  },
  {
    id: 'l4',
    name: 'Joana Vaz',
    companyName: 'TechFix Repair',
    email: 'joana@techfix.pt',
    phone: '922111333',
    status: LeadStatus.NEW,
    notes: 'Contato via LinkedIn.',
    createdAt: new Date().toISOString(),
    potentialValue: 1000,
    probability: 10,
    proposedPlan: PlanType.PRO,
    userCount: 5
  }
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: 't1',
    organizationId: 'org-pro',
    organizationName: 'ElectroPrime S.A.',
    subject: 'Problema ao gerar PDF',
    status: TicketStatus.OPEN,
    priority: Priority.HIGH,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    messages: [
      { id: 'm1', sender: 'Carlos Gestor', content: 'Não consigo baixar o PDF das ordens finalizadas hoje.', timestamp: new Date(Date.now() - 3600000).toISOString(), isAdmin: false }
    ]
  },
  {
    id: 't2',
    organizationId: 'org-free',
    organizationName: 'Instalações Silva',
    subject: 'Como adicionar ajudante?',
    status: TicketStatus.RESOLVED,
    priority: Priority.LOW,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      { id: 'm2', sender: 'Pedro Free', content: 'Onde coloco o nome do ajudante?', timestamp: new Date(Date.now() - 86400000).toISOString(), isAdmin: false },
      { id: 'm3', sender: 'Suporte', content: 'No formulário da OS, na aba "Dados da Obra", existe um campo específico para o Técnico Ajudante.', timestamp: new Date(Date.now() - 80000000).toISOString(), isAdmin: true }
    ]
  }
];

export const getInitialData = () => {
    return {
        users: MOCK_USERS,
        orgs: Object.values(MOCK_ORGS),
        leads: MOCK_LEADS,
        tickets: MOCK_TICKETS
    };
};
