import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  insertJobSchema, ROOMS, WORK_TYPES, JOB_CATEGORY_LABELS,
  CHECKLIST_ELEKTRIKE, CHECKLIST_KAMERA, CHECKLIST_ALARM, CHECKLIST_INTERFON, CHECKLIST_FINAL,
  type InsertJob, type CatalogItem, type JobCategory
} from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Save, FileDown, ArrowLeft, Loader2, Banknote, Camera, PhoneCall,
  Package, Info, Settings, ShieldAlert, Wrench, CheckCircle2, AlertTriangle, Zap, Phone,
  ChevronDown, ShoppingCart, FileText, Eye, EyeOff
} from "lucide-react";
import { Link } from "wouter";
import { useCatalog } from "@/hooks/use-catalog";
import { useAdmin } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formSchema = insertJobSchema;
type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  initialData?: any;
  onSubmit: (data: InsertJob) => void;
  isPending: boolean;
  title: string;
  defaultCategory?: JobCategory;
}

const CATEGORY_ICON_MAP: Record<string, typeof Zap> = {
  electric: Zap,
  camera: Camera,
  alarm: ShieldAlert,
  intercom: Phone,
};

function getTabsForCategory(category: JobCategory) {
  switch (category) {
    case "electric":
      return { showPajisje: true, showMateriale: true, showKamera: false, showInterfon: false, showAlarm: false, showSherbime: true };
    case "camera":
      return { showPajisje: false, showMateriale: true, showKamera: true, showInterfon: false, showAlarm: false, showSherbime: true };
    case "alarm":
      return { showPajisje: false, showMateriale: true, showKamera: false, showInterfon: false, showAlarm: true, showSherbime: true };
    case "intercom":
      return { showPajisje: false, showMateriale: true, showKamera: false, showInterfon: true, showAlarm: false, showSherbime: true };
    default:
      return { showPajisje: true, showMateriale: true, showKamera: true, showInterfon: true, showAlarm: true, showSherbime: true };
  }
}

function getChecklistsForCategory(category: JobCategory) {
  const sections: { title: string; items: string[] }[] = [];
  switch (category) {
    case "electric":
      sections.push({ title: "Checklist Elektrike", items: CHECKLIST_ELEKTRIKE });
      break;
    case "camera":
      sections.push({ title: "Checklist Kamera", items: CHECKLIST_KAMERA });
      break;
    case "alarm":
      sections.push({ title: "Checklist Alarm", items: CHECKLIST_ALARM });
      break;
    case "intercom":
      sections.push({ title: "Checklist Interfon", items: CHECKLIST_INTERFON });
      break;
  }
  sections.push({ title: "Kontroll Final", items: CHECKLIST_FINAL });
  return sections;
}

function getWorkTypesForCategory(category: JobCategory) {
  switch (category) {
    case "electric": return ["Instalim i ri", "Riparim", "Tjetër"];
    case "camera": return ["Kamera"];
    case "alarm": return ["Alarm"];
    case "intercom": return ["Interfon"];
    default: return [...WORK_TYPES];
  }
}

interface ItemQtyInfo {
  name: string;
  unit: string;
  qty: number;
  salePrice: number;
  purchasePrice: number;
}

