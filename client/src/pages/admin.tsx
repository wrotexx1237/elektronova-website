import { Layout } from "@/components/layout";
import { useCatalog, useCreateCatalogItem, useUpdateCatalogItem, useDeleteCatalogItem } from "@/hooks/use-catalog";
import { CATEGORIES, UNITS, type CatalogItem, type Job, JOB_CATEGORIES, JOB_CATEGORY_LABELS, type JobCategory } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdmin } from "@/hooks/use-admin";
import { useJobs } from "@/hooks/use-jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Loader2, Package, Save, Lock, TrendingUp, Users, DollarSign, ShoppingCart, BarChart3, RefreshCw, Eye, ChevronDown, ChevronUp, CalendarDays, Award, History, FileDown } from "lucide-react";
import { createElektronovaPDF, addPDFTable, addAllFooters } from "@/lib/pdf-utils";
import { useState, useMemo } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@shared/routes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

function AddItemForm({ category, onDone }: { category: string; onDone: () => void }) {
  const create = useCreateCatalogItem();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("copë");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);

  const handleSubmit = () => {
    if (!name.trim()) return;
    create.mutate({
      category, name: name.trim(), unit, purchasePrice, salePrice, notes: null, sortOrder: 0,
    }, { onSuccess: () => { setName(""); setPurchasePrice(0); setSalePrice(0); onDone(); } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-3 bg-muted/30 rounded-lg border border-dashed">
      <Input data-testid="input-catalog-name" placeholder="Emri i artikullit" value={name} onChange={e => setName(e.target.value)} className="sm:col-span-2" />
      <Select value={unit} onValueChange={setUnit}>
        <SelectTrigger data-testid="select-unit"><SelectValue /></SelectTrigger>
        <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
      </Select>
      <Input data-testid="input-purchase-price" type="number" step="0.01" placeholder="Blerje €" value={purchasePrice || ""} onChange={e => setPurchasePrice(parseFloat(e.target.value) || 0)} />
      <Input data-testid="input-sale-price" type="number" step="0.01" placeholder="Shitje €" value={salePrice || ""} onChange={e => setSalePrice(parseFloat(e.target.value) || 0)} />
      <Button data-testid="button-add-item" onClick={handleSubmit} disabled={create.isPending || !name.trim()}>
        {create.isPending ? <Loader2 className="animate-spin" /> : <Plus className="mr-1" />} Shto
      </Button>
    </div>
  );
}

function PriceHistoryDialog({ itemId, itemName }: { itemId: number; itemName: string }) {
  const [open, setOpen] = useState(false);
  const { data: history, isLoading } = useQuery<any[]>({
    queryKey: ['/api/price-history', itemId],
    queryFn: async () => {
      const res = await fetch(`/api/price-history?catalogItemId=${itemId}`);
      return res.json();
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" data-testid={`button-price-history-${itemId}`}>
          <History className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><History className="w-4 h-4" /> Historiku i Cmimeve: {itemName}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>
        ) : !history || history.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">Nuk ka ndryshime cmimesh te regjistruara.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {history.map((h: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded border text-sm">
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Shitje:</span>
                    <span className="text-xs line-through text-muted-foreground">{h.oldSalePrice?.toFixed(2) ?? '0.00'}€</span>
                    <span className="text-xs font-bold">{h.newSalePrice?.toFixed(2) ?? '0.00'}€</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">Blerje:</span>
                    <span className="text-xs line-through text-muted-foreground">{h.oldPurchasePrice?.toFixed(2) ?? '0.00'}€</span>
                    <span className="text-xs font-bold">{h.newPurchasePrice?.toFixed(2) ?? '0.00'}€</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{h.changedBy || '-'} - {h.changedAt ? new Date(h.changedAt).toLocaleDateString('sq') : '-'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CatalogRow({ item, isAdmin }: { item: CatalogItem; isAdmin: boolean }) {
  const update = useUpdateCatalogItem();
  const del = useDeleteCatalogItem();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [unit, setUnit] = useState(item.unit);
  const [pp, setPp] = useState(item.purchasePrice || 0);
  const [sp, setSp] = useState(item.salePrice || 0);

  const handleSave = () => {
    update.mutate({ id: item.id, name, unit, purchasePrice: pp, salePrice: sp }, { onSuccess: () => setEditing(false) });
  };

  if (editing && isAdmin) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 p-2 bg-primary/5 rounded border border-primary/20 items-center">
        <Input value={name} onChange={e => setName(e.target.value)} className="sm:col-span-2" />
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
        </Select>
        <Input type="number" step="0.01" value={pp || ""} onChange={e => setPp(parseFloat(e.target.value) || 0)} placeholder="Blerje €" />
        <Input type="number" step="0.01" value={sp || ""} onChange={e => setSp(parseFloat(e.target.value) || 0)} placeholder="Shitje €" />
        <div className="flex gap-1 sm:col-span-2">
          <Button size="sm" onClick={handleSave} disabled={update.isPending}><Save className="w-3 h-3 mr-1" /> Ruaj</Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>X</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-2 p-2 rounded items-center hover:bg-muted/30 group">
      <span className="font-medium sm:col-span-2 text-sm">{item.name}</span>
      <span className="text-xs text-muted-foreground uppercase">{item.unit}</span>
      {isAdmin ? (
        <span className="text-xs" data-testid={`text-purchase-price-${item.id}`}>{item.purchasePrice ? `${item.purchasePrice.toFixed(2)} €` : "-"}</span>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      )}
      <span className="text-xs font-medium" data-testid={`text-sale-price-${item.id}`}>{item.salePrice ? `${item.salePrice.toFixed(2)} €` : "-"}</span>
      <div className="flex gap-1 invisible group-hover:visible sm:col-span-2">
        <PriceHistoryDialog itemId={item.id} itemName={item.name} />
        {isAdmin ? (
          <>
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)} data-testid={`button-edit-${item.id}`}><Edit className="w-3 h-3" /></Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-destructive" data-testid={`button-delete-${item.id}`}><Trash2 className="w-3 h-3" /></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Fshi artikullin?</AlertDialogTitle>
                  <AlertDialogDescription>"{item.name}" do të fshihet.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Anulo</AlertDialogCancel>
                  <AlertDialogAction onClick={() => del.mutate(item.id)} className="bg-destructive text-destructive-foreground">Fshije</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Vetëm admin</span>
        )}
      </div>
    </div>
  );
}

interface ProductProfit {
  name: string;
  qty: number;
  salePrice: number;
  purchasePrice: number;
  totalSale: number;
  totalPurchase: number;
  profit: number;
}

interface JobTotals {
  clientName: string;
  category: string;
  workDate: string;
  totalSale: number;
  totalPurchase: number;
  profit: number;
  jobId: number;
  products: ProductProfit[];
}

function getJobProducts(job: Job): ProductProfit[] {
  const prices = (job.prices || {}) as Record<string, number>;
  const purchasePrices = (job.purchasePrices || {}) as Record<string, number>;
  const products: ProductProfit[] = [];

  const table1Data = (job.table1Data || {}) as Record<string, Record<string, number>>;
  Object.entries(table1Data).forEach(([itemName, rooms]) => {
    const qty = Object.values(rooms || {}).reduce((a, b) => a + (b || 0), 0);
    if (qty > 0) {
      const sp = prices[itemName] || 0;
      const pp = purchasePrices[itemName] || 0;
      const totalS = qty * sp;
      const totalP = qty * pp;
      if (totalS > 0 || totalP > 0) {
        products.push({ name: itemName, qty, salePrice: sp, purchasePrice: pp, totalSale: totalS, totalPurchase: totalP, profit: totalS - totalP });
      }
    }
  });

  const simpleFields = ['table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'] as const;
  simpleFields.forEach(field => {
    const data = (job[field] || {}) as Record<string, number>;
    Object.entries(data).forEach(([itemName, qty]) => {
      if (qty > 0) {
        const sp = prices[itemName] || 0;
        const pp = purchasePrices[itemName] || 0;
        const totalS = qty * sp;
        const totalP = qty * pp;
        if (totalS > 0 || totalP > 0) {
          products.push({ name: itemName, qty, salePrice: sp, purchasePrice: pp, totalSale: totalS, totalPurchase: totalP, profit: totalS - totalP });
        }
      }
    });
  });

  return products;
}

function calculateJobTotals(job: Job): JobTotals {
  const products = getJobProducts(job);
  const subtotalSale = products.reduce((s, p) => s + p.totalSale, 0);
  const totalPurchase = products.reduce((s, p) => s + p.totalPurchase, 0);

  const discType = (job as any).discountType || "percent";
  const discVal = (job as any).discountValue || 0;
  let discountAmount = 0;
  if (discType === "percent") {
    discountAmount = subtotalSale * (discVal / 100);
  } else {
    discountAmount = discVal;
  }
  discountAmount = Math.min(discountAmount, subtotalSale);
  const totalSale = subtotalSale - discountAmount;

  return {
    clientName: job.clientName,
    category: job.category || 'electric',
    workDate: job.workDate,
    totalSale,
    totalPurchase,
    profit: totalSale - totalPurchase,
    jobId: job.id,
    products,
  };
}

function useRefreshPrices() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/jobs/refresh-prices', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to refresh prices');
      return res.json();
    },
    onSuccess: (data: { updated: number; total: number }) => {
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
      toast({
        title: "Çmimet u përditësuan!",
        description: `${data.updated} nga ${data.total} punë u përditësuan me çmimet e fundit nga katalogu.`,
      });
    },
    onError: () => toast({ title: "Gabim", description: "Nuk u përditësuan çmimet.", variant: "destructive" }),
  });
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

