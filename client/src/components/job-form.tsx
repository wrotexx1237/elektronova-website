import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertJobSchema, ROOMS, TABLE_1_ITEMS, TABLE_2_ITEMS, WORK_TYPES, type CreateJobRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Save, FileDown, ArrowLeft, Loader2, AlertCircle, Banknote } from "lucide-react";
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
      const qty = Object.values(data.table1Data?.[item] || {}).reduce((a, b) => (a || 0) + (b || 0), 0);
      const price = data.prices?.[item] || 0;
      total += qty * price;
    });

    TABLE_2_ITEMS.forEach(item => {
      const qty = data.table2Data?.[item] || 0;
      const price = data.prices?.[item] || 0;
      total += qty * price;
    });

    return total;
  };

  const generatePDF = () => {
    const data = form.getValues();
    const doc = new jsPDF();
    const themeColor = [44, 62, 80];

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
    doc.text(`Klienti: ${data.clientName}`, 14, 45);
    doc.text(`Adresa: ${data.clientAddress}`, 14, 50);
    doc.text(`Tel: ${data.clientPhone || '-'}`, 14, 55);
    
    doc.text(`Data: ${data.workDate}`, 120, 45);
    doc.text(`Lloji i punës: ${data.workType}`, 120, 50);

    const table1Headers = ["Pajisja", ...ROOMS, "Total", "Cmimi", "Vlera"];
    const table1Body = TABLE_1_ITEMS.map(item => {
      const rowData = ROOMS.map(room => {
        const qty = data.table1Data?.[item]?.[room] || 0;
        return qty > 0 ? qty.toString() : "";
      });
      
      const totalQty = Object.values(data.table1Data?.[item] || {}).reduce((a, b) => a + b, 0);
      const price = data.prices?.[item] || 0;
      const value = totalQty * price;
      
      return [
        item, 
        ...rowData, 
        totalQty > 0 ? totalQty.toString() : "",
        price > 0 ? price.toFixed(2) : "",
        value > 0 ? value.toFixed(2) : ""
      ];
    });

    autoTable(doc, {
      startY: 65,
      head: [table1Headers],
      body: table1Body,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], fontSize: 5, cellPadding: 0.5 },
      styles: { fontSize: 5, cellPadding: 0.5, overflow: 'linebreak' },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 20 } },
    });

    doc.addPage();
    
    doc.setFontSize(14);
    doc.text("Materialet (Tabela 2)", 14, 20);

    const table2Body = TABLE_2_ITEMS.map(item => {
      const qty = data.table2Data?.[item] || 0;
      const price = data.prices?.[item] || 0;
      const value = qty * price;
      const unit = item.toLowerCase().includes("kabell") || item.toLowerCase().includes("ceve") ? "m" : "cope";
      
      return [
        item, 
        qty > 0 ? `${qty} ${unit}` : "",
        price > 0 ? price.toFixed(2) : "",
        value > 0 ? value.toFixed(2) : ""
      ];
    }).filter(row => row[1] !== "");

    if (table2Body.length > 0) {
      autoTable(doc, {
        startY: 25,
        head: [["Materiali", "Sasia", "Cmimi", "Vlera"]],
        body: table2Body,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
      });
    }

    const finalY = (doc as any).lastAutoTable?.finalY || 40;
    const grandTotal = calculateGrandTotal();

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Totali i Pergjithshem: ${grandTotal.toFixed(2)} EUR`, 14, finalY + 10);
    
    if (data.notes) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Shenime:", 14, finalY + 20);
      doc.text(data.notes, 14, finalY + 27, { maxWidth: 180 });
    }

    const pageHeight = doc.internal.pageSize.height;
    const signY = pageHeight - 40;
    
    doc.setDrawColor(0);
    doc.line(20, signY, 80, signY);
    doc.line(130, signY, 190, signY);
    
    doc.setFontSize(10);
    doc.text("Nenshkrimi i Klientit", 30, signY + 5);
    doc.text("Puneryerresi (Elektronova)", 140, signY + 5);

    doc.save(`Procesverbal_${data.clientName.replace(/\s+/g, '_')}_${data.workDate}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm sticky top-20 z-10 backdrop-blur-md bg-opacity-90">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Totali</p>
            <p className="text-lg font-bold text-primary">{calculateGrandTotal().toFixed(2)} €</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={generatePDF}>
              <FileDown className="mr-2 h-4 w-4" /> PDF
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Ruaj
            </Button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-12 p-1 bg-muted/50 rounded-xl mb-6">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="pajisje">Pajisje</TabsTrigger>
              <TabsTrigger value="materiale">Materiale</TabsTrigger>
              <TabsTrigger value="cmimet">Cmimet</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card><CardContent className="pt-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="clientName" render={({ field }) => (
                    <FormItem><FormLabel>Emri i Klientit</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="clientPhone" render={({ field }) => (
                    <FormItem><FormLabel>Telefoni</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="clientAddress" render={({ field }) => (
                  <FormItem><FormLabel>Adresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="workDate" render={({ field }) => (
                    <FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="workType" render={({ field }) => (
                    <FormItem><FormLabel>Lloji i Punes</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>{WORK_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Shenime</FormLabel><FormControl><Textarea {...field} value={field.value || ""} /></FormControl></FormItem>
                )} />
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="pajisje">
              <Card className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted border-b">
                      <th className="p-2 text-left sticky left-0 bg-muted z-10 w-32 shadow-md">Pajisja</th>
                      {ROOMS.map(r => <th key={r} className="p-2 text-center min-w-[50px]">{r}</th>)}
                      <th className="p-2 text-center font-bold bg-primary/5">Sasia</th>
                      <th className="p-2 text-center font-bold bg-primary/10">Vlera</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {TABLE_1_ITEMS.map(item => {
                      const rowValues = form.watch(`table1Data.${item}`) || {};
                      const rowQty = Object.values(rowValues).reduce((a, b) => (a || 0) + (b || 0), 0);
                      const price = form.watch(`prices.${item}`) || 0;
                      return (
                        <tr key={item} className="hover:bg-muted/30">
                          <td className="p-2 font-medium sticky left-0 bg-background z-10 border-r">{item}</td>
                          {ROOMS.map(r => (
                            <td key={r} className="p-0.5">
                              <FormField control={form.control} name={`table1Data.${item}.${r}`} render={({ field }) => (
                                <input type="number" className="w-full h-7 text-center bg-transparent outline-none focus:bg-white" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || ""} />
                              )} />
                            </td>
                          ))}
                          <td className="p-2 text-center font-bold">{rowQty || "-"}</td>
                          <td className="p-2 text-center text-primary font-bold">{(rowQty * price).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </TabsContent>

            <TabsContent value="materiale">
              <Card><CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TABLE_2_ITEMS.map(item => {
                  const qty = form.watch(`table2Data.${item}`) || 0;
                  const price = form.watch(`prices.${item}`) || 0;
                  const unit = item.toLowerCase().includes("kabell") || item.toLowerCase().includes("ceve") ? "m" : "cope";
                  return (
                    <div key={item} className="p-3 border rounded-lg flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-semibold leading-tight">{item}</span>
                        <span className="text-xs font-bold text-primary">{(qty * price).toFixed(2)} €</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FormField control={form.control} name={`table2Data.${item}`} render={({ field }) => (
                          <div className="flex-1 flex items-center bg-muted/30 rounded px-2">
                            <Input type="number" className="h-8 border-0 bg-transparent text-right" placeholder="0" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || ""} />
                            <span className="text-[10px] text-muted-foreground ml-1 uppercase">{unit}</span>
                          </div>
                        )} />
                      </div>
                    </div>
                  );
                })}
              </CardContent></Card>
            </TabsContent>

            <TabsContent value="cmimet">
              <Card><CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...TABLE_1_ITEMS, ...TABLE_2_ITEMS].map(item => (
                    <div key={item} className="flex items-center justify-between p-2 border rounded hover:bg-muted/30">
                      <span className="text-xs font-medium truncate flex-1 mr-2">{item}</span>
                      <FormField control={form.control} name={`prices.${item}`} render={({ field }) => (
                        <div className="flex items-center bg-primary/5 rounded px-2 w-24">
                          <Banknote className="h-3 w-3 text-primary mr-1" />
                          <Input type="number" step="0.01" className="h-8 border-0 bg-transparent text-right p-0" placeholder="0.00" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} value={field.value || ""} />
                        </div>
                      )} />
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
