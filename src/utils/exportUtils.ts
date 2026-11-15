import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { AppState } from '../types';
import { calculateFinancialTotals, formatCurrency, formatDate } from './formatters';

export const exportPdfReport = (state: AppState) => {
  const doc = new jsPDF();
  const totals = calculateFinancialTotals(state);
  const now = new Date();
  const dateStr = formatDate(now.toISOString().slice(0, 10));

  // Header Banner
  doc.setFillColor(30, 58, 138); // Dominican Blue #1e3a8a
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MAYORDOMO FAMILIAR RD', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Informe Financiero Familiar - Generado: ${dateStr}`, 110, 18);

  // Summary Metrics Table
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Resumen de Finanzas Familiares', 14, 38);

  autoTable(doc, {
    startY: 42,
    head: [['Indicador Financiero', 'Monto (DOP$)']],
    body: [
      ['Ingresos del Mes', formatCurrency(totals.totalIncome)],
      ['Gastos del Mes', formatCurrency(totals.totalExpense)],
      ['Dinero Disponible Liquido', formatCurrency(totals.availableCash)],
      ['Ahorros Acumulados', formatCurrency(totals.totalSavings)],
      ['Portafolio de Inversiones', formatCurrency(totals.totalInvestments)],
      ['Deudas Totales Pendientes', formatCurrency(totals.totalDebts)],
      ['Patrimonio Neto Familiar', formatCurrency(totals.netWorth)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
  });

  // Latest Movements Table
  let finalY = (doc as any).lastAutoTable.finalY + 12;
  doc.text('2. Últimos Movimientos Registrados', 14, finalY);

  const txData = state.transactions.slice(0, 10).map((t) => [
    formatDate(t.date),
    t.description,
    t.category,
    t.type === 'income' ? 'Ingreso' : 'Gasto',
    t.account,
    formatCurrency(t.amount),
  ]);

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Cuenta/Vía', 'Monto']],
    body: txData,
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105], textColor: 255 },
  });

  // Debts and Goals Summary
  finalY = (doc as any).lastAutoTable.finalY + 12;

  if (finalY > 230) {
    doc.addPage();
    finalY = 20;
  }

  doc.text('3. Metas de Ahorro e Inversiones', 14, finalY);

  const goalsData = state.savingsGoals.map((g) => [
    g.title,
    g.category,
    formatCurrency(g.targetAmount),
    formatCurrency(g.currentAmount),
    `${Math.round((g.currentAmount / g.targetAmount) * 100)}%`,
    formatDate(g.estimatedDate),
  ]);

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Meta', 'Categoría', 'Monto Objetivo', 'Monto Actual', 'Progreso', 'Fecha Estimada']],
    body: goalsData,
    theme: 'striped',
    headStyles: { fillColor: [217, 119, 6], textColor: 255 },
  });

  doc.save(`Mayordomo_Familiar_RD_Reporte_${now.toISOString().slice(0, 10)}.pdf`);
};

