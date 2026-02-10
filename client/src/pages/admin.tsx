import { Layout } from "@/components/layout";
import { useCatalog, useCreateCatalogItem, useUpdateCatalogItem, useDeleteCatalogItem } from "@/hooks/use-catalog";
import { CATEGORIES, UNITS, type CatalogItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit, Loader2, Package, Save } from "lucide-react";
import { useState } from "react";

function AddItemForm({ category, onDone }: { category: string; onDone: () => void }) {
  const create = useCreateCatalogItem();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("copë");
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [servicePrice, setServicePrice] = useState(0);

  const handleSubmit = () => {
    if (!name.trim()) return;
    create.mutate({
      category, name: name.trim(), unit, purchasePrice, servicePrice, notes: null, sortOrder: 0,
    }, { onSuccess: () => { setName(""); setPurchasePrice(0); setServicePrice(0); onDone(); } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-3 bg-muted/30 rounded-lg border border-dashed">
      <Input data-testid="input-catalog-name" placeholder="Emri i artikullit" value={name} onChange={e => setName(e.target.value)} className="sm:col-span-2" />
      <Select value={unit} onValueChange={setUnit}>
        <SelectTrigger data-testid="select-unit"><SelectValue /></SelectTrigger>
        <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
      </Select>
      <Input data-testid="input-purchase-price" type="number" step="0.01" placeholder="Cmim blerje" value={purchasePrice || ""} onChange={e => setPurchasePrice(parseFloat(e.target.value) || 0)} />
      <Button data-testid="button-add-item" onClick={handleSubmit} disabled={create.isPending || !name.trim()}>
        {create.isPending ? <Loader2 className="animate-spin" /> : <Plus className="mr-1" />} Shto
      </Button>
    </div>
  );
}

function CatalogRow({ item }: { item: CatalogItem }) {
  const update = useUpdateCatalogItem();
  const del = useDeleteCatalogItem();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [unit, setUnit] = useState(item.unit);
  const [pp, setPp] = useState(item.purchasePrice || 0);
  const [sp, setSp] = useState(item.servicePrice || 0);

  const handleSave = () => {
    update.mutate({ id: item.id, name, unit, purchasePrice: pp, servicePrice: sp }, { onSuccess: () => setEditing(false) });
  };

  if (editing) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-2 bg-primary/5 rounded border border-primary/20 items-center">
        <Input value={name} onChange={e => setName(e.target.value)} className="sm:col-span-2" />
        <Select value={unit} onValueChange={setUnit}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
        </Select>
        <Input type="number" step="0.01" value={pp || ""} onChange={e => setPp(parseFloat(e.target.value) || 0)} placeholder="Blerje" />
        <Input type="number" step="0.01" value={sp || ""} onChange={e => setSp(parseFloat(e.target.value) || 0)} placeholder="Sherbim" />
        <div className="flex gap-1">
          <Button size="sm" onClick={handleSave} disabled={update.isPending}><Save className="w-3 h-3 mr-1" /> Ruaj</Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>X</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 p-2 rounded items-center hover:bg-muted/30 group">
      <span className="font-medium sm:col-span-2 text-sm">{item.name}</span>
      <span className="text-xs text-muted-foreground uppercase">{item.unit}</span>
      <span className="text-xs">{item.purchasePrice ? `${item.purchasePrice.toFixed(2)} €` : "-"}</span>
      <span className="text-xs">{item.servicePrice ? `${item.servicePrice.toFixed(2)} €` : "-"}</span>
      <div className="flex gap-1 invisible group-hover:visible">
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
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: catalog, isLoading } = useCatalog();
  const [addingTo, setAddingTo] = useState<string | null>(null);

  const grouped = (catalog || []).reduce((acc: Record<string, CatalogItem[]>, item: CatalogItem) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CatalogItem[]>);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Katalogu i Artikujve</h1>
            <p className="text-muted-foreground mt-1">Menaxho artikujt, njësitë dhe çmimet</p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-lg">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">{(catalog || []).length} artikuj</span>
          </div>
        </div>

        {isLoading ? (
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
                    <div className="hidden sm:grid grid-cols-6 gap-2 p-2 text-xs font-bold text-muted-foreground border-b mb-2">
                      <span className="col-span-2">Emri</span>
                      <span>Njësia</span>
                      <span>Blerje</span>
                      <span>Shërbim</span>
                      <span>Veprime</span>
                    </div>

                    <div className="space-y-1">
                      {(grouped[cat] || []).map((item: CatalogItem) => (
                        <CatalogRow key={item.id} item={item} />
                      ))}
                    </div>

                    {addingTo === cat ? (
                      <div className="mt-3">
                        <AddItemForm category={cat} onDone={() => setAddingTo(null)} />
                      </div>
                    ) : (
                      <Button variant="outline" className="mt-3 w-full border-dashed" onClick={() => setAddingTo(cat)} data-testid={`button-add-to-${cat}`}>
                        <Plus className="mr-2" /> Shto artikull te "{cat}"
                      </Button>
                    )}
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
