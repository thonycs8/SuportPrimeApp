
import { ServiceOrder, ServiceStatus, Priority, ContractStatus, SLALevel, AuditLogEntry, ChecklistItem } from '../types';

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
  
  // Create orders primarily for org-pro (The Demo Account)
  for (let i = 0; i < 20; i++) {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + (i - 7)); // Past and future dates
    startDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
    
    const endDate = new Date(startDate);
    const duration = 1 + Math.floor(Math.random() * 3); // 1 to 3 hours duration
    endDate.setHours(startDate.getHours() + duration);

    const tech = getRandomElement(technicians);
    let assist = getRandomElement(assistants);
    if (assist === tech) assist = '';

    const status = getRandomElement(Object.values(ServiceStatus));
    
    // Simulate NPS and Actual Times for DONE orders
    let npsScore = undefined;
    let actualStartTime = undefined;
    let actualEndTime = undefined;
    let checklist = [...standardChecklist];

    if (status === ServiceStatus.DONE) {
        npsScore = Math.floor(Math.random() * 3) + 8; // Mostly 8, 9, 10 for demo
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
      scope: 'Manutenção preventiva de equipamentos de climatização e verificação de quadros elétricos conforme normas ISO.',
      report: i < 5 ? 'Serviço realizado. Medições nominais. Limpeza efetuada.' : '',
      observations: i < 5 ? 'Cliente solicitou orçamento para nova unidade exterior.' : '',
      checklist: checklist,
      images: [],
      technicianSignature: undefined,
      customerSignature: undefined,
      npsScore: npsScore
    });
  }

  // Create a few orders for org-free (The Free Account)
  for (let i = 0; i < 3; i++) {
     orders.push({
      id: generateId(),
      organizationId: 'org-free',
      processNumber: `FREE-${2024000 + i}`,
      priority: Priority.NORMAL,
      technicianName: 'Pedro Free',
      assistantTechnicianName: '',
      status: i === 0 ? ServiceStatus.DONE : ServiceStatus.PENDING,
      statusHistory: [{ status: ServiceStatus.PENDING, timestamp: new Date().toISOString(), updatedBy: 'Sistema' }],
      channel: 'Telefone',
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      vehicle: 'Carro Próprio',
      customer: {
        name: `Cliente Pequeno ${i + 1}`,
        nif: `200${100000 + i}`,
        address: `Rua da Esquina, Nº ${i}`,
        postalCode: `2000-${100 + i}`,
        city: 'Santarém',
        contacts: `+351 960 000 00${i}`,
        contractStatus: ContractStatus.NONE,
        slaLevel: SLALevel.STANDARD
      },
      scope: 'Instalação simples.',
      report: '',
      observations: '',
      checklist: standardChecklist,
      images: [],
    });
  }

  return orders;
};
