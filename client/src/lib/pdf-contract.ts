import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Worker } from "@shared/schema";
import { addPDFHeader, addAllFooters, TC } from "./pdf-utils";

export function generateContractPDF(worker: Worker, action: 'save' | 'preview' = 'save') {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const margin = 14;

    // Header & Title
    addPDFHeader(doc, "KONTRATË PUNE");

    let y = 46;

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.setFont("helvetica", "normal");

    doc.setFontSize(10);
    doc.text(`E lidhur sot, me datë ${new Date().toLocaleDateString('en-GB')}, ndërmjet palëve të poshtëshënuara:`, margin, y);
    y += 6;

    // Premium Parties Table
    autoTable(doc, {
        startY: y,
        theme: 'plain',
        margin: { left: margin, right: margin },
        styles: { cellPadding: 6, fontSize: 9.5, cellWidth: 'wrap' },
        columnStyles: {
            0: { cellWidth: (pageW - margin * 2) / 2 - 2 },
            1: { cellWidth: (pageW - margin * 2) / 2 - 2 }
        },
        body: [
            [
                {
                    content: '1. PUNËDHËNËSI\n',
                    styles: { fillColor: [247, 249, 252], textColor: [41, 128, 185], fontStyle: 'bold', fontSize: 10.5, cellPadding: { top: 8, left: 8, right: 8, bottom: 1 }, lineColor: [220, 225, 235], lineWidth: { top: 0.5, left: 0.5, right: 0.5, bottom: 0 } }
                },
                {
                    content: '2. PUNËMARRËSI\n',
                    styles: { fillColor: [247, 249, 252], textColor: [41, 128, 185], fontStyle: 'bold', fontSize: 10.5, cellPadding: { top: 8, left: 8, right: 8, bottom: 1 }, lineColor: [220, 225, 235], lineWidth: { top: 0.5, left: 0.5, right: 0.5, bottom: 0 } }
                }
            ],
            [
                {
                    content: 'Kompania:   ELEKTRONOVA\nPërfaqësuesi:   Drejtori Ekzekutiv\nAdresa:   Pejë, Kosovë\nKontakt:   +383 49 771 673',
                    styles: { fillColor: [247, 249, 252], textColor: [60, 70, 85], fontStyle: 'normal', cellPadding: { top: 1, left: 8, right: 8, bottom: 8 }, lineColor: [220, 225, 235], lineWidth: { top: 0, left: 0.5, right: 0.5, bottom: 0.5 } }
                },
                {
                    content: `Emri dhe Mbiemri:   ${worker.name}\nNumri Personal:   ${worker.personalNumber}\nAdresa:   ${worker.address}, ${worker.city}\nProfesioni:   ${worker.profession}`,
                    styles: { fillColor: [247, 249, 252], textColor: [60, 70, 85], fontStyle: 'normal', cellPadding: { top: 1, left: 8, right: 8, bottom: 8 }, lineColor: [220, 225, 235], lineWidth: { top: 0, left: 0.5, right: 0.5, bottom: 0.5 } }
                }
            ]
        ]
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.setFont("helvetica", "italic");
    doc.text("Të cilët pajtohen me vullnet të lirë për kushtet e mëposhtme të punësimit:", margin, y);
    y += 8;

    // Helper for text wrapping & auto paging
    const writeText = (text: string, fontSize: number = 9.5, isBold: boolean = false, textColor: number | [number, number, number] = 50) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");

        if (Array.isArray(textColor)) {
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        } else {
            doc.setTextColor(textColor);
        }

        const textLines = doc.splitTextToSize(text, pageW - margin * 2 - 4);
        const textHeight = textLines.length * (fontSize * 0.45);

        if (y + textHeight > pageH - 25) {
            doc.addPage();
            y = 20;
        }

        doc.text(textLines, margin + 2, y);
        y += textHeight + 4;
    };

    const writeSection = (num: number, title: string, content: string[]) => {
        // Check page break for section header
        if (y > pageH - 45) {
            doc.addPage();
            y = 20;
        } else {
            y += 4;
        }

        // Modern section header
        doc.setFillColor(TC[0], TC[1], TC[2]);
        doc.roundedRect(margin, y, pageW - margin * 2, 8, 1.5, 1.5, "F");

        doc.setFontSize(9.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text(`   Neni ${num} - ${title}`, margin, y + 5.5);

        y += 14;

        content.forEach(p => {
            writeText(p, 9.5, false, 40);
        });
    };

    writeSection(1, "POZITA, DETYRAT DHE VENDI I PUNËS", [
        `1.1  Punëmarrësi punësohet në pozitën: ${worker.position}, brenda departamentit të ${worker.department}.`,
        `1.2  Vendi i rregullt i punës do të jetë në ${worker.workplace}. Punëdhënësi mban të drejtën të ndryshojë vendin e punës në rast të nevojave operative apo projekteve në terren, duke mbuluar shpenzimet përkatëse.`,
        `1.3  Punëmarrësi obligohet të kryejë me profesionalizëm të gjitha detyrat e parapara për këtë pozitë si dhe detyrat tjera të deleguara nga mbikëqyrësi i drejtpërdrejtë.`
    ]);

    writeSection(2, "KOHËZGJATJA DHE PERIUDHA PROVUESE", [
        `2.1  Punëmarrësi do të fillojë marrëdhënien e punës me datë ${worker.startDate}.`,
        `2.2  Kjo kontratë është lidhur për një periudhë me kohë të ${worker.contractType.toLowerCase()}${worker.contractType === 'Caktuar' && worker.contractDuration ? ` (${worker.contractDuration})` : ''}.`,
        `2.3  Punëmarrësi i nënshtrohet një periudhe provuese prej ${worker.probationPeriod}. Gjatë kësaj periudhe, të dyja palët mund ta ndërpresin kontratën lirisht, me një lajmërim paraprak prej 7 ditësh kalendarike.`
    ]);

    writeSection(3, "ORARI I PUNËS", [
        `3.1  Orët e parapara të punës do të jenë ${worker.workingHours} orë në javë.`,
        `3.2  Orari i rregullt i punës është: ${worker.workSchedule}.`,
        `3.3  Në rast të nevojave të ngutshme të projekteve, Punëmarrësit mund t'i kërkohet të punojë jashtë orarit sipas kushteve dhe kompensimeve të rregulluara me Ligjin e Punës në Kosovë.`
    ]);

    writeSection(4, "PAGA DHE KOMPENSIMI", [
        `4.1  Paga bazë bruto e Punëmarrësit do të jetë ${worker.salary} € (Euro) në muaj.`,
        `4.2  Punëdhënësi do të mbajë në burim të gjitha tatimet dhe kontributet pensionale të detyrueshme sipas legjislacionit në fuqi në Republikën e Kosovës.`,
        `4.3  ${worker.paymentMethod === 'cash' 
            ? 'Me pëlqimin e Punëmarrësit dhe duke u bazuar në dispozitat ligjore në Kosovë, pagesa e pagës do të ekzekutohet me para në dorë (Cash).' 
            : `Pagesa do të ekzekutohet si Transfer bankar në: ${worker.bankName}, llogaria numër: ${worker.bankAccount}.`}`
    ]);

    writeSection(5, "PUSHIMI VJETOR DHE MJEKËSOR", [
        `5.1  Punëmarrësi ka të drejtë në pushim vjetor të paguar prej 20 ditësh pune gjatë një viti kalendarik sipas procedurës së miratimit.`,
        `5.2  Pushimi mjekësor kompensohet sipas dispozitave të Ligjit të Punës. Punëmarrësi obligohet të njoftojë Menaxhmentin menjëherë dhe të sjellë raportin mjekësor brenda 48 orëve.`
    ]);

    writeSection(6, "KONFIDENCIALITETI DHE DETYRIMET TJERA", [
        `6.1  Punëmarrësi obligohet të ruajë si sekret profesional çdo informacion, të dhënë apo dokument strategjik të kompanisë ELEKTRONOVA gjatë dhe pas përfundimit të kontratës.`,
        `6.2  Keqpërdorimi i aseteve të kompanisë, shkelja e rregullores së brendshme disiplinore apo mosrespektimi i masave të sigurisë në punë përbëjnë shkelje të rëndë dhe shkak për ndërprerje të menjëhershme të kontratës.`
    ]);

    writeSection(7, "NDËRPRERJA GJEGJËSITË DHE ZGJIDHJA E KONTESTEVE", [
        `7.1  Pas periudhës provuese, kontrata mund të ndërpritet duke iu përmbajtur afateve të paralajmërimit sipas Ligjit të Punës (min. 30 ditë).`,
        `7.2  Për çdo çështje që nuk është e paraparë specifikisht në këtë kontratë, do të zbatohen dispozitat e Ligjit të Punës në Kosovë.`,
        `7.3  Në rast të një kontesti, palët fillimisht do të përpiqen ta zgjidhin me mirëkuptim. Nëse kjo nuk është e mundur, pala e pakënaqur mund t'i drejtohet Gjykatës Themelore kompetente në Pejë.`
    ]);

    y += 12;

    // Premium Corporate Divider
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1);
    doc.line(margin, y, margin + 20, y);
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.3);
    doc.line(margin + 20, y, pageW - margin, y);

    // Signatures Area
    if (y + 50 > pageH - 25) {
        doc.addPage();
        y = 30;
    }

    // Draw signature box with extremely premium styling
    doc.setDrawColor(41, 128, 185); // Accent outline
    doc.setLineWidth(0.4);
    doc.setFillColor(252, 254, 255);
    doc.roundedRect(margin, y, pageW - margin * 2, 45, 2, 2, "FD");

    // Add subtle top accent line inside the box
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(1.5);
    doc.line(margin + 2, y + 2, pageW - margin - 2, y + 2);

    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40);

    doc.text("PËR PUNËDHËNËSIN", margin + 15, y);
    doc.text("PUNËMARRËSI", pageW - margin - 65, y);

    y += 18;

    // Add Digital Signatures if they exist
    if (worker.employerSignature) {
        try {
            // Enlarged slightly and positioned better
            doc.addImage(worker.employerSignature, 'PNG', margin + 10, y - 18, 55, 18);
        } catch (e) {
            console.error("Error adding employer signature to PDF", e);
        }
    }

    if (worker.workerSignature) {
        try {
            // Enlarged slightly and positioned better
            doc.addImage(worker.workerSignature, 'PNG', pageW - margin - 70, y - 18, 55, 18);
        } catch (e) {
            console.error("Error adding worker signature to PDF", e);
        }
    }

    // Signature lines
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(margin + 10, y, margin + 70, y);
    doc.line(pageW - margin - 75, y, pageW - margin - 15, y);

    y += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);

    doc.text("ELEKTRONOVA", margin + 15, y);

    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text(worker.name, pageW - margin - 65, y);

    y += 5;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Data: ${new Date().toLocaleDateString('en-GB')}`, margin + 15, y);
    doc.text(`Data: ${new Date().toLocaleDateString('en-GB')}`, pageW - margin - 65, y);

    // Footers
    addAllFooters(doc, "Kontratë Pune");

    if (action === 'preview') {
        const blobUrl = doc.output('bloburl');
        window.open(blobUrl, '_blank');
    } else {
        doc.save(`Kontrata_Pune_${worker.name.replace(/\s+/g, '_')}.pdf`);
    }
}
