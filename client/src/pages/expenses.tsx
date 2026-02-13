import { Layout } from "@/components/layout";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Trash2, Edit2, Receipt, TrendingUp, CalendarDays, Tag, FileDown } from "lucide-react";
import { createElektronovaPDF, addPDFTable, addPDFSummaryBox, addAllFooters } from "@/lib/pdf-utils";
import type { Expense, Job, Supplier } from "@shared/schema";
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_LABELS, type ExpenseCategory } from "@shared/schema";

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (filterCategory && filterCategory !== "all") params.set("category", filterCategory);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }, [filterCategory, startDate, endDate]);

  const { data: allExpenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses", queryParams],
    queryFn: async () => {
      const res = await fetch(`/api/expenses${queryParams}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch expenses");
      return res.json();
    },
  });

  const expenses = search
    ? allExpenses.filter(e =>
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()))
      )
    : allExpenses;

  const totalExpenses = allExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthlyExpenses = allExpenses
    .filter(e => e.date && e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const topCategory = useMemo(() => {
    const catTotals: Record<string, number> = {};
    allExpenses.forEach(e => {
      catTotals[e.category] = (catTotals[e.category] || 0) + (e.amount || 0);
    });
    let top = "";
    let max = 0;
    for (const [cat, total] of Object.entries(catTotals)) {
      if (total > max) { top = cat; max = total; }
    }
    return { category: top, total: max };
  }, [allExpenses]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/expenses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      setShowAddDialog(false);
      toast({ title: "Shpenzimi u shtua me sukses" });
    },
    onError: () => {
      toast({ title: "Gabim gjatë shtimit", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/expenses/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      setEditExpense(null);
      toast({ title: "Shpenzimi u përditësua" });
    },
    onError: () => {
      toast({ title: "Gabim gjatë përditësimit", variant: "destructive" });
    },
  });

  const generateExpensesPDF = () => {
    const date = new Date().toISOString().split("T")[0];
    const { doc, startY } = createElektronovaPDF("RAPORTI I SHPENZIMEVE", date);
    let y = addPDFSummaryBox(doc, startY, [
      `Totali i shpenzimeve: €${totalExpenses.toFixed(2)}`,
      `Shpenzimet e muajit: €${monthlyExpenses.toFixed(2)}`,
      `Kategoria kryesore: ${topCategory.category ? (EXPENSE_CATEGORY_LABELS[topCategory.category as ExpenseCategory] || topCategory.category) : "-"} (€${topCategory.total.toFixed(2)})`,
    ]);
    addPDFTable(doc, y,
      [["Nr.", "Pershkrimi", "Kategoria", "Shuma (EUR)", "Data"]],
      expenses.map((e, i) => [
        String(i + 1),
        e.description,
        EXPENSE_CATEGORY_LABELS[e.category as ExpenseCategory] || e.category,
        (e.amount || 0).toFixed(2),
        e.date || "",
      ]),
    );
    addAllFooters(doc, "Elektronova - Raporti i Shpenzimeve");
    doc.save(`Elektronova_Shpenzime_${date}.pdf`);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      toast({ title: "Shpenzimi u fshi" });
    },
    onError: () => {
      toast({ title: "Gabim gjatë fshirjes", variant: "destructive" });
    },
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-expenses-title">Paneli i Shpenzimeve</h1>
            <p className="text-muted-foreground">{allExpenses.length} shpenzime të regjistruara</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={generateExpensesPDF} data-testid="button-pdf-expenses">
              <FileDown className="h-4 w-4 mr-2" /> Shkarko PDF
            </Button>
            <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-expense">
              <Plus className="h-4 w-4 mr-2" /> Shto Shpenzim
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totali i Shpenzimeve</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-expenses">€{totalExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Këtë Muaj</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-monthly-expenses">€{monthlyExpenses.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategoria Kryesore</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-top-category">
                {topCategory.category
                  ? EXPENSE_CATEGORY_LABELS[topCategory.category as ExpenseCategory] || topCategory.category
                  : "-"}
              </div>
              {topCategory.total > 0 && (
                <p className="text-sm text-muted-foreground">€{topCategory.total.toFixed(2)}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Kërko shpenzim sipas përshkrimit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              data-testid="input-search-expenses"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-filter-category">
              <SelectValue placeholder="Kategoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të gjitha</SelectItem>
              {EXPENSE_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{EXPENSE_CATEGORY_LABELS[cat]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full sm:w-[160px]"
            data-testid="input-start-date"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full sm:w-[160px]"
            data-testid="input-end-date"
          />
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <p className="text-muted-foreground" data-testid="text-loading">Duke u ngarkuar...</p>
          ) : expenses.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground" data-testid="text-empty-state">
                {search || filterCategory !== "all" || startDate || endDate
                  ? "Asnjë rezultat me këto filtra"
                  : "Asnjë shpenzim i regjistruar"}
              </CardContent>
            </Card>
          ) : (
            expenses.map(expense => (
              <Card
                key={expense.id}
                className="hover-elevate"
                data-testid={`card-expense-${expense.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold" data-testid={`text-expense-description-${expense.id}`}>
                          {expense.description}
                        </h3>
                        <Badge variant="outline" data-testid={`badge-expense-category-${expense.id}`}>
                          <Tag className="h-3 w-3 mr-1" />
                          {EXPENSE_CATEGORY_LABELS[expense.category as ExpenseCategory] || expense.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                        <span data-testid={`text-expense-date-${expense.id}`}>
                          <CalendarDays className="h-3 w-3 inline mr-1" />
                          {expense.date}
                        </span>
                        {expense.notes && (
                          <span className="truncate max-w-[200px]" data-testid={`text-expense-notes-${expense.id}`}>
                            {expense.notes}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold whitespace-nowrap" data-testid={`text-expense-amount-${expense.id}`}>
                        €{(expense.amount || 0).toFixed(2)}
                      </span>
                      <Button size="icon" variant="ghost" onClick={() => setEditExpense(expense)}
                        data-testid={`button-edit-expense-${expense.id}`}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => {
                        if (confirm("Fshi këtë shpenzim?")) deleteMutation.mutate(expense.id);
                      }} data-testid={`button-delete-expense-${expense.id}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <ExpenseFormDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />

        {editExpense && (
          <ExpenseFormDialog
            open={!!editExpense}
            onClose={() => setEditExpense(null)}
            expense={editExpense}
            onSubmit={(data) => updateMutation.mutate({ id: editExpense.id, data })}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </Layout>
  );
}

function ExpenseFormDialog({ open, onClose, expense, onSubmit, isLoading }: {
  open: boolean;
  onClose: () => void;
  expense?: Expense;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount?.toString() || "");
  const [category, setCategory] = useState(expense?.category || "tjeter");
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(expense?.notes || "");
  const [jobId, setJobId] = useState(expense?.jobId?.toString() || "");
  const [supplierId, setSupplierId] = useState(expense?.supplierId?.toString() || "");

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount: parseFloat(amount),
      category,
      date,
      notes: notes || null,
      jobId: jobId ? parseInt(jobId) : null,
      supplierId: supplierId ? parseInt(supplierId) : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Ndrysho Shpenzimin" : "Shto Shpenzim të Ri"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Përshkrimi *</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} required data-testid="input-expense-description" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Shuma (€) *</Label>
              <Input type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} required data-testid="input-expense-amount" />
            </div>
            <div className="space-y-2">
              <Label>Kategoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-testid="select-expense-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{EXPENSE_CATEGORY_LABELS[cat]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data *</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required data-testid="input-expense-date" />
          </div>
          <div className="space-y-2">
            <Label>Shënime</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} data-testid="input-expense-notes" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Puna (opsionale)</Label>
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger data-testid="select-expense-job">
                  <SelectValue placeholder="Zgjidhni punën" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Asnjë</SelectItem>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.invoiceNumber ? `${job.invoiceNumber} - ` : ""}{job.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Furnitori (opsionale)</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger data-testid="select-expense-supplier">
                  <SelectValue placeholder="Zgjidhni furnitorin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Asnjë</SelectItem>
                  {suppliers.map(s => (
                    <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !description || !amount || !date} data-testid="button-save-expense">
            {isLoading ? "Duke u ruajtur..." : "Ruaj"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