function PriceRow({ item, form, showCost, isAdmin }: { item: CatalogItem; form: any; showCost: boolean; isAdmin: boolean }) {
  const prices = form.watch("prices") || {};
  const purchasePrices = form.watch("purchasePrices") || {};
  const saleVal = prices[item.name] ?? "";
  const purchaseVal = purchasePrices[item.name] ?? "";

  const updateSalePrice = (val: number | string) => {
    const cur = form.getValues("prices") || {};
    const numVal = typeof val === "string" ? (val === "" ? 0 : parseFloat(val)) : val;
    form.setValue("prices", { ...cur, [item.name]: isNaN(numVal) ? 0 : numVal }, { shouldDirty: true });
  };

  const updatePurchasePrice = (val: number | string) => {
    const cur = form.getValues("purchasePrices") || {};
    const numVal = typeof val === "string" ? (val === "" ? 0 : parseFloat(val)) : val;
    form.setValue("purchasePrices", { ...cur, [item.name]: isNaN(numVal) ? 0 : numVal }, { shouldDirty: true });
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-muted/20">
      <span className="col-span-4 text-xs font-bold truncate">{item.name}</span>
      <div className="col-span-3">
        <div className="flex items-center bg-background rounded border px-1">
          <Banknote className="w-3 h-3 text-primary mr-1 shrink-0" />
          <Input
            type="number"
            step="0.01"
            className="h-7 border-0 bg-transparent text-right text-xs p-0"
            placeholder="0.00"
            value={saleVal === 0 ? "" : saleVal}
            onChange={e => updateSalePrice(e.target.value)}
            data-testid={`price-sale-${item.name}`}
          />
        </div>
      </div>
      {showCost && isAdmin && (
        <div className="col-span-3">
          <div className="flex items-center bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800 px-1">
            <ShoppingCart className="w-3 h-3 text-amber-600 mr-1 shrink-0" />
            <Input
              type="number"
              step="0.01"
              className="h-7 border-0 bg-transparent text-right text-xs p-0"
              placeholder="0.00"
              value={purchaseVal === 0 ? "" : purchaseVal}
              onChange={e => updatePurchasePrice(e.target.value)}
              data-testid={`price-purchase-${item.name}`}
            />
          </div>
        </div>
      )}
      {!(showCost && isAdmin) && <div className="col-span-3"></div>}
      <div className="col-span-2"></div>
    </div>
  );
}

