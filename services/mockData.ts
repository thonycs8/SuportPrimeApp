
import { ServiceOrder, ServiceStatus, Priority, ContractStatus, SLALevel, AuditLogEntry, ChecklistItem, Vehicle, Invoice, InvoiceStatus, Employee } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const technicians = ['João Silva', 'Ana Santos', 'Carlos Pereira', 'Pedro Rodrigues', 'Miguel Costa'];
const assistants = ['Rui Mendes', 'Sofia Martins', 'Tiago Ferreira', 'Luis Gonçalves', '']; 
const vehicles = ['Viatura A1 (XX-00-XX)', 'Viatura B2 (00-YY-00)', 'Viatura C3 (11-ZZ-11)', 'Viatura D4 (22-AA-22)'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateAuditLog = (date: Date): AuditLogEntry[] => [
    {
        id: generateId(),
        action: 'Criação',
        details: 'Ordem de serviço criada via Portal',
        timestamp: new Date(date.getTime() - 86400000).toISOString(),
        userId: 'sys',
        userName: 'Sistema'
    },
    {
        id: generateId(),
        action: 'Atribuição',
        details: 'Técnico João Silva atribuído',
        timestamp: new Date(date.getTime() - 80000000).toISOString(),
        userId: 'mgr',
        userName: 'Carlos Gestor'
    }
];

const standardChecklist: ChecklistItem[] = [
    { id: 'ck1', label: 'Verificar EPIs', checked: false },
    { id: 'ck2', label: 'Isolar área de trabalho', checked: false },
    { id: 'ck3', label: 'Verificar tensão elétrica', checked: false },
    { id: 'ck4', label: 'Limpeza final', checked: false }
];

export const generateMockData = (): ServiceOrder[] => {
  const orders: ServiceOrder[] = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + (i - 7));
    startDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
    
    const endDate = new Date(startDate);
    const duration = 1 + Math.floor(Math.random() * 3);
    endDate.setHours(startDate.getHours() + duration);

    const tech = getRandomElement(technicians);
    let assist = getRandomElement(assistants);
    if (assist === tech) assist = '';

    const status = getRandomElement(Object.values(ServiceStatus));
    
    let npsScore = undefined;
    let actualStartTime = undefined;
    let actualEndTime = undefined;
    let checklist = [...standardChecklist];

    if (status === ServiceStatus.DONE) {
        npsScore = Math.floor(Math.random() * 3) + 8;
        actualStartTime = startDate.toISOString();
        const actualEnd = new Date(endDate);
        actualEnd.setMinutes(endDate.getMinutes() + Math.floor(Math.random() * 30) - 15);
        actualEndTime = actualEnd.toISOString();
        checklist = checklist.map(c => ({...c, checked: true}));
    } else if (status === ServiceStatus.IN_PROGRESS) {
        actualStartTime = startDate.toISOString();
        checklist[0].checked = true;
        checklist[1].checked = true;
    }

    const history = [
        {
            status: ServiceStatus.PENDING,
            timestamp: new Date(startDate.getTime() - 86400000).toISOString(),
            updatedBy: 'Sistema'
        }
    ];

    if (status !== ServiceStatus.PENDING) {
        history.push({
            status: status,
            timestamp: startDate.toISOString(),
            updatedBy: tech
        });
    }

    orders.push({
      id: generateId(),
      organizationId: 'org-pro',
      processNumber: `PROC-${2024000 + i}`,
      priority: getRandomElement(Object.values(Priority)),
      technicianName: tech,
      assistantTechnicianName: assist,
      status: status,
      statusHistory: history,
      auditLog: generateAuditLog(startDate),
      channel: getRandomElement(['Email', 'Telefone', 'Portal', 'WhatsApp']),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      actualStartTime: actualStartTime,
      actualEndTime: actualEndTime,
      vehicle: getRandomElement(vehicles),
      customer: {
        id: `cust-${i}`,
        name: `Cliente Lisboa ${i + 1} Lda.`,
        nif: `500${100000 + i}`,
        address: `Av. da Liberdade, Nº ${i + 10}`,
        postalCode: `1000-${100 + i}`,
        city: 'Lisboa',
        contacts: `+351 910 000 00${i}`,
        contractStatus: i % 3 === 0 ? ContractStatus.ACTIVE : ContractStatus.PENDING,
        slaLevel: i % 4 === 0 ? SLALevel.PLATINUM : SLALevel.STANDARD,
        tags: i % 2 === 0 ? ['VIP', 'Recorrente'] : ['Novo']
      },
      scope: 'Manutenção preventiva de equipamentos de climatização.',
      report: i < 5 ? 'Serviço realizado. Medições nominais.' : '',
      observations: i < 5 ? 'Cliente solicitou orçamento.' : '',
      checklist: checklist,
      images: [],
      technicianSignature: undefined,
      customerSignature: undefined,
      npsScore: npsScore
    });
  }
  return orders;
};

// --- NEW MOCK DATA GENERATORS ---

export const MOCK_VEHICLES: Vehicle[] = [
    { id: 'v1', plate: 'AA-22-BB', brand: 'Renault', model: 'Kangoo', status: 'active', mileage: 125000, lastService: '2023-12-01', assignedTo: 'João Silva' },
    { id: 'v2', plate: 'CC-33-DD', brand: 'Peugeot', model: 'Partner', status: 'maintenance', mileage: 180000, lastService: '2024-01-15' },
    { id: 'v3', plate: 'EE-44-FF', brand: 'Toyota', model: 'Proace', status: 'active', mileage: 45000, lastService: '2023-11-20', assignedTo: 'Ana Santos' },
    { id: 'v4', plate: 'GG-55-HH', brand: 'Mercedes', model: 'Vito', status: 'active', mileage: 210000, lastService: '2024-02-01' },
];

export const MOCK_INVOICES: Invoice[] = [
    { id: 'inv1', number: 'FT 2024/001', customerName: 'Cliente Lisboa 1 Lda', amount: 450.00, date: '2024-02-01', dueDate: '2024-03-01', status: InvoiceStatus.SENT, items: 3 },
    { id: 'inv2', number: 'FT 2024/002', customerName: 'Restaurante O Pátio', amount: 120.50, date: '2024-02-05', dueDate: '2024-02-20', status: InvoiceStatus.PAID, items: 1 },
    { id: 'inv3', number: 'FT 2024/003', customerName: 'Condomínio Azul', amount: 890.00, date: '2024-01-15', dueDate: '2024-02-15', status: InvoiceStatus.OVERDUE, items: 5 },
];

export const MOCK_EMPLOYEES: Employee[] = [
    { id: 'emp1', name: 'João Silva', role: 'Técnico Sénior', department: 'Manutenção', email: 'joao@empresa.com', phone: '910000001', status: 'Active', joinDate: '2020-05-01' },
    { id: 'emp2', name: 'Ana Santos', role: 'Técnica', department: 'Instalação', email: 'ana@empresa.com', phone: '910000002', status: 'Active', joinDate: '2021-02-15' },
    { id: 'emp3', name: 'Carlos Gestor', role: 'Gestor de Operações', department: 'Administração', email: 'carlos@empresa.com', phone: '910000003', status: 'Active', joinDate: '2019-01-10' },
];
