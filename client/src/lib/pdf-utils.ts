import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TC: [number, number, number] = [41, 128, 185];

export function addPDFHeader(doc: jsPDF, subtitle?: string) {
  const pageW = doc.internal.pageSize.width;
  doc.setFontSize(22); doc.setTextColor(TC[0], TC[1], TC[2]); doc.setFont("helvetica", "bold");
  doc.text("ELEKTRONOVA", pageW / 2, 18, { align: "center" });
  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
  doc.text("Sherbime Elektrike & Siguri | Tel: +383 49 771 673 / +383 49 205 271", pageW / 2, 24, { align: "center" });
  doc.setDrawColor(TC[0], TC[1], TC[2]); doc.setLineWidth(0.5);
  doc.line(14, 28, pageW - 14, 28);
  if (subtitle) {
    doc.setFontSize(14); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text(subtitle, pageW / 2, 38, { align: "center" });
  }
}

export function addPDFFooter(doc: jsPDF, pageNum: number, totalPages: number, docLabel?: string) {
  const pageW = doc.internal.pageSize.width;
  const pageH = doc.internal.pageSize.height;
  doc.setDrawColor(200); doc.setLineWidth(0.3);
  doc.line(14, pageH - 15, pageW - 14, pageH - 15);
  doc.setFontSize(7); doc.setTextColor(140); doc.setFont("helvetica", "normal");
  doc.text(docLabel || "ELEKTRONOVA - Dokument", 14, pageH - 10);
  doc.text(`Faqja ${pageNum} / ${totalPages}`, pageW - 14, pageH - 10, { align: "right" });
}

export function addAllFooters(doc: jsPDF, docLabel?: string) {
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPDFFooter(doc, i, totalPages, docLabel);
  }
}

export function addPDFSubtitle(doc: jsPDF, text: string, y: number) {
  doc.setFontSize(8); doc.setTextColor(100); doc.setFont("helvetica", "normal");
  doc.text(text, doc.internal.pageSize.width / 2, y, { align: "center" });
}

export function addPDFTable(
  doc: jsPDF,
  startY: number,
  head: string[][],
  body: string[][],
  columnStyles?: Record<number, any>,
) {
  autoTable(doc, {
    startY,
    head,
    body,
    theme: "striped",
    headStyles: { fillColor: TC, fontSize: 8, fontStyle: "bold" },
    styles: { fontSize: 7.5, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: [245, 249, 252] },
    columnStyles,
  });
  return (doc as any).lastAutoTable?.finalY || startY + 20;
}

export function addPDFSummaryBox(doc: jsPDF, y: number, lines: string[]) {
  const m = 14;
  const cW = doc.internal.pageSize.width - 2 * m;
  const boxH = 6 + lines.length * 5;
  doc.setFillColor(245, 248, 252);
  doc.roundedRect(m, y, cW, boxH, 2, 2, "F");
  doc.setDrawColor(TC[0], TC[1], TC[2]); doc.setLineWidth(0.2);
  doc.roundedRect(m, y, cW, boxH, 2, 2, "S");
  doc.setFontSize(8); doc.setTextColor(0); doc.setFont("helvetica", "normal");
  lines.forEach((line, idx) => {
    doc.text(line, m + 4, y + 5 + idx * 5);
  });
  return y + boxH + 5;
}

export function createElektronovaPDF(title: string, dateStr?: string): { doc: jsPDF; startY: number } {
  const doc = new jsPDF();
  addPDFHeader(doc, title);
  const today = dateStr || new Date().toISOString().split("T")[0];
  addPDFSubtitle(doc, `Gjeneruar me: ${today}`, 44);
  return { doc, startY: 50 };
}

export { TC, autoTable };