export const exportExcelReport = (state: AppState) => {
  const wb = XLSX.utils.book_new();

  // Transactions Sheet
  const txSheetData = state.transactions.map((t) => ({
    Fecha: t.date,
    Tipo: t.type === 'income' ? 'Ingreso' : 'Gasto',
    Descripción: t.description,
    Categoría: t.category,
    Monto: t.amount,
    'Cuenta / Banco': t.account,
    Tienda: t.store || '',
    Notas: t.notes || '',
  }));
  const wsTx = XLSX.utils.json_to_sheet(txSheetData);
  XLSX.utils.book_append_sheet(wb, wsTx, 'Movimientos');

  // Budget Sheet
  const budgetSheetData = state.budgets.map((b) => ({
    Categoría: b.category,
    'Límite Presupuestado': b.limitAmount,
  }));
  const wsBudget = XLSX.utils.json_to_sheet(budgetSheetData);
  XLSX.utils.book_append_sheet(wb, wsBudget, 'Presupuestos');

  // Savings Goals Sheet
  const goalsSheetData = state.savingsGoals.map((g) => ({
    Meta: g.title,
    Categoría: g.category,
    'Monto Objetivo': g.targetAmount,
    'Monto Actual': g.currentAmount,
    'Fecha Estimada': g.estimatedDate,
    'Aporte Recomendado': g.recommendedMonthlyContribution,
  }));
  const wsGoals = XLSX.utils.json_to_sheet(goalsSheetData);
  XLSX.utils.book_append_sheet(wb, wsGoals, 'Metas de Ahorro');

  // Debts Sheet
  const debtsSheetData = state.debts.map((d) => ({
    Acreedor: d.creditor,
    Tipo: d.type,
    'Monto Original': d.originalAmount,
    'Saldo Pendiente': d.currentBalance,
    'Tasa de Interés %': d.interestRateAnnual,
    'Cuota Mensual': d.monthlyPayment,
  }));
  const wsDebts = XLSX.utils.json_to_sheet(debtsSheetData);
  XLSX.utils.book_append_sheet(wb, wsDebts, 'Deudas');

  // Investments Sheet
  const invSheetData = state.investments.map((i) => ({
    Inversión: i.name,
    Institución: i.institution,
    Tipo: i.type,
    Capital: i.capital,
    'Valor Actual': i.currentValue,
    Ganancia: i.profit,
    'Tasa Anual %': i.returnRateAnnual,
  }));
  const wsInv = XLSX.utils.json_to_sheet(invSheetData);
  XLSX.utils.book_append_sheet(wb, wsInv, 'Inversiones');

  XLSX.writeFile(wb, `Mayordomo_Familiar_RD_Datos_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportUserGuidePdf = () => {
  const doc = new jsPDF();

  // Page 1: Cover Header
  doc.setFillColor(30, 58, 138); // Dominican Blue
  doc.rect(0, 0, 210, 35, 'F');

  // Red accent line
  doc.setFillColor(220, 38, 38); // Dominican Red
  doc.rect(0, 35, 210, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('GUÍA Y MANUAL DE USO OFICIAL', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Mayordomo Familiar RD - Sistema de Control y Finanzas del Hogar', 14, 26);
  doc.text(`Fecha: ${formatDate(new Date().toISOString().slice(0, 10))}`, 150, 26);

  let currentY = 48;

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Introducción y Seguridad de Datos', 14, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const introText =
    'Mayordomo Familiar RD es una plataforma integral diseñada para la administración inteligente del presupuesto familiar, control de despensa y planificación económica en República Dominicana. Todos sus datos se guardan de forma 100% confidencial y local en la memoria de su propio navegador (LocalStorage), sin riesgo de exposición a servidores externos.';
  const splitIntro = doc.splitTextToSize(introText, 180);
  doc.text(splitIntro, 14, currentY);
  currentY += splitIntro.length * 4 + 6;

  // Chapter 2: Summary Table of Modules
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Mapa Principal de Módulos', 14, currentY);

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Módulo / Herramienta', 'Propósito Principal', 'Acción Clave / Recomendación']],
    body: [
      [
        'Dashboard General',
        'Visión 360° de finanzas, balance y alertas.',
        'Revisar diariamente los saldos y alertas activas.',
      ],
      [
        'Gestión de Ingresos',
        'Registro de sueldos, remesas y extras.',
        'Categorizar por fuente (Nomina, Remesa, Negocio).',
      ],
      [
        'Gestión de Gastos',
        'Control de pagos diarios en RD.',
        'Asignar tienda o supermercado para auditoría.',
      ],
      [
        'Presupuesto Mensual',
        'Distribución 50/30/20 por categorías.',
        'Monitorear la barra de consumo antes de gastar.',
      ],
      [
        'Calendario Financiero',
        'Programación de pagos y facturas fijas.',
        'Activar alertas de vencimiento de CDEEE, CAASD, etc.',
      ],
      [
        'Metas de Ahorro',
        'Ahorro con metas (vivienda, vehículo, viajes).',
        'Asignar aportes mensuales automáticos recomendados.',
      ],
      [
        'Fondo de Emergencia',
        'Reserva para imprevistos (3-12 meses).',
        'Priorizar completar la meta de 3 meses primero.',
      ],
      [
        'Control de Deudas',
        'Liquidación mediante Método Bola de Nieve.',
        'Realizar pagos extraordinarios al saldo principal.',
      ],
      [
        'Inversiones & Renta',
        'Registro de certificados y fondos mutuos.',
        'Revisar el rendimiento anual y retornos.',
      ],
      [
        'Mayordomía Cristiana',
        'Control voluntario de diezmos y ofrendas.',
        'Llevar un registro ordenado del 10% y primicias.',
      ],
    ],
    theme: 'striped',
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
    styles: { fontSize: 8 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  // Chapter 3: Shopping and Home Modules
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Módulos de Compras y Alimentación RD', 14, currentY);

  autoTable(doc, {
    startY: currentY + 4,
    head: [['Módulo de Hogar', 'Funcionalidad', 'Paso a Paso']],
    body: [
      [
        'Lista Inteligente Compras',
        'Cálculo de costo total estimado en supermercados.',
        'Crear ítems, asignar supermercado (Sirena, Bravo, Jumbo) y marcar al comprar.',
      ],
      [
        'Base de Productos RD',
        'Catálogo de precios de canasta familiar dominicana.',
        'Consultar o añadir precios actualizados por establecimiento.',
      ],
      [
        'Comparador de Precios',
        'Identificación del supermercado más económico.',
        'Ingresar producto y comparar dónde conviene comprar.',
      ],
      [
        'Planificador de Menú',
        'Planificación semanal de desayunos, almuerzos y cenas.',
        'Diseñar menú semanal y pulsar "Enviar ingredientes a Lista de Compras".',
      ],
      [
        'Inventario del Hogar',
        'Control de víveres en despensa, nevera y congelador.',
        'Registrar alimentos y estar atento a alertas de caducidad.',
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [5, 150, 105], textColor: 255 },
    styles: { fontSize: 8 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  if (currentY > 220) {
    doc.addPage();
    currentY = 20;
  }

  // Chapter 4: AI & Backup
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Asistente AI, Reportes y Respaldo de Seguridad', 14, currentY);

  currentY += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const backupText =
    '• Asistente Mayordomo AI: Haga preguntas como "¿Cómo puedo ahorrar DOP$ 5,000 este mes en mi compra de alimentos?" para recibir análisis financieros personalizados.\n' +
    '• Copias de Seguridad: Vaya a Configuración y haga clic en "Exportar Copia de Seguridad JSON". Guarde este archivo para restaurar sus datos en cualquier momento o dispositivo.\n' +
    '• PIN de Protección: Puede habilitar un PIN de 4 dígitos en Configuración para asegurar el acceso a sus finanzas cuando preste su dispositivo.';
  const splitBackup = doc.splitTextToSize(backupText, 180);
  doc.text(splitBackup, 14, currentY);

  // Footer on all pages
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Mayordomo Familiar RD - Manual de Usuario | Página ${i} de ${totalPages}`,
      105,
      287,
      { align: 'center' }
    );
  }

  doc.save(`Mayordomo_Familiar_RD_Guia_de_Uso_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const exportCsvTransactions = (state: AppState) => {
  const headers = ['Fecha', 'Tipo', 'Descripción', 'Categoría', 'Monto', 'Cuenta', 'Tienda', 'Notas'];
  const rows = state.transactions.map((t) => [
    t.date,
    t.type,
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.amount,
    t.account,
    t.store || '',
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Movimientos_Mayordomo_RD_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
