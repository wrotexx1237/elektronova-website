import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  insertJobSchema, ROOMS, WORK_TYPES,
  CHECKLIST_ELEKTRIKE, CHECKLIST_KAMERA, CHECKLIST_ALARM, CHECKLIST_INTERFON, CHECKLIST_FINAL,
  type InsertJob, type CatalogItem
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
  Save, FileDown, ArrowLeft, Loader2, Banknote, Camera, PhoneCall,
  Package, Info, Settings, ShieldAlert, Wrench, CheckCircle2, AlertTriangle
} from "lucide-react";
import { Link } from "wouter";
import { useCatalog } from "@/hooks/use-catalog";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formSchema = insertJobSchema;
type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  initialData?: any;
  onSubmit: (data: InsertJob) => void;
  isPending: boolean;
  title: string;
}

export function JobForm({ initialData, onSubmit, isPending, title }: JobFormProps) {
  const { data: catalog } = useCatalog();
  const { toast } = useToast();

  const defaultValues: JobFormValues = initialData || {
    clientName: "", clientPhone: "", clientAddress: "",
    workDate: new Date().toISOString().split('T')[0],
    workType: "Instalim i ri", notes: "",
    table1Data: {}, table2Data: {}, cameraData: {},
    intercomData: {}, alarmData: {}, serviceData: {},
    prices: {}, checklistData: {},
  };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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
  const allItemNames = (catalog || []).map((c: CatalogItem) => c.name);

  const getQtyForRoomItem = (item: string) => {
    const rowData = form.watch(`table1Data.${item}`) || {};
    return Object.values(rowData).reduce((a: number, b: number) => a + (b || 0), 0);
  };

  const getSimpleQty = (field: string, item: string) => {
    return (form.watch as any)(`${field}.${item}`) || 0;
  };

  const calculateGrandTotal = () => {
    const data = form.getValues();
    let total = 0;
    pajisjeItems.forEach(c => {
      const rd = data.table1Data?.[c.name] || {};
      const qty = Object.values(rd).reduce((a: number, b: number) => a + (b || 0), 0);
      total += qty * (data.prices?.[c.name] || 0);
    });
    const sections = [
      { items: materialItems, data: data.table2Data },
      { items: cameraItems, data: data.cameraData },
      { items: intercomItems, data: data.intercomData },
      { items: alarmItems, data: data.alarmData },
      { items: serviceItems, data: data.serviceData },
    ];
    sections.forEach(sec => {
      sec.items.forEach(c => {
        const qty = sec.data?.[c.name] || 0;
        total += qty * (data.prices?.[c.name] || 0);
      });
    });
    return total;
  };

  const getChecklistWarnings = () => {
    const data = form.getValues();
    const warnings: string[] = [];
    const workType = data.workType;

    const checkedCount = Object.values(data.checklistData || {}).filter(Boolean).length;
    if (checkedCount === 0) {
      warnings.push("Checklist nuk eshte plotesuar");
    }

    if (workType === "Kamera") {
      const hasCameraItems = cameraItems.some(c => (data.cameraData?.[c.name] || 0) > 0);
      if (!hasCameraItems) warnings.push("Nuk ka artikuj te kamerave te regjistruar");
    }
    if (workType === "Alarm") {
      const hasAlarmItems = alarmItems.some(c => (data.alarmData?.[c.name] || 0) > 0);
      if (!hasAlarmItems) warnings.push("Nuk ka artikuj te alarmit te regjistruar");
    }
    if (workType === "Interfon") {
      const hasIntercomItems = intercomItems.some(c => (data.intercomData?.[c.name] || 0) > 0);
      if (!hasIntercomItems) warnings.push("Nuk ka artikuj te interfonit te regjistruar");
    }

    CHECKLIST_FINAL.forEach(item => {
      if (!data.checklistData?.[item]) {
        warnings.push(`Mungon: ${item}`);
      }
    });

    return warnings;
  };

  const generatePDF = () => {
    const data = form.getValues();
    const doc = new jsPDF();
    const tc: [number, number, number] = [41, 128, 185];
    const pageW = doc.internal.pageSize.width;

    doc.setFontSize(22); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("ELEKTRONOVA", pageW / 2, 20, { align: "center" });
    doc.setFontSize(12); doc.setFont("helvetica", "normal");
    doc.text("Procesverbal i Punimeve", pageW / 2, 28, { align: "center" });
    doc.setDrawColor(200); doc.line(14, 35, pageW - 14, 35);

    doc.setFontSize(10); doc.setTextColor(0);
    doc.text(`Klienti: ${data.clientName}`, 14, 45);
    doc.text(`Adresa: ${data.clientAddress}`, 14, 50);
    doc.text(`Tel: ${data.clientPhone || '-'}`, 14, 55);
    doc.text(`Data: ${data.workDate}`, 120, 45);
    doc.text(`Lloji: ${data.workType}`, 120, 50);

    const t1Headers = ["Pajisja", ...ROOMS, "Total", "Cmimi", "Vlera"];
    const t1Body = pajisjeItems.map(c => {
      const rd = data.table1Data?.[c.name] || {};
      const qty = Object.values(rd).reduce((a: number, b: number) => a + (b || 0), 0);
      const price = data.prices?.[c.name] || 0;
      return [c.name, ...ROOMS.map(r => rd[r] || ""), qty > 0 ? qty.toString() : "", price > 0 ? price.toFixed(2) : "", (qty * price) > 0 ? (qty * price).toFixed(2) : ""];
    }).filter(row => row.some((v, i) => i > 0 && v !== ""));

    if (t1Body.length > 0) {
      autoTable(doc, { startY: 65, head: [t1Headers], body: t1Body, theme: 'grid', headStyles: { fillColor: tc, fontSize: 5 }, styles: { fontSize: 5 }, columnStyles: { 0: { fontStyle: 'bold', cellWidth: 20 } } });
    }

    const secs = [
      { name: "Kabllo & Materiale", items: materialItems, data: data.table2Data },
      { name: "Kamera", items: cameraItems, data: data.cameraData },
      { name: "Interfoni", items: intercomItems, data: data.intercomData },
      { name: "Alarmi", items: alarmItems, data: data.alarmData },
      { name: "Pune/Sherbime", items: serviceItems, data: data.serviceData },
    ];

    let hasSecondPage = false;
    secs.forEach(sec => {
      const body = sec.items.map(c => {
        const qty = sec.data?.[c.name] || 0;
        const price = data.prices?.[c.name] || 0;
        return [c.name, qty > 0 ? `${qty} ${c.unit}` : "", price > 0 ? price.toFixed(2) : "", (qty * price) > 0 ? (qty * price).toFixed(2) : ""];
      }).filter(r => r[1] !== "");

      if (body.length > 0) {
        if (!hasSecondPage) { doc.addPage(); hasSecondPage = true; }
        const curY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 20;
        doc.setFontSize(11); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
        doc.text(sec.name, 14, curY);
        autoTable(doc, { startY: curY + 3, head: [["Artikulli", "Sasia", "Cmimi", "Vlera"]], body, theme: 'striped', headStyles: { fillColor: tc }, styles: { fontSize: 9 } });
      }
    });

    const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 15 : doc.internal.pageSize.height - 60;
    doc.setFontSize(13); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text(`Totali: ${calculateGrandTotal().toFixed(2)} EUR`, 14, finalY);

    const checkedItems = Object.entries(data.checklistData || {}).filter(([, v]) => v).map(([k]) => k);
    if (checkedItems.length > 0) {
      const clY = finalY + 10;
      doc.setFontSize(10); doc.setFont("helvetica", "bold");
      doc.text("Checklist:", 14, clY);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      checkedItems.forEach((item, i) => {
        doc.text(`[x] ${item}`, 16, clY + 5 + i * 4);
      });
    }

    const signY = doc.internal.pageSize.height - 30;
    doc.setDrawColor(150);
    doc.line(20, signY, 80, signY); doc.line(130, signY, 190, signY);
    doc.setFontSize(9); doc.setTextColor(80);
    doc.text("Klienti", 45, signY + 5); doc.text("Elektronova", 155, signY + 5);

    if (data.notes) {
      doc.setFontSize(8); doc.text(`Shenime: ${data.notes}`, 14, signY + 15);
    }

    doc.save(`Elektronova_${data.clientName.replace(/\s/g, '_')}_${data.workDate}.pdf`);
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
          {pajisjeItems.map(c => {
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
    const workType = form.watch("workType");
    const sections: { title: string; items: string[] }[] = [];

    if (["Instalim i ri", "Riparim", "Tjetër"].includes(workType)) {
      sections.push({ title: "Checklist Elektrike", items: CHECKLIST_ELEKTRIKE });
    }
    if (workType === "Kamera") sections.push({ title: "Checklist Kamera", items: CHECKLIST_KAMERA });
    if (workType === "Alarm") sections.push({ title: "Checklist Alarm", items: CHECKLIST_ALARM });
    if (workType === "Interfon") sections.push({ title: "Checklist Interfon", items: CHECKLIST_INTERFON });
    sections.push({ title: "Kontroll Final", items: CHECKLIST_FINAL });

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

  const renderPricing = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {allItemNames.map(name => (
            <div key={name} className="flex flex-col p-2 border rounded bg-muted/10">
              <span className="text-[10px] font-bold truncate mb-1">{name}</span>
              <FormField control={form.control} name={`prices.${name}`} render={({ field }) => (
                <div className="flex items-center bg-background rounded border px-1">
                  <Banknote className="w-3 h-3 text-primary mr-1" />
                  <Input type="number" step="0.01" className="h-6 border-0 bg-transparent text-right text-xs p-0" placeholder="0.00" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || ""} data-testid={`price-${name}`} />
                </div>
              )} />
            </div>
          ))}
          {allItemNames.length === 0 && <p className="text-muted-foreground col-span-full text-center text-sm py-4">Ngarko katalogun...</p>}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm sticky top-16 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/"><Button variant="ghost" size="icon" data-testid="button-back"><ArrowLeft /></Button></Link>
          <h1 className="text-xl font-bold truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vlera Totale</p>
            <p className="text-xl font-black text-primary">{calculateGrandTotal().toFixed(2)} €</p>
          </div>
          <Button type="button" variant="outline" onClick={generatePDF} data-testid="button-pdf"><FileDown className="mr-2" /> PDF</Button>
          <Button type="button" onClick={() => {
            form.handleSubmit(onSubmit, (errors) => {
              const errorFields = Object.keys(errors);
              toast({ title: "Plotëso fushat e detyrueshme", description: `Kthehu te tab-i "Klienti" dhe plotëso: ${errorFields.join(', ')}`, variant: "destructive" });
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
                <TabsTrigger value="pajisje" className="gap-2" data-testid="tab-pajisje"><Package className="w-4 h-4" /> Pajisje</TabsTrigger>
                <TabsTrigger value="materiale" className="gap-2" data-testid="tab-materiale"><Settings className="w-4 h-4" /> Materiale</TabsTrigger>
                <TabsTrigger value="kamera" className="gap-2" data-testid="tab-kamera"><Camera className="w-4 h-4" /> Kamera</TabsTrigger>
                <TabsTrigger value="interfon" className="gap-2" data-testid="tab-interfon"><PhoneCall className="w-4 h-4" /> Interfon</TabsTrigger>
                <TabsTrigger value="alarm" className="gap-2" data-testid="tab-alarm"><ShieldAlert className="w-4 h-4" /> Alarm</TabsTrigger>
                <TabsTrigger value="sherbime" className="gap-2" data-testid="tab-sherbime"><Wrench className="w-4 h-4" /> Shërbime</TabsTrigger>
                <TabsTrigger value="checklist" className="gap-2" data-testid="tab-checklist"><CheckCircle2 className="w-4 h-4" /> Checklist</TabsTrigger>
                <TabsTrigger value="cmimet" className="gap-2" data-testid="tab-cmimet"><Banknote className="w-4 h-4" /> Çmimet</TabsTrigger>
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
                    <FormItem><FormLabel>Adresa</FormLabel><FormControl><Input {...field} data-testid="input-client-address" /></FormControl></FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="workDate" render={({ field }) => (
                      <FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} data-testid="input-work-date" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="workType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lloji i Punes</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger data-testid="select-work-type"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>{WORK_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Shënime</FormLabel><FormControl><Textarea {...field} value={field.value || ""} data-testid="input-notes" /></FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pajisje">{renderRoomTable()}</TabsContent>
            <TabsContent value="materiale">{renderSimpleSection(materialItems, "table2Data")}</TabsContent>
            <TabsContent value="kamera">{renderSimpleSection(cameraItems, "cameraData")}</TabsContent>
            <TabsContent value="interfon">{renderSimpleSection(intercomItems, "intercomData")}</TabsContent>
            <TabsContent value="alarm">{renderSimpleSection(alarmItems, "alarmData")}</TabsContent>
            <TabsContent value="sherbime">{renderSimpleSection(serviceItems, "serviceData")}</TabsContent>
            <TabsContent value="checklist">{renderChecklist()}</TabsContent>
            <TabsContent value="cmimet">{renderPricing()}</TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
