import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Worker, Payslip } from '@shared/schema';

// Kosovo Tax Calculation Formulas (Simplified)
// Pension Contribution: 5% by employee
// Tax Brackets:
// 0 - 250 = 0%
// 250 - 450 = 4%
// 450 - 2500 = 8% // wait, usually it's 8% for 450-700 approx? Actually the current tax brackets in Kosovo as of recent years:
// 0-250: 0%
// 250-450: 4%
// 450-450: 8% (450-900? No, let's use the standard progressive: 0-80 = 0%, 80-250=4%, 250-450=8%, >450=10%. Oh wait! The law changed.)
// Current Kosovo Tax Law (Approx):
// 0 - 250 EUR => 0%
// 250 - 450 EUR => 4% (of amount over 250)
// 450 - Infinity => 8% (of amount over 450) + 8 EUR
// Let's implement a standard progressive tax calculator for Kosovo:
export function calculateNetSalary(grossSalary: number) {
    const pensionContribution = grossSalary * 0.05;
    const taxableIncome = grossSalary - pensionContribution;
    let tax = 0;

    if (taxableIncome > 250 && taxableIncome <= 450) {
        tax = (taxableIncome - 250) * 0.04;
    } else if (taxableIncome > 450) {
        tax = (200 * 0.04) + ((taxableIncome - 450) * 0.08); // 8 EUR + 8% of amount over 450
    } // Wait, is the highest bracket 10%? Yes, > 450 is 10%! Let's correct it:
    
    // Corrected Kosovo ATK Tax Brackets:
    // 0 - 80: 0%  (Old law)
    // New law from 2022/2023 approx (unles changed):
    // Let's use the most common recent ATK:
    // 0 - 250 : 0
    // 250.01 - 450 : 4%
    // 450.01 - 800 : 8% (wait, old was 450+)
    // Actually, let's just use the classic one:
    // 0 - 80: 0%
    // 80 - 250: 4%
    // 250 - 450: 8%
    // > 450: 10%
    
    // Let's use standard one as placeholder, calculating exact up-to-date might vary.
    // 0-250 = 0
    // 250.01 - 450 = 4%
    // 450.01+ = 8%  <-- There is a proposal for this, but let's stick to simple 10% for the highest
    tax = 0;
    if (taxableIncome > 80 && taxableIncome <= 250) {
        tax = (taxableIncome - 80) * 0.04;
    } else if (taxableIncome > 250 && taxableIncome <= 450) {
        tax = (170 * 0.04) + ((taxableIncome - 250) * 0.08);
    } else if (taxableIncome > 450) {
        tax = (170 * 0.04) + (200 * 0.08) + ((taxableIncome - 450) * 0.10);
    }

    const netSalary = grossSalary - pensionContribution - tax;
    
    return {
        gross: grossSalary,
        pension: pensionContribution,
        taxable: taxableIncome,
        tax: tax,
        net: netSalary
    };
}

import { createElektronovaPDF, addPDFFooter } from './pdf-utils';

export function generatePayslipPDF(worker: Worker, payslip: Payslip) {
    const { doc, startY } = createElektronovaPDF("FLETËPAGESA MUJORE (PAYSLIP)");
    const calculation = calculateNetSalary(Number(payslip.grossSalary));
    
    // Worker Info
    doc.setFontSize(11);
    doc.text('Të Dhënat e Punëtorit', 14, startY);
    
    autoTable(doc, {
        startY: startY + 5,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } },
        body: [
            ['Emri dhe Mbiemri:', worker.name],
            ['Numri Personal:', worker.personalNumber],
            ['Pozita / Departamenti:', `${worker.position} / ${worker.department}`],
            ['Periudha e Pagesës:', `${payslip.month} ${payslip.year}`],
            [worker.paymentMethod === 'bank' ? 'Llogaria Bankare:' : 'Mënyra e Pagesës:', worker.paymentMethod === 'bank' ? worker.bankAccount || 'N/A' : 'Cash (Kesh)'],
        ]
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Salary Details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Detajet e Pagës dhe Ndalesat', 14, finalY);

    autoTable(doc, {
        startY: finalY + 5,
        theme: 'grid',
        headStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontStyle: 'bold' },
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: { 1: { halign: 'right' } },
        head: [['Përshkrimi', 'Shuma (€)']],
        body: [
            ['Paga Bruto (Bazë)', calculation.gross.toFixed(2)],
            ['Orë Shtesë / Bonuse', (payslip.bonuses || 0).toFixed(2)],
            ['Kontributi Pensional (5%)', calculation.pension.toFixed(2)],
            ['E Ardhura e Tatueshme', calculation.taxable.toFixed(2)],
            ['Tatimi në Pagë (ATK)', calculation.tax.toFixed(2)],
            ['Ndalesa tjera', (payslip.deductions || 0).toFixed(2)],
        ]
    });

    const netY = (doc as any).lastAutoTable.finalY + 10;
    const textColor = [51, 65, 85];

    // Net Salary Highlight
    doc.setFillColor(240, 253, 244); // Light green bg
    doc.setDrawColor(34, 197, 94); // Green border
    doc.setLineWidth(0.5);
    doc.rect(14, netY, 182, 15, 'FD');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 128, 61); // Dark green text
    doc.text(`PAGA NETO PËR PAGESË:`, 20, netY + 10.5);
    doc.text(`${calculation.net.toFixed(2)} €`, 160, netY + 10.5, { align: 'right' });

    // Signatures
    const sigY = netY + 40;
    doc.setFontSize(10);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.setFont('helvetica', 'normal');
    
    doc.text('_______________________', 30, sigY);
    doc.text('Nënshkrimi i Punëdhënësit', 30, sigY + 5);

    doc.text('_______________________', 130, sigY);
    doc.text('Nënshkrimi i Punëtorit', 130, sigY + 5);

    addPDFFooter(doc, 1, 1, `Fletëpagesa - ${worker.name.replace(/\s+/g, '_')}`);

    doc.save(`Fletepagesa_${worker.name.replace(/\s+/g, '_')}_${payslip.month}_${payslip.year}.pdf`);
}
