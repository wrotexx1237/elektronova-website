import { Layout } from "@/components/layout";
import { useCatalog, useCreateCatalogItem, useUpdateCatalogItem, useDeleteCatalogItem } from "@/hooks/use-catalog";
import { CATEGORIES, UNITS, type CatalogItem, type Job, JOB_CATEGORY_LABELS } from "@shared/schema";
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
import { Plus, Trash2, Edit, Loader2, Package, Save, Lock, TrendingUp, Users, DollarSign, ShoppingCart, BarChart3 } from "lucide-react";
import { useState } from "react";

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

interface JobTotals {
  clientName: string;
  category: string;
  workDate: string;
  totalSale: number;
  totalPurchase: number;
  profit: number;
  jobId: number;
}

function calculateJobTotals(job: Job): JobTotals {
  const prices = (job.prices || {}) as Record<string, number>;
  const purchasePrices = (job.purchasePrices || {}) as Record<string, number>;

  let totalSale = 0;
  let totalPurchase = 0;

  const table1Data = (job.table1Data || {}) as Record<string, Record<string, number>>;
  Object.entries(table1Data).forEach(([itemName, rooms]) => {
    const qty = Object.values(rooms || {}).reduce((a, b) => a + (b || 0), 0);
    if (qty > 0) {
      totalSale += qty * (prices[itemName] || 0);
      totalPurchase += qty * (purchasePrices[itemName] || 0);
    }
  });

  const simpleFields = ['table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'] as const;
  simpleFields.forEach(field => {
    const data = (job[field] || {}) as Record<string, number>;
    Object.entries(data).forEach(([itemName, qty]) => {
      if (qty > 0) {
        totalSale += qty * (prices[itemName] || 0);
        totalPurchase += qty * (purchasePrices[itemName] || 0);
      }
    });
  });

  return {
    clientName: job.clientName,
    category: job.category || 'electric',
    workDate: job.workDate,
    totalSale,
    totalPurchase,
    profit: totalSale - totalPurchase,
    jobId: job.id,
  };
}

function ProfitDashboard() {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  const jobsList: Job[] = jobs || [];
  const allTotals = jobsList.map(calculateJobTotals);

  const grandTotalSale = allTotals.reduce((s, t) => s + t.totalSale, 0);
  const grandTotalPurchase = allTotals.reduce((s, t) => s + t.totalPurchase, 0);
  const grandProfit = grandTotalSale - grandTotalPurchase;
  const profitMargin = grandTotalSale > 0 ? (grandProfit / grandTotalSale) * 100 : 0;

  return (
    <div className="space-y-6">
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
              <span className="text-xs text-muted-foreground">Fitimi Total ({profitMargin.toFixed(1)}%)</span>
            </div>
            <p className="text-2xl font-black text-green-600" data-testid="text-grand-profit">{grandProfit.toFixed(2)} €</p>
          </CardContent>
        </Card>
      </div>

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
          <div className="space-y-1">
            {allTotals.length === 0 && (
              <p className="text-muted-foreground text-center text-sm py-6">Nuk ka pune te regjistruara.</p>
            )}
            {allTotals.map(t => (
              <div key={t.jobId} className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-muted/20 text-sm">
                <span className="col-span-3 font-medium truncate" data-testid={`text-client-${t.jobId}`}>{t.clientName}</span>
                <span className="col-span-2 text-xs text-muted-foreground">{JOB_CATEGORY_LABELS[t.category as keyof typeof JOB_CATEGORY_LABELS] || t.category}</span>
                <span className="col-span-1 text-xs text-muted-foreground">{t.workDate}</span>
                <span className="col-span-2 text-right font-medium text-primary" data-testid={`text-sale-${t.jobId}`}>{t.totalSale.toFixed(2)} €</span>
                <span className="col-span-2 text-right font-medium text-amber-600" data-testid={`text-purchase-${t.jobId}`}>{t.totalPurchase.toFixed(2)} €</span>
                <span className={`col-span-2 text-right font-bold ${t.profit >= 0 ? 'text-green-600' : 'text-destructive'}`} data-testid={`text-profit-${t.jobId}`}>{t.profit.toFixed(2)} €</span>
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
          <div className="flex items-center gap-3">
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

        {activeTab === "profits" && isAdmin ? (
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
