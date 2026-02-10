import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertJobSchema, ROOMS, TABLE_1_ITEMS, TABLE_2_ITEMS, CAMERA_ITEMS, INTERCOM_ITEMS, WORK_TYPES, type CreateJobRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Save, FileDown, ArrowLeft, Loader2, Banknote, Camera, PhoneCall, Package, Info, Settings, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formSchema = insertJobSchema;

type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  initialData?: JobFormValues;
  onSubmit: (data: CreateJobRequest) => void;
  isPending: boolean;
  title: string;
}

export function JobForm({ initialData, onSubmit, isPending, title }: JobFormProps) {
  const defaultValues: JobFormValues = initialData || {
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    workDate: new Date().toISOString().split('T')[0],
    workType: "Instalim i ri",
    notes: "",
    table1Data: {},
    table2Data: {},
    cameraData: {},
    intercomData: {},
    prices: {},
  };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const calculateGrandTotal = () => {
    const data = form.getValues();
    let total = 0;

    TABLE_1_ITEMS.forEach(item => {
      const rowData = data.table1Data?.[item] || {};
      const qty = Object.values(rowData).reduce((a, b) => (a || 0) + (b || 0), 0);
      total += qty * (data.prices?.[item] || 0);
    });

    TABLE_2_ITEMS.forEach(item => {
      const qty = data.table2Data?.[item] || 0;
      total += qty * (data.prices?.[item] || 0);
    });

    CAMERA_ITEMS.forEach(item => {
      const qty = data.cameraData?.[item] || 0;
      total += qty * (data.prices?.[item] || 0);
    });

    INTERCOM_ITEMS.forEach(item => {
      const qty = data.intercomData?.[item] || 0;
      total += qty * (data.prices?.[item] || 0);
    });

    return total;
  };

  const generatePDF = () => {
    const data = form.getValues();
    const doc = new jsPDF();
    const themeColor: [number, number, number] = [41, 128, 185];

    doc.setFontSize(22);
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("ELEKTRONOVA", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Procesverbal i Punimeve Elektrike", 105, 28, { align: "center" });

    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35);
    
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Klienti: ${data.clientName}`, 14, 45);
    doc.text(`Adresa: ${data.clientAddress}`, 14, 50);
    doc.text(`Tel: ${data.clientPhone || '-'}`, 14, 55);
    doc.text(`Data: ${data.workDate}`, 120, 45);
    doc.text(`Lloji: ${data.workType}`, 120, 50);

    const table1Headers = ["Pajisja", ...ROOMS, "Total", "Cmimi", "Vlera"];
    const table1Body = TABLE_1_ITEMS.map(item => {
      const rowData = data.table1Data?.[item] || {};
      const totalQty = Object.values(rowData).reduce((a: number, b: number) => a + (b || 0), 0);
      const price = data.prices?.[item] || 0;
      return [
        item,
        ...ROOMS.map(r => rowData[r] || ""),
        totalQty > 0 ? totalQty.toString() : "",
        price > 0 ? price.toFixed(2) : "",
        (totalQty * price) > 0 ? (totalQty * price).toFixed(2) : ""
      ];
    });

    autoTable(doc, {
      startY: 65,
      head: [table1Headers],
      body: table1Body,
      theme: 'grid',
      headStyles: { fillColor: themeColor, fontSize: 5 },
      styles: { fontSize: 5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 20 } },
    });

    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.text("Materialet, Kamera & Interfoni", 14, 20);

    const sections = [
      { name: "Materiale te Pergjithshme", items: TABLE_2_ITEMS, data: data.table2Data },
      { name: "Sistemi i Kamerave", items: CAMERA_ITEMS, data: data.cameraData },
      { name: "Sistemi i Interfonit", items: INTERCOM_ITEMS, data: data.intercomData },
    ];

    let currentY = 25;
    sections.forEach(sec => {
      const body = sec.items.map(item => {
        const qty = sec.data?.[item] || 0;
        const price = data.prices?.[item] || 0;
        const unit = item.toLowerCase().includes("kabell") || item.toLowerCase().includes("ceve") ? "m" : "cope";
        return [item, qty > 0 ? `${qty} ${unit}` : "", price > 0 ? price.toFixed(2) : "", (qty * price) > 0 ? (qty * price).toFixed(2) : ""];
      }).filter(row => row[1] !== "");

      if (body.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(sec.name, 14, currentY);
        autoTable(doc, {
          startY: currentY + 2,
          head: [["Artikulli", "Sasia", "Cmimi", "Vlera"]],
          body: body,
          theme: 'striped',
          headStyles: { fillColor: themeColor },
          styles: { fontSize: 9 },
        });
        currentY = (doc as any).lastAutoTable.finalY + 10;
      }
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Totali i Pergjithshem: ${calculateGrandTotal().toFixed(2)} EUR`, 14, currentY);

    const signY = doc.internal.pageSize.height - 40;
    doc.line(20, signY, 80, signY); doc.line(130, signY, 190, signY);
    doc.setFontSize(9); doc.text("Klienti", 45, signY + 5); doc.text("Elektronova", 155, signY + 5);

    doc.save(`Elektronova_${data.clientName}_${data.workDate}.pdf`);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm sticky top-20 z-10 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/"><Button variant="ghost" size="icon"><ArrowLeft /></Button></Link>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right"><p className="text-xs text-muted-foreground">Vlera Totale</p><p className="text-xl font-black text-primary">{calculateGrandTotal().toFixed(2)} €</p></div>
          <Button type="button" variant="outline" onClick={generatePDF}><FileDown className="mr-2" /> PDF</Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>{isPending ? <Loader2 className="animate-spin" /> : <Save className="mr-2" />} Ruaj</Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          <Tabs defaultValue="info" className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="flex w-max min-w-full bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="info" className="gap-2"><Info className="w-4 h-4" /> Klienti</TabsTrigger>
                <TabsTrigger value="pajisje" className="gap-2"><Package className="w-4 h-4" /> Pajisje</TabsTrigger>
                <TabsTrigger value="materiale" className="gap-2"><Settings className="w-4 h-4" /> Materiale</TabsTrigger>
                <TabsTrigger value="kamera" className="gap-2"><Camera className="w-4 h-4" /> Kamera</TabsTrigger>
                <TabsTrigger value="interfon" className="gap-2"><PhoneCall className="w-4 h-4" /> Interfon</TabsTrigger>
                <TabsTrigger value="cmimet" className="gap-2"><Banknote className="w-4 h-4" /> Çmimet</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="info"><Card><CardContent className="pt-6 grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="clientName" render={({ field }) => (
                  <FormItem><FormLabel>Emri i Klientit</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="clientPhone" render={({ field }) => (
                  <FormItem><FormLabel>Telefoni</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="clientAddress" render={({ field }) => (
                <FormItem><FormLabel>Adresa</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="workDate" render={({ field }) => (
                  <FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="workType" render={({ field }) => (
                  <FormItem><FormLabel>Lloji</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{WORK_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem><FormLabel>Shenime</FormLabel><FormControl><Textarea {...field} value={field.value || ""} /></FormControl></FormItem>
              )} />
            </CardContent></Card></TabsContent>

            <TabsContent value="pajisje"><Card className="overflow-x-auto"><table className="w-full text-xs">
              <thead><tr className="bg-muted border-b"><th className="p-2 text-left sticky left-0 bg-muted z-10 w-32 border-r">Pajisja</th>{ROOMS.map(r => <th key={r} className="p-2 text-center min-w-[50px]">{r}</th>)}<th className="p-2 text-center font-bold bg-primary/5">Sasia</th><th className="p-2 text-center font-bold bg-primary/10">Vlera</th></tr></thead>
              <tbody className="divide-y">{TABLE_1_ITEMS.map(item => {
                const rowValues = form.watch(`table1Data.${item}`) || {};
                const qty = Object.values(rowValues).reduce((a: number, b: number) => a + (b || 0), 0);
                const price = form.watch(`prices.${item}`) || 0;
                return (<tr key={item} className="hover:bg-muted/30">
                  <td className="p-2 font-medium sticky left-0 bg-background z-10 border-r">{item}</td>
                  {ROOMS.map(r => (<td key={r} className="p-0.5"><FormField control={form.control} name={`table1Data.${item}.${r}`} render={({ field }) => (
                    <input type="number" className="w-full h-8 text-center bg-transparent outline-none border-b border-transparent focus:border-primary" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || ""} />
                  )} /></td>))}
                  <td className="p-2 text-center font-bold">{qty || "-"}</td>
                  <td className="p-2 text-center text-primary font-bold">{(qty * price).toFixed(2)}</td>
                </tr>);
              })}</tbody>
            </table></Card></TabsContent>

            {[
              { id: "materiale", items: TABLE_2_ITEMS, field: "table2Data" as const },
              { id: "kamera", items: CAMERA_ITEMS, field: "cameraData" as const },
              { id: "interfon", items: INTERCOM_ITEMS, field: "intercomData" as const }
            ].map(sec => (
              <TabsContent key={sec.id} value={sec.id}>
                <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sec.items.map(item => {
                    const qty = form.watch(`${sec.field}.${item}` as any) || 0;
                    const price = form.watch(`prices.${item}`) || 0;
                    const unit = item.toLowerCase().includes("kabell") || item.toLowerCase().includes("ceve") ? "m" : "cope";
                    return (<div key={item} className="p-2 border rounded-lg flex items-center justify-between gap-2 hover:border-primary/50 transition-colors">
                      <div className="flex flex-col min-w-0"><span className="text-xs font-bold truncate">{item}</span><span className="text-[10px] text-primary font-black">{(qty * price).toFixed(2)} €</span></div>
                      <FormField control={form.control} name={`${sec.field}.${item}` as any} render={({ field }) => (
                        <div className="flex items-center bg-muted/50 rounded overflow-hidden w-20 shrink-0 border"><Input type="number" className="h-7 border-0 bg-transparent text-right px-1 text-xs" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={(field.value as any) || ""} /><span className="text-[9px] px-1 bg-muted uppercase font-bold border-l">{unit}</span></div>
                      )} />
                    </div>);
                  })}
                </CardContent></Card>
              </TabsContent>
            ))}

            <TabsContent value="cmimet"><Card><CardContent className="pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {[...TABLE_1_ITEMS, ...TABLE_2_ITEMS, ...CAMERA_ITEMS, ...INTERCOM_ITEMS].map(item => (
                <div key={item} className="flex flex-col p-2 border rounded bg-muted/10">
                  <span className="text-[10px] font-bold truncate mb-1">{item}</span>
                  <FormField control={form.control} name={`prices.${item}`} render={({ field }) => (
                    <div className="flex items-center bg-white rounded border px-1 shadow-inner"><Banknote className="w-3 h-3 text-primary mr-1" /><Input type="number" step="0.01" className="h-6 border-0 bg-transparent text-right text-xs p-0" placeholder="0.00" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || ""} /></div>
                  )} />
                </div>
              ))}
            </CardContent></Card></TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
