export type TransactionType = 'income' | 'expense';

export type IncomeCategoryType =
  | 'Salario'
  | 'Negocio'
  | 'Freelance'
  | 'Comisiones'
  | 'Bonificaciones'
  | 'Alquileres'
  | 'Remesas'
  | 'Regalos'
  | 'Ingresos extraordinarios'
  | string;

export type ExpenseCategoryType =
  | 'Alimentos'
  | 'Combustible'
  | 'Electricidad'
  | 'Agua'
  | 'Internet'
  | 'Celular'
  | 'Colegio'
  | 'Universidad'
  | 'Salud'
  | 'Medicamentos'
  | 'Diezmos'
  | 'Ofrendas'
  | 'Transporte'
  | 'Préstamos'
  | 'Tarjetas'
  | 'Ropa'
  | 'Recreación'
  | 'Impuestos'
  | 'Mascotas'
  | 'Emergencias'
  | 'Otros'
  | string;

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  description: string;
  category: string;
  amount: number;
  account: string; // e.g., 'Banco Popular', 'Banreservas', 'BHD', 'Efectivo'
  notes?: string;
  store?: string;
  tags?: string[];
}

export type BudgetPeriod = 'weekly' | 'monthly' | 'annual';

export interface BudgetCategory {
  category: string;
  limitAmount: number;
  period?: BudgetPeriod;
}

export type EventCategory =
  | 'payment'
  | 'due'
  | 'income'
  | 'reminder'
  | 'birthday'
  | 'insurance'
  | 'tax'
  | 'renewal';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: EventCategory;
  amount?: number;
  isPaid: boolean;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string; // Casa, Vehículo, Universidad, Vacaciones, Emergencia, Computadora, etc.
  targetAmount: number;
  currentAmount: number;
  estimatedDate: string;
  recommendedMonthlyContribution: number;
  category: string;
  icon: string;
}

export type InvestmentType =
  | 'CD' // Certificado Depósito / Financiero RD$
  | 'Bonos' // Bonos Banco Central / Hacienda
  | 'Fondos' // Fondos Mutuos / AFI
  | 'Acciones'
  | 'ETF'
  | 'Negocios'
  | 'Bienes raíces'
  | 'Criptomonedas'
  | 'Otros';

export interface Investment {
  id: string;
  type: InvestmentType;
  name: string;
  institution: string; // e.g., 'Banreservas AFI', 'JMMB', 'Puesto de Bolsa CCI'
  capital: number;
  returnRateAnnual: number; // e.g. 11.5 for 11.5%
  currentValue: number;
  profit: number;
  startDate: string;
  maturityDate?: string;
  notes?: string;
}

export type DebtType =
  | 'Banco'
  | 'Tarjeta'
  | 'Préstamo'
  | 'Hipoteca'
  | 'Vehículo'
  | 'Prestamista'
  | 'Familiares';

export interface Debt {
  id: string;
  type: DebtType;
  creditor: string; // e.g., 'Banco Popular', 'Banreservas', 'Tío Juan'
  originalAmount: number;
  currentBalance: number;
  interestRateAnnual: number; // %
  monthlyPayment: number;
  dueDateDay: number; // 1-31
  totalPaid: number;
  totalMonths: number;
  remainingMonths: number;
  notes?: string;
}

export type SupermarketName =
  | 'Bravo'
  | 'Nacional'
  | 'Jumbo'
  | 'La Sirena'
  | 'Olé'
  | 'PriceSmart'
  | 'SuperFresh'
  | 'Iberia'
  | 'Aprezio'
  | 'Mercado/Colmado'
  | 'Otro';

export interface Product {
  id: string;
  name: string;
  category:
    | 'Carnes'
    | 'Pollo'
    | 'Pescados'
    | 'Vegetales'
    | 'Frutas'
    | 'Lácteos'
    | 'Pan'
    | 'Arroz'
    | 'Habichuelas'
    | 'Aceites'
    | 'Condimentos'
    | 'Limpieza'
    | 'Higiene'
    | 'Bebidas'
    | 'Congelados'
    | 'Snacks'
    | 'Mascotas'
    | 'Bebés'
    | 'Electrodomésticos'
    | 'Ferretería'
    | 'Farmacia'
    | string;
  defaultUnit: string; // 'lb', 'kg', 'unidad', 'litro', 'paquete', 'funda', 'galón'
  pricesByStore: Record<string, number>; // store name -> price in DOP$
  brand?: string;
  lastUpdated?: string;
}

export interface ShoppingListItem {
  id: string;
  productId?: string;
  name: string;
  category: string;
  store: SupermarketName;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  checked: boolean;
}

export interface DayMenu {
  day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
  estimatedCost: number;
  ingredients: { name: string; qty: string; category: string }[];
}

export interface HomeInventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expirationDate: string;
  estimatedDailyConsumption: number;
  location: 'Despensa' | 'Nevera' | 'Freezer' | 'Gabinete' | 'Otro';
}

export interface StewardshipRecord {
  id: string;
  date: string;
  type: 'Diezmo' | 'Ofrenda' | 'Ayuda' | 'Misiones' | 'Donación' | 'tithe' | 'offering' | 'firstfruit' | 'charity';
  description?: string;
  amount: number;
  recipient?: string;
  scriptureReference?: string;
  notes?: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  category:
    | 'Presupuesto'
    | 'Ahorro'
    | 'Inversión'
    | 'Deudas'
    | 'Tarjetas'
    | 'Interés Compuesto'
    | 'Inflación'
    | 'Impuestos'
    | 'Seguros'
    | 'Fondo de Emergencia'
    | 'Jubilación'
    | 'Educación Niños'
    | 'Mayordomía Bíblica';
  readingTime: string;
  summary: string;
  content: string; // Markdown or rich formatted text
  badgeRewardId?: string;
  keyTakeaways: string[];
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserSettings {
  currency: 'DOP' | 'USD';
  language: 'es';
  theme: 'light' | 'dark';
  primaryColor: string; // hex string e.g. '#1e40af'
  incomeCategories: string[];
  expenseCategories: string[];
  customIncomeCategories: string[];
  customExpenseCategories: string[];
  favoriteSupermarkets: SupermarketName[];
  firstDayOfWeek: 'monday' | 'sunday';
  dateFormat: 'DD/MM/YYYY' | 'YYYY-MM-DD';
  enableStewardshipModule: boolean;
  securityPin: string | null;
  pinEnabled: boolean;
  emergencyFundMonthsGoal: 3 | 6 | 9 | 12;
  preferredBudgetPeriod?: BudgetPeriod;
}

export interface UserProfile {
  familyName: string;
  familyMembersCount: number;
  province: string;
}

export interface AppState {
  profile: UserProfile;
  transactions: Transaction[];
  budgets: BudgetCategory[];
  calendarEvents: CalendarEvent[];
  savingsGoals: SavingsGoal[];
  investments: Investment[];
  debts: Debt[];
  products: Product[];
  shoppingList: ShoppingListItem[];
  weeklyMenu: DayMenu[];
  inventory: HomeInventoryItem[];
  stewardship: StewardshipRecord[];
  badges: UserBadge[];
  settings: UserSettings;
}
