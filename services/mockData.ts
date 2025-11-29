import { ServiceOrder, ServiceStatus, Priority } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const technicians = ['João Silva', 'Ana Santos', 'Carlos Pereira', 'Pedro Rodrigues', 'Miguel Costa'];
const assistants = ['Rui Mendes', 'Sofia Martins', 'Tiago Ferreira', 'Luis Gonçalves', '']; // Empty string for no assistant cases
const vehicles = ['Viatura A1 (XX-00-XX)', 'Viatura B2 (00-YY-00)', 'Viatura C3 (11-ZZ-11)', 'Viatura D4 (22-AA-22)'];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateMockData = (): ServiceOrder[] => {
  const orders: ServiceOrder[] = [];
  const now = new Date();
  
  for (let i = 0; i < 15; i++) {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() + (i - 5)); // Past and future dates
    startDate.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2);

    // Ensure technician and assistant aren't the same person if an assistant exists
    const tech = getRandomElement(technicians);
    let assist = getRandomElement(assistants);
    if (assist === tech) assist = '';

    orders.push({
      id: generateId(),
      processNumber: `PROC-${2024000 + i}`,
      priority: getRandomElement(Object.values(Priority)),
      technicianName: tech,
      assistantTechnicianName: assist,
      status: getRandomElement(Object.values(ServiceStatus)),
      channel: getRandomElement(['Email', 'Telefone', 'Portal', 'WhatsApp']),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      vehicle: getRandomElement(vehicles),
      customer: {
        name: `Cliente Empresa ${i + 1} Lda.`,
        nif: `500${100000 + i}`,
        address: `Rua Principal, Nº ${i + 10}`,
        postalCode: `1000-${100 + i}`,
        city: 'Lisboa',
        contacts: `+351 910 000 00${i}`
      },
      scope: 'Manutenção preventiva de equipamentos de climatização, verificação de quadros elétricos e aperto de conexões.',
      report: i < 5 ? 'Serviço realizado conforme procedimentos técnicos. Medições de tensão efetuadas (230V estáveis). Limpeza de filtros realizada.' : '',
      observations: i < 5 ? 'Equipamento em bom estado operacional. Recomendada substituição de disjuntor Q2 na próxima visita.' : '',
      images: [],
      technicianSignature: undefined,
      customerSignature: undefined,
    });
  }
  return orders;
};