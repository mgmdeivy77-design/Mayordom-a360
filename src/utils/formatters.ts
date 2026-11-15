import { AppState, Debt } from '../types';

export const formatCurrency = (amount: number, currency = 'DOP'): string => {
  const formatted = new Intl.NumberFormat('es-DO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  if (currency === 'USD') {
    return `US$ ${formatted}`;
  }
  return `RD$ ${formatted}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('es-DO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getMonthName = (monthIndex: number): string => {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  return months[monthIndex] || '';
};

export interface FinancialTotals {
  totalIncome: number;
  totalExpense: number;
  availableCash: number;
  totalSavings: number;
  totalInvestments: number;
  totalDebts: number;
  netWorth: number;
  dailyAverageExpense: number;
  budgetUsagePercentage: number;
}

export const calculateFinancialTotals = (state: AppState): FinancialTotals => {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const transactions = state?.transactions || [];
  const savingsGoals = state?.savingsGoals || [];
  const investments = state?.investments || [];
  const debts = state?.debts || [];
  const budgets = state?.budgets || [];

  // Current month income
  const currentMonthIncomes = transactions.filter(
    (t) => t.type === 'income' && t.date.startsWith(currentMonthStr)
  );
  const totalIncome = currentMonthIncomes.reduce((acc, t) => acc + t.amount, 0);

  // Current month expense
  const currentMonthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonthStr)
  );
  const totalExpense = currentMonthExpenses.reduce((acc, t) => acc + t.amount, 0);

  // Total savings in goals
  const totalSavings = savingsGoals.reduce((acc, g) => acc + g.currentAmount, 0);

  // Total investments current value
  const totalInvestments = investments.reduce((acc, i) => acc + i.currentValue, 0);

  // Total debt current balances
  const totalDebts = debts.reduce((acc, d) => acc + d.currentBalance, 0);

  // Total liquid cash available = total income - total expense (simulated base liquid + current month balance)
  const availableCash = Math.max(0, 145000 + totalIncome - totalExpense);

  // Net worth = Assets (Savings + Investments + Available Cash) - Liabilities (Debts)
  const totalAssets = availableCash + totalSavings + totalInvestments;
  const netWorth = totalAssets - totalDebts;

  // Daily average expense based on days passed in current month
  const dayOfMonth = Math.max(1, now.getDate());
  const dailyAverageExpense = totalExpense / dayOfMonth;

  // Budget usage %
  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.limitAmount, 0);
  const budgetUsagePercentage =
    totalBudgetLimit > 0 ? Math.min(100, Math.round((totalExpense / totalBudgetLimit) * 100)) : 0;

  return {
    totalIncome,
    totalExpense,
    availableCash,
    totalSavings,
    totalInvestments,
    totalDebts,
    netWorth,
    dailyAverageExpense,
    budgetUsagePercentage,
  };
};

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
}

export const calculateFrenchAmortization = (
  principal: number,
  annualInterestRate: number,
  months: number
): AmortizationRow[] => {
  if (principal <= 0 || months <= 0) return [];
  const monthlyRate = annualInterestRate / 100 / 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / months;
  } else {
    monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month: i,
      payment: Math.round(monthlyPayment * 100) / 100,
      interest: Math.round(interest * 100) / 100,
      principal: Math.round(principalPaid * 100) / 100,
      remainingBalance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
};

// Smart local fallback for financial insights in Dominican context
export const generateLocalFinancialAdvice = (state: AppState) => {
  const totals = calculateFinancialTotals(state);
  const transactions = state?.transactions || [];
  const savingsGoals = state?.savingsGoals || [];

  const foodExpenses = transactions
    .filter((t) => t.type === 'expense' && t.category === 'Alimentos')
    .reduce((acc, t) => acc + t.amount, 0);

  const fuelExpenses = transactions
    .filter((t) => t.type === 'expense' && t.category === 'Combustible')
    .reduce((acc, t) => acc + t.amount, 0);

  const emergencyGoal = savingsGoals.find((g) => g.category === 'Emergencia');
  const emergencyPercentage = emergencyGoal
    ? Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100)
    : 65;

  const recs = [];

  if (foodExpenses > 20000) {
    recs.push({
      type: 'savings',
      title: 'Optimización de Compras de Supermercado',
      description: `Este mes has dedicado ${formatCurrency(
        foodExpenses
      )} a alimentos. Comprando víveres y granos en Olé o Bravo en días de oferta puedes ahorrar hasta un 15% (aprox. ${formatCurrency(
        foodExpenses * 0.15
      )}).`,
    });
  }

  if (fuelExpenses > 7000) {
    recs.push({
      type: 'warning',
      title: 'Control de Combustible',
      description: `Tus gastos de combustible ascienden a ${formatCurrency(
        fuelExpenses
      )}. Considera agrupar diligencias familiares o usar tarjetas con cashback en estaciones de servicio.`,
    });
  }

  if (totals.totalInvestments > 0) {
    recs.push({
      type: 'investment',
      title: 'Rendimiento de Inversiones RD$',
      description: `Tienes ${formatCurrency(
        totals.totalInvestments
      )} invertidos en títulos locales con rendimiento prometedor. Explora fondos abiertos para reinvertir cupones.`,
    });
  } else {
    recs.push({
      type: 'investment',
      title: 'Momento de Invertir',
      description: `¡Estás listo para comenzar a invertir! Explora Fondos Mutuos Abiertos en Puestos de Bolsa autorizados por la SIMV con aportes desde RD$ 1,000.`,
    });
  }

  recs.push({
    type: 'tip',
    title: 'Fondo de Emergencia Familiar',
    description: `Tu fondo de reserva está al ${emergencyPercentage}% de la meta de 6 meses de gastos. Sigue destinando un aporte fijo mensual.`,
  });

  return {
    summary: `Tu patrimonio neto actual es de ${formatCurrency(
      totals.netWorth
    )}. Tienes un flujo de caja controlado con un ${
      totals.budgetUsagePercentage
    }% del presupuesto ejecutado en el mes.`,
    healthScore: Math.min(100, Math.max(50, 100 - (totals.budgetUsagePercentage > 90 ? 20 : 0) + (totals.totalSavings > 100000 ? 15 : 0))),
    recommendations: recs,
    supermarketTip:
      'Aprovecha el "Día de carnes" en Bravo y compra víveres en el Mercado Central para reducir la factura quincenal.',
  };
};