export function JobForm({ initialData, onSubmit, isPending, title, defaultCategory }: JobFormProps) {
  const { data: catalog } = useCatalog();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const [showCost, setShowCost] = useState(false);

  const resolvedCategory: JobCategory = (initialData?.category || defaultCategory || "electric") as JobCategory;

  const defaultValues: JobFormValues = initialData || {
    clientName: "", clientPhone: "", clientAddress: "",
    workDate: new Date().toISOString().split('T')[0],
    workType: getWorkTypesForCategory(resolvedCategory)[0],
    category: resolvedCategory,
    notes: "",
    table1Data: {}, table2Data: {}, cameraData: {},
    intercomData: {}, alarmData: {}, serviceData: {},
    prices: {}, purchasePrices: {}, checklistData: {},
  };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const category = (form.watch("category") || resolvedCategory) as JobCategory;
  const tabVis = getTabsForCategory(category);
  const CatIcon = CATEGORY_ICON_MAP[category] || Zap;

  const grouped = (catalog || []).reduce((acc: Record<string, CatalogItem[]>, item: CatalogItem) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  const pajisjeItems = grouped["Pajisje elektrike"] || [];
  const materialItems = grouped["Kabllo & Gypa"] || [];
  const cameraItems = grouped["Kamera"] || [];
  const intercomItems = grouped["Interfon"] || [];
  const alarmItems = grouped["Alarm"] || [];
  const serviceItems = grouped["Punë/Shërbime"] || [];

  useEffect(() => {
    if (!catalog || catalog.length === 0) return;
    const currentPrices = form.getValues("prices") || {};
    const currentPurchasePrices = form.getValues("purchasePrices") || {};
    let salePricesChanged = false;
    let purchasePricesChanged = false;
    const newSalePrices = { ...currentPrices };
    const newPurchasePrices = { ...currentPurchasePrices };

    catalog.forEach((item: CatalogItem) => {
      if (!(item.name in newSalePrices) && item.salePrice && item.salePrice > 0) {
        newSalePrices[item.name] = item.salePrice;
        salePricesChanged = true;
      }
      if (!(item.name in newPurchasePrices) && item.purchasePrice && item.purchasePrice > 0) {
        newPurchasePrices[item.name] = item.purchasePrice;
        purchasePricesChanged = true;
      }
    });

    if (salePricesChanged) form.setValue("prices", newSalePrices);
    if (purchasePricesChanged) form.setValue("purchasePrices", newPurchasePrices);
  }, [catalog]);

  const getVisibleItems = () => {
    const items: CatalogItem[] = [];
    if (tabVis.showPajisje) items.push(...pajisjeItems);
    if (tabVis.showMateriale) items.push(...materialItems);
    if (tabVis.showKamera) items.push(...cameraItems);
    if (tabVis.showInterfon) items.push(...intercomItems);
    if (tabVis.showAlarm) items.push(...alarmItems);
    if (tabVis.showSherbime) items.push(...serviceItems);
    return items;
  };

  const getQtyForRoomItem = (item: string) => {
    const rowData = form.watch(`table1Data.${item}`) || {};
    return Object.values(rowData).reduce((a: number, b: number) => a + (b || 0), 0);
  };

  const getSimpleQty = (field: string, item: string) => {
    return (form.watch as any)(`${field}.${item}`) || 0;
  };

  const getAllItemsWithQty = (): ItemQtyInfo[] => {
    const data = form.getValues();
    const result: ItemQtyInfo[] = [];

    if (tabVis.showPajisje) {
      pajisjeItems.forEach((c: CatalogItem) => {
        const rd = data.table1Data?.[c.name] || {};
        const qty = Object.values(rd).reduce((a: number, b: number) => a + (b || 0), 0);
        if (qty > 0) result.push({ name: c.name, unit: c.unit, qty, salePrice: data.prices?.[c.name] || 0, purchasePrice: data.purchasePrices?.[c.name] || 0 });
      });
    }

    const sections = [
      ...(tabVis.showMateriale ? [{ items: materialItems, data: data.table2Data }] : []),
      ...(tabVis.showKamera ? [{ items: cameraItems, data: data.cameraData }] : []),
      ...(tabVis.showInterfon ? [{ items: intercomItems, data: data.intercomData }] : []),
      ...(tabVis.showAlarm ? [{ items: alarmItems, data: data.alarmData }] : []),
      ...(tabVis.showSherbime ? [{ items: serviceItems, data: data.serviceData }] : []),
    ];
    sections.forEach(sec => {
      sec.items.forEach((c: CatalogItem) => {
        const qty = sec.data?.[c.name] || 0;
        if (qty > 0) result.push({ name: c.name, unit: c.unit, qty, salePrice: data.prices?.[c.name] || 0, purchasePrice: data.purchasePrices?.[c.name] || 0 });
      });
    });

    return result;
  };

  const calculateTotals = () => {
    const items = getAllItemsWithQty();
    const totalSale = items.reduce((sum, i) => sum + i.qty * i.salePrice, 0);
    const totalPurchase = items.reduce((sum, i) => sum + i.qty * i.purchasePrice, 0);
    return { totalSale, totalPurchase, profit: totalSale - totalPurchase };
  };

  const getChecklistWarnings = () => {
    const data = form.getValues();
    const warnings: string[] = [];
    const checkedCount = Object.values(data.checklistData || {}).filter(Boolean).length;
    if (checkedCount === 0) {
      warnings.push("Checklist nuk eshte plotesuar");
    }
    CHECKLIST_FINAL.forEach(item => {
      if (!data.checklistData?.[item]) {
        warnings.push(`Mungon: ${item}`);
      }
    });
    return warnings;
  };

  const addPDFHeader = (doc: jsPDF) => {
    const tc: [number, number, number] = [41, 128, 185];
    const pageW = doc.internal.pageSize.width;
    doc.setFontSize(22); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("ELEKTRONOVA", pageW / 2, 18, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
    doc.text("Sherbime Elektrike & Siguri | Tel: +383 49 771 673 / +383 49 205 271", pageW / 2, 24, { align: "center" });
    doc.setDrawColor(41, 128, 185); doc.setLineWidth(0.5);
    doc.line(14, 28, pageW - 14, 28);
  };

  const addPDFFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    doc.setDrawColor(200); doc.setLineWidth(0.3);
    doc.line(14, pageH - 15, pageW - 14, pageH - 15);
    doc.setFontSize(7); doc.setTextColor(140); doc.setFont("helvetica", "normal");
    doc.text("Punime elektrike - Procesverbal materiali", 14, pageH - 10);
    doc.text(`Faqja ${pageNum} / ${totalPages}`, pageW - 14, pageH - 10, { align: "right" });
  };

  const addSignatures = (doc: jsPDF) => {
    const signY = doc.internal.pageSize.height - 40;
    doc.setDrawColor(150); doc.setLineWidth(0.3);
    doc.line(20, signY, 85, signY); doc.line(125, signY, 190, signY);
    doc.setFontSize(9); doc.setTextColor(80); doc.setFont("helvetica", "normal");
    doc.text("Nenshkrimi i Klientit", 35, signY + 6);
    doc.text("Punekryeresi (Elektronova)", 130, signY + 6);
  };

  const generateClientPDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const { totalSale } = calculateTotals();
    const tc: [number, number, number] = [41, 128, 185];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;

    addPDFHeader(doc);

    doc.setFontSize(14); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("FATURE / OFERTE", pageW / 2, 38, { align: "center" });

    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(0);
    doc.text(`Klienti: ${data.clientName}`, 14, 48);
    doc.text(`Adresa: ${data.clientAddress}`, 14, 53);
    doc.text(`Tel: ${data.clientPhone || '-'}`, 14, 58);
    doc.text(`Data: ${data.workDate}`, pageW - 60, 48);
    doc.text(`Lloji: ${data.workType}`, pageW - 60, 53);
    doc.text(`Kategoria: ${JOB_CATEGORY_LABELS[category] || category}`, pageW - 60, 58);

    if (items.length > 0) {
      let nr = 1;
      const body = items.map(i => [
        (nr++).toString(),
        i.name,
        i.unit,
        i.qty.toString(),
        i.salePrice > 0 ? i.salePrice.toFixed(2) : "-",
        (i.qty * i.salePrice) > 0 ? (i.qty * i.salePrice).toFixed(2) : "-",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [["Nr.", "Pershkrimi", "Njesia", "Sasia", "Cmimi (EUR)", "Totali (EUR)"]],
        body,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 249, 252] },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 60 },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 28, halign: 'right' },
          5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
        },
      });
    }

    const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 80;
    doc.setFontSize(12); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text(`TOTALI: ${totalSale.toFixed(2)} EUR`, pageW - 14, finalY, { align: "right" });

    if (data.notes) {
      doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(80);
      doc.text(`Shenime: ${data.notes}`, 14, finalY + 10);
    }

    addSignatures(doc);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addPDFFooter(doc, i, totalPages);
    }

    doc.save(`Elektronova_Fature_${data.clientName.replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "PDF per Klient u gjenerua!" });
  };

  const generatePurchasePDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const { totalPurchase } = calculateTotals();
    const tc: [number, number, number] = [44, 62, 80];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;

    addPDFHeader(doc);

    doc.setFontSize(14); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("LISTA E BLERJES", pageW / 2, 38, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
    doc.text(`Per punen: ${data.clientName} - ${data.workDate}`, pageW / 2, 44, { align: "center" });

    if (items.length > 0) {
      let nr = 1;
      const body = items.map(i => [
        (nr++).toString(),
        i.name,
        i.unit,
        i.qty.toString(),
      ]);

      autoTable(doc, {
        startY: 52,
        head: [["Nr.", "Artikulli", "Njesia", "Sasia"]],
        body,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 90 },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 25, halign: 'center' },
        },
      });
    }

    const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 70;

    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(0);
    doc.text("Shenime per furnizim:", 14, finalY + 15);
    doc.setDrawColor(200); doc.setLineWidth(0.2);
    for (let i = 0; i < 5; i++) {
      doc.line(14, finalY + 22 + i * 8, pageW - 14, finalY + 22 + i * 8);
    }

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addPDFFooter(doc, i, totalPages);
    }

    doc.save(`Elektronova_Blerje_${data.clientName.replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "PDF per Blerje u gjenerua!" });
  };

  const renderRoomTable = () => (
    <Card className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-muted border-b">
            <th className="p-2 text-left sticky left-0 bg-muted z-10 w-32 border-r">Pajisja</th>
            {ROOMS.map(r => <th key={r} className="p-2 text-center min-w-[50px]">{r}</th>)}
            <th className="p-2 text-center font-bold bg-primary/5">Sasia</th>
            <th className="p-2 text-center font-bold bg-primary/10">Vlera</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {pajisjeItems.map((c: CatalogItem) => {
            const qty = getQtyForRoomItem(c.name);
            const price = form.watch(`prices.${c.name}`) || 0;
            return (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="p-2 font-medium sticky left-0 bg-background z-10 border-r text-xs">{c.name}</td>
                {ROOMS.map(r => (
                  <td key={r} className="p-0.5">
                    <FormField control={form.control} name={`table1Data.${c.name}.${r}`} render={({ field }) => (
                      <input type="number" className="w-full h-8 text-center bg-transparent outline-none border-b border-transparent focus:border-primary text-xs" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || ""} data-testid={`input-${c.name}-${r}`} />
                    )} />
                  </td>
                ))}
                <td className="p-2 text-center font-bold">{qty || "-"}</td>
                <td className="p-2 text-center text-primary font-bold">{(qty * price) > 0 ? (qty * price).toFixed(2) : "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );

  const renderSimpleSection = (items: CatalogItem[], fieldName: string) => (
    <Card>
      <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(c => {
          const qty = getSimpleQty(fieldName, c.name);
          const price = form.watch(`prices.${c.name}`) || 0;
          return (
            <div key={c.id} className="p-2 border rounded-lg flex items-center justify-between gap-2 hover:border-primary/50 transition-colors">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.unit}</span>
                {(qty * price) > 0 && <span className="text-[10px] text-primary font-black">{(qty * price).toFixed(2)} €</span>}
              </div>
              <FormField control={form.control} name={`${fieldName}.${c.name}` as any} render={({ field }) => (
                <div className="flex items-center bg-muted/50 rounded overflow-hidden w-20 shrink-0 border">
                  <Input type="number" className="h-7 border-0 bg-transparent text-right px-1 text-xs" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={(field.value as any) || ""} data-testid={`input-${c.name}`} />
                  <span className="text-[9px] px-1 bg-muted uppercase font-bold border-l whitespace-nowrap">{c.unit}</span>
                </div>
              )} />
            </div>
          );
        })}
        {items.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-4">Nuk ka artikuj ne kete kategori. Shto ne Katalogun e Admin.</p>}
      </CardContent>
    </Card>
  );

  const renderChecklist = () => {
    const sections = getChecklistsForCategory(category);
    return (
      <div className="space-y-4">
        {sections.map(sec => (
          <Card key={sec.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {sec.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sec.items.map(item => (
                <FormField key={item} control={form.control} name={`checklistData.${item}`} render={({ field }) => (
                  <label className="flex items-center gap-3 p-2 rounded hover:bg-muted/30 cursor-pointer" data-testid={`checklist-${item}`}>
                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                    <span className={`text-sm ${field.value ? "line-through text-muted-foreground" : ""}`}>{item}</span>
                  </label>
                )} />
              ))}
            </CardContent>
          </Card>
        ))}

        {getChecklistWarnings().length > 0 && (
          <Card className="border-amber-500/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-600">
                <AlertTriangle className="w-4 h-4" /> Paralajmerime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {getChecklistWarnings().map((w, i) => (
                  <p key={i} className="text-xs text-amber-600 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                    {w}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const getVisibleCategorySections = (): { label: string; items: CatalogItem[] }[] => {
    const sections: { label: string; items: CatalogItem[] }[] = [];
    if (tabVis.showPajisje && pajisjeItems.length > 0) sections.push({ label: "Pajisje Elektrike", items: pajisjeItems });
    if (tabVis.showMateriale && materialItems.length > 0) sections.push({ label: "Kabllo & Gypa", items: materialItems });
    if (tabVis.showKamera && cameraItems.length > 0) sections.push({ label: "Kamera", items: cameraItems });
    if (tabVis.showInterfon && intercomItems.length > 0) sections.push({ label: "Interfon", items: intercomItems });
    if (tabVis.showAlarm && alarmItems.length > 0) sections.push({ label: "Alarm", items: alarmItems });
    if (tabVis.showSherbime && serviceItems.length > 0) sections.push({ label: "Pune / Sherbime", items: serviceItems });
    return sections;
  };

  const renderPricing = () => {
    const categorySections = getVisibleCategorySections();
    const totals = calculateTotals();
    return (
      <div className="space-y-4">
        {isAdmin && (
          <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <span className="text-sm font-bold text-amber-700">Pamja e Kostos (Admin)</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCost(!showCost)}
              data-testid="button-toggle-cost"
            >
              {showCost ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showCost ? "Fshih Koston" : "Shfaq Koston"}
            </Button>
          </div>
        )}

        {categorySections.map(section => (
          <Card key={section.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                {section.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden sm:grid grid-cols-12 gap-2 p-2 text-xs font-bold text-muted-foreground border-b mb-2">
                <span className="col-span-4">Artikulli</span>
                <span className="col-span-3">Cmimi Shitjes (EUR)</span>
                {showCost && isAdmin ? <span className="col-span-3">Cmimi Blerjes (EUR)</span> : <span className="col-span-3"></span>}
                <span className="col-span-2"></span>
              </div>
              <div className="space-y-1">
                {section.items.map((c: CatalogItem) => (
                  <PriceRow key={c.id} item={c} form={form} showCost={showCost} isAdmin={isAdmin} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {categorySections.length === 0 && (
          <Card><CardContent className="pt-6"><p className="text-muted-foreground text-center text-sm py-4">Ngarko katalogun...</p></CardContent></Card>
        )}

        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-bold">Totali Shitjes:</span>
                <span className="text-lg font-black text-primary" data-testid="text-total-sale">{totals.totalSale.toFixed(2)} EUR</span>
              </div>
              {showCost && isAdmin && (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-bold text-amber-600">Totali Kostos:</span>
                    <span className="text-lg font-black text-amber-600" data-testid="text-total-purchase">{totals.totalPurchase.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-bold text-green-600">Fitimi:</span>
                    <span className="text-lg font-black text-green-600" data-testid="text-profit">{totals.profit.toFixed(2)} EUR</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const availableWorkTypes = getWorkTypesForCategory(category);
  const totals = calculateTotals();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm sticky top-16 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/"><Button variant="ghost" size="icon" data-testid="button-back"><ArrowLeft /></Button></Link>
          <div className="flex items-center gap-2 min-w-0">
            <CatIcon className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-xl font-bold truncate" data-testid="text-form-title">{title}</h1>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0" data-testid="badge-form-category">{JOB_CATEGORY_LABELS[category]}</Badge>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vlera Totale</p>
            <p className="text-xl font-black text-primary" data-testid="text-grand-total">{totals.totalSale.toFixed(2)} €</p>
            {isAdmin && showCost && (
              <p className="text-xs font-bold text-green-600" data-testid="text-header-profit">Fitimi: {totals.profit.toFixed(2)} €</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" data-testid="button-pdf-dropdown">
                <FileDown className="mr-2" /> PDF <ChevronDown className="ml-1 w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={generateClientPDF} data-testid="button-pdf-client">
                <FileText className="mr-2 w-4 h-4" /> PDF per Klient (Fature/Oferte)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generatePurchasePDF} data-testid="button-pdf-purchase">
                <ShoppingCart className="mr-2 w-4 h-4" /> PDF per Blerje (Lista ime)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" onClick={() => {
            const cleanNumericRecord = (rec: Record<string, any> | undefined) => {
              if (!rec) return {};
              const cleaned: Record<string, number> = {};
              for (const [k, v] of Object.entries(rec)) {
                const num = Number(v);
                if (!isNaN(num)) cleaned[k] = num;
              }
              return cleaned;
            };
            const cleanTable1 = (rec: Record<string, any> | undefined) => {
              if (!rec) return {};
              const cleaned: Record<string, Record<string, number>> = {};
              for (const [item, rooms] of Object.entries(rec)) {
                if (rooms && typeof rooms === 'object') {
                  cleaned[item] = cleanNumericRecord(rooms);
                }
              }
              return cleaned;
            };
            const vals = form.getValues();
            vals.table1Data = cleanTable1(vals.table1Data);
            vals.table2Data = cleanNumericRecord(vals.table2Data);
            vals.cameraData = cleanNumericRecord(vals.cameraData);
            vals.intercomData = cleanNumericRecord(vals.intercomData);
            vals.alarmData = cleanNumericRecord(vals.alarmData);
            vals.serviceData = cleanNumericRecord(vals.serviceData);
            vals.prices = cleanNumericRecord(vals.prices);
            vals.purchasePrices = cleanNumericRecord(vals.purchasePrices);
            for (const key of Object.keys(vals.table1Data || {})) {
              if (Object.keys(vals.table1Data![key]).length === 0) delete vals.table1Data![key];
            }
            for (const field of ['table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'] as const) {
              for (const [k, v] of Object.entries(vals[field] || {})) {
                if (v === 0 || isNaN(v as number)) delete (vals[field] as any)[k];
              }
            }
            form.reset(vals);
            form.handleSubmit(onSubmit, (errors) => {
              const errorFields = Object.keys(errors);
              toast({ title: "Ploteso fushat e detyrueshme", description: `Kthehu te tab-i "Klienti" dhe ploteso: ${errorFields.join(', ')}`, variant: "destructive" });
            })();
          }} disabled={isPending} data-testid="button-save">
            {isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Ruaj
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="flex w-max min-w-full bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="info" className="gap-2" data-testid="tab-info"><Info className="w-4 h-4" /> Klienti</TabsTrigger>
                {tabVis.showPajisje && <TabsTrigger value="pajisje" className="gap-2" data-testid="tab-pajisje"><Package className="w-4 h-4" /> Pajisje</TabsTrigger>}
                {tabVis.showMateriale && <TabsTrigger value="materiale" className="gap-2" data-testid="tab-materiale"><Settings className="w-4 h-4" /> Materiale</TabsTrigger>}
                {tabVis.showKamera && <TabsTrigger value="kamera" className="gap-2" data-testid="tab-kamera"><Camera className="w-4 h-4" /> Kamera</TabsTrigger>}
                {tabVis.showInterfon && <TabsTrigger value="interfon" className="gap-2" data-testid="tab-interfon"><PhoneCall className="w-4 h-4" /> Interfon</TabsTrigger>}
                {tabVis.showAlarm && <TabsTrigger value="alarm" className="gap-2" data-testid="tab-alarm"><ShieldAlert className="w-4 h-4" /> Alarm</TabsTrigger>}
                {tabVis.showSherbime && <TabsTrigger value="sherbime" className="gap-2" data-testid="tab-sherbime"><Wrench className="w-4 h-4" /> Sherbime</TabsTrigger>}
                <TabsTrigger value="checklist" className="gap-2" data-testid="tab-checklist"><CheckCircle2 className="w-4 h-4" /> Checklist</TabsTrigger>
                <TabsTrigger value="cmimet" className="gap-2" data-testid="tab-cmimet"><Banknote className="w-4 h-4" /> Cmimet</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="info">
              <Card>
                <CardContent className="pt-6 grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="clientName" render={({ field }) => (
                      <FormItem><FormLabel>Emri i Klientit</FormLabel><FormControl><Input {...field} data-testid="input-client-name" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="clientPhone" render={({ field }) => (
                      <FormItem><FormLabel>Telefoni</FormLabel><FormControl><Input {...field} value={field.value || ""} data-testid="input-client-phone" /></FormControl></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="clientAddress" render={({ field }) => (
                    <FormItem><FormLabel>Adresa</FormLabel><FormControl><Input {...field} data-testid="input-client-address" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="workDate" render={({ field }) => (
                      <FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} data-testid="input-work-date" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="workType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lloji i Punes</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger data-testid="select-work-type"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableWorkTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Shenime</FormLabel><FormControl><Textarea {...field} value={field.value || ""} data-testid="input-notes" /></FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            {tabVis.showPajisje && <TabsContent value="pajisje">{renderRoomTable()}</TabsContent>}
            {tabVis.showMateriale && <TabsContent value="materiale">{renderSimpleSection(materialItems, "table2Data")}</TabsContent>}
            {tabVis.showKamera && <TabsContent value="kamera">{renderSimpleSection(cameraItems, "cameraData")}</TabsContent>}
            {tabVis.showInterfon && <TabsContent value="interfon">{renderSimpleSection(intercomItems, "intercomData")}</TabsContent>}
            {tabVis.showAlarm && <TabsContent value="alarm">{renderSimpleSection(alarmItems, "alarmData")}</TabsContent>}
            {tabVis.showSherbime && <TabsContent value="sherbime">{renderSimpleSection(serviceItems, "serviceData")}</TabsContent>}
            <TabsContent value="checklist">{renderChecklist()}</TabsContent>
            <TabsContent value="cmimet">{renderPricing()}</TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