function ClientProductBreakdown({ totals }: { totals: JobTotals }) {
  if (totals.products.length === 0) {
    return <p className="text-muted-foreground text-sm py-2 px-4">Nuk ka produkte me sasi ne kete pune.</p>;
  }

  return (
    <div className="bg-muted/20 rounded-lg p-3 mt-1 mb-2 mx-2 border border-muted">
      <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-bold text-muted-foreground border-b pb-2 mb-2">
        <span className="col-span-3">Produkti</span>
        <span className="col-span-1 text-center">Sasia</span>
        <span className="col-span-2 text-right">Çm. Shitjes</span>
        <span className="col-span-2 text-right">Çm. Blerjes</span>
        <span className="col-span-2 text-right">Shitja Tot.</span>
        <span className="col-span-2 text-right">Fitimi</span>
      </div>
      {totals.products.map((p, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 text-xs items-center py-1.5 border-b border-muted/50 last:border-0">
          <span className="col-span-3 font-medium truncate">{p.name}</span>
          <span className="col-span-1 text-center">{p.qty}</span>
          <span className="col-span-2 text-right">{p.salePrice.toFixed(2)} €</span>
          <span className="col-span-2 text-right text-amber-600">{p.purchasePrice.toFixed(2)} €</span>
          <span className="col-span-2 text-right text-primary">{p.totalSale.toFixed(2)} €</span>
          <span className={`col-span-2 text-right font-bold ${p.profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>{p.profit.toFixed(2)} €</span>
        </div>
      ))}
      <div className="grid grid-cols-12 gap-2 text-xs items-center pt-2 mt-1 border-t-2 border-primary/20 font-bold">
        <span className="col-span-3">TOTALI</span>
        <span className="col-span-1 text-center">{totals.products.reduce((s, p) => s + p.qty, 0)}</span>
        <span className="col-span-2"></span>
        <span className="col-span-2"></span>
        <span className="col-span-2 text-right text-primary">{totals.totalSale.toFixed(2)} €</span>
        <span className={`col-span-2 text-right ${totals.profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>{totals.profit.toFixed(2)} €</span>
      </div>
    </div>
  );
}

function ProfitDashboard() {
  const { data: jobs, isLoading } = useJobs();
  const refreshPrices = useRefreshPrices();
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  const jobsList: Job[] = (jobs || []).filter((j: Job) => !j.isTemplate);

  const filteredJobs = useMemo(() => {
    return jobsList.filter(job => {
      const d = job.workDate;
      if (dateFilter === "all") {
        if (dateFrom && d < dateFrom) return false;
        if (dateTo && d > dateTo) return false;
        return true;
      }
      const now = new Date();
      const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      const thisYear = `${now.getFullYear()}`;
      if (dateFilter === "month") return d.startsWith(thisMonth);
      if (dateFilter === "year") return d.startsWith(thisYear);
      if (dateFilter === "custom") {
        if (dateFrom && d < dateFrom) return false;
        if (dateTo && d > dateTo) return false;
      }
      return true;
    });
  }, [jobsList, dateFilter, dateFrom, dateTo]);

  const allTotals = filteredJobs.map(calculateJobTotals);

  const grandTotalSale = allTotals.reduce((s, t) => s + t.totalSale, 0);
  const grandTotalPurchase = allTotals.reduce((s, t) => s + t.totalPurchase, 0);
  const grandProfit = grandTotalSale - grandTotalPurchase;
  const profitMargin = grandTotalSale > 0 ? (grandProfit / grandTotalSale) * 100 : 0;

  const barChartData = allTotals
    .filter(t => t.totalSale > 0 || t.totalPurchase > 0)
    .map(t => ({
      name: t.clientName.length > 15 ? t.clientName.substring(0, 15) + '...' : t.clientName,
      Shitja: parseFloat(t.totalSale.toFixed(2)),
      Blerja: parseFloat(t.totalPurchase.toFixed(2)),
      Fitimi: parseFloat(t.profit.toFixed(2)),
    }));

  const categoryBreakdown: Record<string, { label: string; sale: number; purchase: number; profit: number; count: number }> = {};
  allTotals.forEach(t => {
    const key = t.category;
    const label = JOB_CATEGORY_LABELS[key as JobCategory] || key;
    if (!categoryBreakdown[key]) categoryBreakdown[key] = { label, sale: 0, purchase: 0, profit: 0, count: 0 };
    categoryBreakdown[key].sale += t.totalSale;
    categoryBreakdown[key].purchase += t.totalPurchase;
    categoryBreakdown[key].profit += t.profit;
    categoryBreakdown[key].count++;
  });

  const categoryBarData = Object.values(categoryBreakdown)
    .filter(c => c.sale > 0 || c.purchase > 0)
    .map(c => ({
      name: c.label,
      Shitja: parseFloat(c.sale.toFixed(2)),
      Blerja: parseFloat(c.purchase.toFixed(2)),
      Fitimi: parseFloat(c.profit.toFixed(2)),
    }));

  const pieData = Object.values(categoryBreakdown)
    .filter(c => c.sale > 0)
    .map(c => ({ name: c.label, value: parseFloat(c.sale.toFixed(2)) }));

  const monthlyData = useMemo(() => {
    const months: Record<string, { sale: number; purchase: number; profit: number }> = {};
    allTotals.forEach(t => {
      const m = t.workDate?.substring(0, 7);
      if (!m) return;
      if (!months[m]) months[m] = { sale: 0, purchase: 0, profit: 0 };
      months[m].sale += t.totalSale;
      months[m].purchase += t.totalPurchase;
      months[m].profit += t.profit;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        name: month,
        Shitja: parseFloat(data.sale.toFixed(2)),
        Blerja: parseFloat(data.purchase.toFixed(2)),
        Fitimi: parseFloat(data.profit.toFixed(2)),
      }));
  }, [allTotals]);

  const topProducts = useMemo(() => {
    const productMap: Record<string, { name: string; qty: number; totalSale: number; totalPurchase: number; profit: number }> = {};
    allTotals.forEach(t => {
      t.products.forEach(p => {
        if (!productMap[p.name]) productMap[p.name] = { name: p.name, qty: 0, totalSale: 0, totalPurchase: 0, profit: 0 };
        productMap[p.name].qty += p.qty;
        productMap[p.name].totalSale += p.totalSale;
        productMap[p.name].totalPurchase += p.totalPurchase;
        productMap[p.name].profit += p.profit;
      });
    });
    return Object.values(productMap)
      .filter(p => p.totalSale > 0 || p.totalPurchase > 0)
      .sort((a, b) => b.profit - a.profit);
  }, [allTotals]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Paneli i Fitimeve
        </h2>
        <Button
          onClick={() => refreshPrices.mutate()}
          disabled={refreshPrices.isPending}
          data-testid="button-refresh-prices"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshPrices.isPending ? 'animate-spin' : ''}`} />
          {refreshPrices.isPending ? 'Po përditësohen...' : 'Përditëso Çmimet nga Katalogu'}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Periudha:</span>
            </div>
            <Select value={dateFilter} onValueChange={(v) => { setDateFilter(v); if (v !== "custom" && v !== "all") { setDateFrom(""); setDateTo(""); } }}>
              <SelectTrigger className="w-[160px]" data-testid="select-date-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Të gjitha</SelectItem>
                <SelectItem value="month">Ky muaj</SelectItem>
                <SelectItem value="year">Ky vit</SelectItem>
                <SelectItem value="custom">Periudhë e caktuar</SelectItem>
              </SelectContent>
            </Select>
            {(dateFilter === "custom" || dateFilter === "all") && (
              <div className="flex items-center gap-2 flex-wrap">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-[150px]"
                  data-testid="input-date-from"
                />
                <span className="text-xs text-muted-foreground">deri</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-[150px]"
                  data-testid="input-date-to"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Pune Totale</span>
            </div>
            <p className="text-2xl font-black" data-testid="text-total-jobs">{allTotals.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Shitje Totale</span>
            </div>
            <p className="text-2xl font-black text-primary" data-testid="text-grand-sale">{grandTotalSale.toFixed(2)} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingCart className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-muted-foreground">Blerje Totale</span>
            </div>
            <p className="text-2xl font-black text-amber-600" data-testid="text-grand-purchase">{grandTotalPurchase.toFixed(2)} €</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Fitimi ({profitMargin.toFixed(1)}%)</span>
            </div>
            <p className="text-2xl font-black text-green-600" data-testid="text-grand-profit">{grandProfit.toFixed(2)} €</p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(categoryBreakdown).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Fitimet sipas Kategorisë
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(categoryBreakdown).map(([key, cat], index) => {
                const margin = cat.sale > 0 ? (cat.profit / cat.sale) * 100 : 0;
                return (
                  <Card key={key} className="border-l-0" data-testid={`card-category-profit-${key}`}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-sm">{cat.label}</span>
                        <span className="text-xs text-muted-foreground">{cat.count} punë</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Shitja</span>
                          <span className="text-sm font-medium text-primary">{cat.sale.toFixed(2)} €</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Blerja</span>
                          <span className="text-sm font-medium text-amber-600">{cat.purchase.toFixed(2)} €</span>
                        </div>
                        <div className="border-t pt-2 flex items-center justify-between">
                          <span className="text-xs font-bold">Fitimi</span>
                          <span className={`text-sm font-black ${cat.profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                            {cat.profit.toFixed(2)} €
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${cat.profit >= 0 ? 'bg-green-500' : 'bg-destructive'}`}
                            style={{ width: `${Math.min(Math.max(margin, 0), 100)}%` }}
                          />
                        </div>
                        <div className="text-center">
                          <span className="text-xs text-muted-foreground">Marzhi: {margin.toFixed(1)}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {categoryBarData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Shitja vs Blerja sipas Kategorisë</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryBarData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number) => `${value.toFixed(2)} €`}
                      contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="Shitja" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Blerja" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Fitimi" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {pieData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Shitjet sipas Kategorisë</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                      >
                        {pieData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {barChartData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Shitja vs Blerja per Klient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} €`}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="Shitja" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Blerja" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Fitimi" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Analiza per Klient
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="hidden sm:grid grid-cols-12 gap-2 p-2 text-xs font-bold text-muted-foreground border-b mb-2">
            <span className="col-span-3">Klienti</span>
            <span className="col-span-2">Kategoria</span>
            <span className="col-span-1">Data</span>
            <span className="col-span-2 text-right">Shitja</span>
            <span className="col-span-2 text-right">Blerja</span>
            <span className="col-span-2 text-right">Fitimi</span>
          </div>
          <div className="space-y-0">
            {allTotals.length === 0 && (
              <p className="text-muted-foreground text-center text-sm py-6">Nuk ka pune te regjistruara.</p>
            )}
            {allTotals.map(t => (
              <div key={t.jobId}>
                <div className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-muted/20 text-sm">
                  <div className="col-span-3 flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setExpandedJob(expandedJob === t.jobId ? null : t.jobId)}
                      data-testid={`button-view-products-${t.jobId}`}
                    >
                      {expandedJob === t.jobId ? <ChevronUp className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <span className="font-medium truncate" data-testid={`text-client-${t.jobId}`}>{t.clientName}</span>
                  </div>
                  <span className="col-span-2 text-xs text-muted-foreground">{JOB_CATEGORY_LABELS[t.category as JobCategory] || t.category}</span>
                  <span className="col-span-1 text-xs text-muted-foreground">{t.workDate}</span>
                  <span className="col-span-2 text-right font-medium text-primary" data-testid={`text-sale-${t.jobId}`}>{t.totalSale.toFixed(2)} €</span>
                  <span className="col-span-2 text-right font-medium text-amber-600" data-testid={`text-purchase-${t.jobId}`}>{t.totalPurchase.toFixed(2)} €</span>
                  <span className={`col-span-2 text-right font-bold ${t.profit >= 0 ? 'text-green-600' : 'text-destructive'}`} data-testid={`text-profit-${t.jobId}`}>{t.profit.toFixed(2)} €</span>
                </div>
                {expandedJob === t.jobId && <ClientProductBreakdown totals={t} />}
              </div>
            ))}
          </div>

          {allTotals.length > 0 && (
            <div className="grid grid-cols-12 gap-2 items-center p-3 rounded bg-muted/30 mt-3 border-t-2 border-primary/20">
              <span className="col-span-3 font-bold text-sm">TOTALI</span>
              <span className="col-span-2"></span>
              <span className="col-span-1"></span>
              <span className="col-span-2 text-right font-black text-primary">{grandTotalSale.toFixed(2)} €</span>
              <span className="col-span-2 text-right font-black text-amber-600">{grandTotalPurchase.toFixed(2)} €</span>
              <span className={`col-span-2 text-right font-black ${grandProfit >= 0 ? 'text-green-600' : 'text-destructive'}`}>{grandProfit.toFixed(2)} €</span>
            </div>
          )}
        </CardContent>
      </Card>

      {monthlyData.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-primary" />
              Krahasimi Mujor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(2)} €`}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="Shitja" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Blerja" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Fitimi" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {topProducts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Top Produktet (sipas fitimit)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hidden sm:grid grid-cols-12 gap-2 p-2 text-xs font-bold text-muted-foreground border-b mb-2">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-3">Produkti</span>
              <span className="col-span-2 text-center">Sasia Tot.</span>
              <span className="col-span-2 text-right">Shitja Tot.</span>
              <span className="col-span-2 text-right">Blerja Tot.</span>
              <span className="col-span-2 text-right">Fitimi</span>
            </div>
            <div className="space-y-0">
              {topProducts.slice(0, 15).map((p, i) => (
                <div key={p.name} className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-muted/20 text-sm" data-testid={`row-top-product-${i}`}>
                  <span className="col-span-1 text-center text-xs font-bold text-muted-foreground">{i + 1}</span>
                  <span className="col-span-3 font-medium truncate">{p.name}</span>
                  <span className="col-span-2 text-center text-muted-foreground">{p.qty}</span>
                  <span className="col-span-2 text-right text-primary font-medium">{p.totalSale.toFixed(2)} €</span>
                  <span className="col-span-2 text-right text-amber-600 font-medium">{p.totalPurchase.toFixed(2)} €</span>
                  <span className={`col-span-2 text-right font-bold ${p.profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>{p.profit.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ManagedUser {
  id: number;
  username: string;
  fullName: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  isActive: number;
  assignedCategories?: string[];
}

function UserManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: users = [], isLoading } = useQuery<ManagedUser[]>({
    queryKey: ["/api/users"],
  });

  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/auth/register", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Tekniku u krijua me sukses" });
      resetForm();
    },
    onError: (err: Error) => toast({ title: "Gabim", description: err.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest("PUT", `/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Përdoruesi u përditësua" });
      setEditingUser(null);
    },
    onError: (err: Error) => toast({ title: "Gabim", description: err.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setShowCreate(false);
    setUsername("");
    setPassword("");
    setFullName("");
    setPhone("");
    setEmail("");
    setSelectedCategories([]);
  };

  const handleCreate = () => {
    if (!username.trim() || !password.trim() || !fullName.trim()) {
      toast({ title: "Plotësoni fushat e detyrueshme", variant: "destructive" });
      return;
    }
    createMutation.mutate({
      username: username.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      role: "technician",
      phone: phone.trim() || null,
      email: email.trim() || null,
      assignedCategories: selectedCategories,
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const startEdit = (u: ManagedUser) => {
    setEditingUser(u);
    setFullName(u.fullName);
    setPhone(u.phone || "");
    setEmail(u.email || "");
    setSelectedCategories(u.assignedCategories || []);
    setPassword("");
  };

  const handleUpdate = () => {
    if (!editingUser) return;
    const data: any = {
      id: editingUser.id,
      fullName,
      phone: phone || null,
      email: email || null,
      assignedCategories: selectedCategories,
    };
    if (password.trim()) data.password = password.trim();
    updateMutation.mutate(data);
  };

  const toggleActive = (u: ManagedUser) => {
    updateMutation.mutate({ id: u.id, isActive: u.isActive ? 0 : 1 });
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  const CategoryCheckboxes = () => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Kategoritë e caktuara</Label>
      <div className="grid grid-cols-2 gap-2">
        {JOB_CATEGORIES.map(cat => (
          <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded border hover:bg-muted/30">
            <Checkbox
              checked={selectedCategories.includes(cat)}
              onCheckedChange={() => toggleCategory(cat)}
              data-testid={`checkbox-category-${cat}`}
            />
            {JOB_CATEGORY_LABELS[cat]}
          </label>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Lini bosh për qasje në të gjitha kategoritë
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Menaxhimi i Përdoruesve
        </h2>
        <Button onClick={() => setShowCreate(!showCreate)} data-testid="button-create-user">
          <Plus className="mr-1" /> Shto Teknician
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Krijo Teknician të Ri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Emri i Përdoruesit *</Label>
                <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="psh. teknik1" data-testid="input-new-username" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Fjalëkalimi *</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 karaktere" data-testid="input-new-password" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Emri i Plotë *</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Emri Mbiemri" data-testid="input-new-fullname" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Telefoni</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+383..." data-testid="input-new-phone" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" data-testid="input-new-email" />
              </div>
            </div>
            <CategoryCheckboxes />
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={createMutation.isPending} data-testid="button-save-user">
                {createMutation.isPending ? <Loader2 className="animate-spin mr-1" /> : <Save className="mr-1" />}
                Krijo
              </Button>
              <Button variant="ghost" onClick={resetForm}>Anulo</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingUser && (
        <Card className="border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ndrysho: {editingUser.fullName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Emri i Plotë</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} data-testid="input-edit-fullname" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Fjalëkalimi i Ri (opsional)</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Lini bosh për të mos ndryshuar" data-testid="input-edit-password" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Telefoni</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} data-testid="input-edit-phone" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} data-testid="input-edit-email" />
              </div>
            </div>
            <CategoryCheckboxes />
            <div className="flex gap-2">
              <Button onClick={handleUpdate} disabled={updateMutation.isPending} data-testid="button-update-user">
                {updateMutation.isPending ? <Loader2 className="animate-spin mr-1" /> : <Save className="mr-1" />}
                Ruaj
              </Button>
              <Button variant="ghost" onClick={() => setEditingUser(null)}>Anulo</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {users.map(u => (
          <Card key={u.id} className={!u.isActive ? "opacity-50" : ""} data-testid={`card-user-${u.id}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{u.fullName}</span>
                    <Badge variant={u.role === "admin" ? "default" : "secondary"} className="text-xs">
                      {u.role === "admin" ? "Admin" : "Teknician"}
                    </Badge>
                    {!u.isActive && <Badge variant="outline" className="text-xs text-destructive border-destructive/30">Joaktiv</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    @{u.username} {u.phone && ` | ${u.phone}`}
                  </div>
                  {u.assignedCategories && u.assignedCategories.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {u.assignedCategories.map(cat => (
                        <Badge key={cat} variant="outline" className="text-xs">
                          {JOB_CATEGORY_LABELS[cat as JobCategory] || cat}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {u.role !== "admin" && (!u.assignedCategories || u.assignedCategories.length === 0) && (
                    <p className="text-xs text-muted-foreground mt-1">Qasje në të gjitha kategoritë</p>
                  )}
                </div>
                {u.role !== "admin" && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(u)} data-testid={`button-edit-user-${u.id}`}>
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant={u.isActive ? "ghost" : "default"} onClick={() => toggleActive(u)} data-testid={`button-toggle-user-${u.id}`}>
                      {u.isActive ? "Çaktivizo" : "Aktivizo"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: catalog, isLoading } = useCatalog();
  const { isAdmin } = useAdmin();
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("catalog");

  const grouped = (catalog || []).reduce((acc: Record<string, CatalogItem[]>, item: CatalogItem) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  const generateCatalogPDF = () => {
    const date = new Date().toISOString().split("T")[0];
    const { doc, startY } = createElektronovaPDF("KATALOGU I ARTIKUJVE", date);
    let y = startY;
    const categories = Object.keys(grouped);
    categories.forEach((cat) => {
      const items = grouped[cat] || [];
      if (items.length === 0) return;
      doc.setFontSize(11);
      doc.setTextColor(41, 128, 185);
      doc.setFont("helvetica", "bold");
      doc.text(cat, 14, y);
      y += 6;
      if (isAdmin) {
        y = addPDFTable(doc, y,
          [["Nr.", "Artikulli", "Njësia", "Cmimi Blerje (EUR)", "Cmimi Shitje (EUR)"]],
          items.map((item, i) => [
            String(i + 1), item.name, item.unit,
            item.purchasePrice ? item.purchasePrice.toFixed(2) : "-",
            item.salePrice ? item.salePrice.toFixed(2) : "-",
          ]),
        );
      } else {
        y = addPDFTable(doc, y,
          [["Nr.", "Artikulli", "Njësia", "Cmimi Shitje (EUR)"]],
          items.map((item, i) => [
            String(i + 1), item.name, item.unit,
            item.salePrice ? item.salePrice.toFixed(2) : "-",
          ]),
        );
      }
      y += 5;
    });
    addAllFooters(doc, "Elektronova - Katalogu");
    doc.save(`Elektronova_Katalogu_${date}.pdf`);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Katalogu i Artikujve</h1>
            <p className="text-muted-foreground mt-1">
              {isAdmin ? "Menaxho artikujt, njësitë dhe çmimet (Admin)" : "Shiko artikujt dhe çmimet e shitjes"}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" onClick={generateCatalogPDF} data-testid="button-pdf-catalog">
              <FileDown className="h-4 w-4 mr-2" /> Shkarko PDF
            </Button>
            {isAdmin && (
              <div className="flex rounded-lg border overflow-hidden">
                <button
                  onClick={() => setActiveTab("catalog")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "catalog" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted/50"}`}
                  data-testid="button-tab-catalog"
                >
                  <Package className="w-4 h-4 inline mr-1" /> Katalogu
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "users" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted/50"}`}
                  data-testid="button-tab-users"
                >
                  <Users className="w-4 h-4 inline mr-1" /> Përdoruesit
                </button>
                <button
                  onClick={() => setActiveTab("profits")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === "profits" ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted/50"}`}
                  data-testid="button-tab-profits"
                >
                  <TrendingUp className="w-4 h-4 inline mr-1" /> Fitimet
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">{(catalog || []).length} artikuj</span>
            </div>
          </div>
        </div>

        {activeTab === "users" && isAdmin ? (
          <UserManagement />
        ) : activeTab === "profits" && isAdmin ? (
          <ProfitDashboard />
        ) : isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
        ) : (
          <Tabs defaultValue={CATEGORIES[0]}>
            <div className="overflow-x-auto pb-2">
              <TabsList className="flex w-max min-w-full">
                {CATEGORIES.map(c => (
                  <TabsTrigger key={c} value={c} className="text-xs">{c} ({grouped[c]?.length || 0})</TabsTrigger>
                ))}
              </TabsList>
            </div>

            {CATEGORIES.map(cat => (
              <TabsContent key={cat} value={cat}>
                <Card>
                  <CardContent className="pt-4">
                    <div className="hidden sm:grid grid-cols-7 gap-2 p-2 text-xs font-bold text-muted-foreground border-b mb-2">
                      <span className="col-span-2">Emri</span>
                      <span>Njësia</span>
                      <span>{isAdmin ? "Çmimi Blerjes" : "-"}</span>
                      <span>Çmimi Shitjes</span>
                      <span className="col-span-2">Veprime</span>
                    </div>

                    <div className="space-y-1">
                      {(grouped[cat] || []).map((item: CatalogItem) => (
                        <CatalogRow key={item.id} item={item} isAdmin={isAdmin} />
                      ))}
                    </div>

                    {isAdmin && (addingTo === cat ? (
                      <div className="mt-3">
                        <AddItemForm category={cat} onDone={() => setAddingTo(null)} />
                      </div>
                    ) : (
                      <Button variant="outline" className="mt-3 w-full border-dashed" onClick={() => setAddingTo(cat)} data-testid={`button-add-to-${cat}`}>
                        <Plus className="mr-2" /> Shto artikull te "{cat}"
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </Layout>
  );
}
