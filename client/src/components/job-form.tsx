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
import { Separator } from "@/components/ui/separator";
import { Save, FileDown, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// We need to extend the schema because Zod resolver expects stricter types for nested records
// that the auto-generated types from drizzle-zod might not perfectly match for forms
const formSchema = insertJobSchema;

type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  initialData?: JobFormValues;
  onSubmit: (data: CreateJobRequest) => void;
  isPending: boolean;
  title: string;
}

export function JobForm({ initialData, onSubmit, isPending, title }: JobFormProps) {
  // Default values for new form
  const defaultValues: JobFormValues = initialData || {
    clientName: "",
    clientPhone: "",
    clientAddress: "",
    workDate: new Date().toISOString().split('T')[0],
    workType: "Instalim i ri",
    notes: "",
    table1Data: {},
    table2Data: {},
  };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const generatePDF = () => {
    const data = form.getValues();
    const doc = new jsPDF();
    const themeColor = [44, 62, 80]; // Dark blue

    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(themeColor[0], themeColor[1], themeColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("ELEKTRONOVA", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Procesverbal i Punimeve Elektrike", 105, 28, { align: "center" });

    // --- Client Info ---
    doc.setDrawColor(200);
    doc.line(14, 35, 196, 35);
    
    doc.setFontSize(10);
    doc.text(`Klienti: ${data.clientName}`, 14, 45);
    doc.text(`Adresa: ${data.clientAddress}`, 14, 50);
    doc.text(`Tel: ${data.clientPhone || '-'}`, 14, 55);
    
    doc.text(`Data: ${data.workDate}`, 120, 45);
    doc.text(`Lloji i punës: ${data.workType}`, 120, 50);

    // --- Table 1: Materials Matrix ---
    const table1Headers = ["Pajisja", ...ROOMS, "Total"];
    const table1Body = TABLE_1_ITEMS.map(item => {
      const rowData = ROOMS.map(room => {
        const qty = data.table1Data?.[item]?.[room] || 0;
        return qty > 0 ? qty.toString() : "";
      });
      
      // Calculate row total
      const total = Object.values(data.table1Data?.[item] || {}).reduce((a, b) => a + b, 0);
      
      return [item, ...rowData, total > 0 ? total.toString() : ""];
    });

    // Filter out empty rows to save space? Optional. 
    // Let's keep them all for completeness as per requirement.

    autoTable(doc, {
      startY: 65,
      head: [table1Headers],
      body: table1Body,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], fontSize: 6, cellPadding: 1 },
      styles: { fontSize: 6, cellPadding: 1, overflow: 'linebreak' },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 25 } }, // First col wider
    });

    // --- Page 2 ---
    doc.addPage();
    
    doc.setFontSize(14);
    doc.text("Materialet e Harxhuara (Tabela 2)", 14, 20);

    const table2Body = TABLE_2_ITEMS.map(item => {
      const qty = data.table2Data?.[item] || 0;
      return [item, qty > 0 ? qty.toString() : ""];
    }).filter(row => row[1] !== ""); // Only show used items for cleaner PDF

    if (table2Body.length > 0) {
      autoTable(doc, {
        startY: 25,
        head: [["Materiali", "Sasia"]],
        body: table2Body,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10 },
      });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Nuk ka materiale shtesë të regjistruara.", 14, 35);
    }

    // --- Notes ---
    const finalY = (doc as any).lastAutoTable?.finalY || 40;
    
    if (data.notes) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Shënime:", 14, finalY + 15);
      doc.setFontSize(10);
      doc.text(data.notes, 14, finalY + 22, { maxWidth: 180 });
    }

    // --- Signatures ---
    const pageHeight = doc.internal.pageSize.height;
    const signY = pageHeight - 40;
    
    doc.setDrawColor(0);
    doc.line(20, signY, 80, signY);
    doc.line(130, signY, 190, signY);
    
    doc.setFontSize(10);
    doc.text("Nënshkrimi i Klientit", 30, signY + 5);
    doc.text("Punëkryerësi (Elektronova)", 140, signY + 5);

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
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            type="button" 
            variant="outline" 
            onClick={generatePDF}
            className="flex-1 sm:flex-none border-primary/20 hover:bg-primary/5 text-primary"
          >
            <FileDown className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            disabled={isPending}
            className="flex-1 sm:flex-none shadow-lg shadow-primary/20"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Ruaj
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-12 p-1 bg-muted/50 rounded-xl mb-6">
              <TabsTrigger value="info" className="rounded-lg data-[state=active]:shadow-sm">Info Klienti</TabsTrigger>
              <TabsTrigger value="pajisje" className="rounded-lg data-[state=active]:shadow-sm">Tabela 1 (Pajisje)</TabsTrigger>
              <TabsTrigger value="materiale" className="rounded-lg data-[state=active]:shadow-sm">Tabela 2 (Materiale)</TabsTrigger>
            </TabsList>

            {/* TAB 1: CLIENT INFO */}
            <TabsContent value="info" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardContent className="pt-6 grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emri i Klientit</FormLabel>
                          <FormControl>
                            <Input placeholder="Filan Fisteku" {...field} className="h-12 text-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numri i Telefonit</FormLabel>
                          <FormControl>
                            <Input placeholder="+383 4X XXX XXX" {...field} className="h-12 text-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="clientAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Rruga, Qyteti..." {...field} className="h-12 text-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="workDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data e Punimeve</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lloji i Punës</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Zgjidh llojin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {WORK_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shënime Shtesë</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detaje tjera rreth punës..." 
                            className="min-h-[120px] resize-none" 
                            {...field} 
                            value={field.value || ""} // Handle null
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: PAJISJE MATRIX */}
            <TabsContent value="pajisje" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted border-b">
                        <th className="p-3 text-left font-semibold sticky left-0 bg-muted z-10 w-48 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Pajisja</th>
                        {ROOMS.map(room => (
                          <th key={room} className="p-3 text-center min-w-[80px] font-medium text-muted-foreground">{room}</th>
                        ))}
                        <th className="p-3 text-center font-bold min-w-[60px] bg-primary/5">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {TABLE_1_ITEMS.map((item, idx) => {
                        // Calculate row total for display
                        const rowValues = form.watch(`table1Data.${item}`) || {};
                        const rowTotal = Object.values(rowValues).reduce((a, b) => (a || 0) + (b || 0), 0);
                        
                        return (
                          <tr key={item} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 font-medium sticky left-0 bg-background z-10 border-r shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                              {item}
                            </td>
                            {ROOMS.map(room => (
                              <td key={`${item}-${room}`} className="p-1">
                                <FormField
                                  control={form.control}
                                  name={`table1Data.${item}.${room}`}
                                  render={({ field }) => (
                                    <input
                                      type="number"
                                      min="0"
                                      className="w-full h-8 text-center rounded border border-transparent hover:border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-transparent focus:bg-background"
                                      {...field}
                                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                      value={field.value || ""}
                                      placeholder="-"
                                    />
                                  )}
                                />
                              </td>
                            ))}
                            <td className="p-3 text-center font-bold text-primary bg-primary/5">
                              {rowTotal || "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <p>Këshillë: Përdorni tastin Tab për të lëvizur shpejt nëpër qeliza.</p>
              </div>
            </TabsContent>

            {/* TAB 3: MATERIALE LIST */}
            <TabsContent value="materiale" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {TABLE_2_ITEMS.map((item) => (
                      <div key={item} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-all">
                        <span className="text-sm font-medium break-words max-w-[70%]">{item}</span>
                        <FormField
                          control={form.control}
                          name={`table2Data.${item}`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              min="0"
                              className="w-24 h-9 text-right font-mono"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              value={field.value || ""}
                            />
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
