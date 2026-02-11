import { Layout } from "@/components/layout";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, AlertTriangle, Plus, Minus, ArrowUpDown, Search, TrendingDown, History } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { CatalogItem, StockEntry } from "@shared/schema";
import { CATEGORIES } from "@shared/schema";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [stockAction, setStockAction] = useState<"in" | "out" | "adjustment">("in");
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { data: catalog = [] } = useQuery<CatalogItem[]>({
    queryKey: ["/api/catalog"],
  });

  const { data: lowStockItems = [] } = useQuery<CatalogItem[]>({
    queryKey: ["/api/stock/low"],
  });

  const { data: stockHistory = [] } = useQuery<StockEntry[]>({
    queryKey: ["/api/stock", selectedItem?.id],
    queryFn: async () => {
      if (!selectedItem) return [];
      const res = await fetch(`/api/stock?catalogItemId=${selectedItem.id}`, { credentials: "include" });
      return res.json();
    },
    enabled: !!selectedItem,
  });

  const stockMutation = useMutation({
    mutationFn: async (data: { catalogItemId: number; quantity: number; entryType: string; notes: string }) => {
      const res = await apiRequest("POST", "/api/stock/entry", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/catalog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stock"] });
      setShowStockDialog(false);
      toast({ title: "Stoku u përditësua" });
    },
  });

  const filteredCatalog = catalog.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalItems = catalog.length;
  const itemsWithStock = catalog.filter(i => (i.currentStock || 0) > 0).length;
  const lowCount = lowStockItems.length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-inventory-title">Menaxhimi i Stokut</h1>
            <p className="text-muted-foreground">{totalItems} artikuj në katalog</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-items-with-stock">{itemsWithStock}</p>
                <p className="text-sm text-muted-foreground">Artikuj me stok</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold" data-testid="text-low-stock-count">{lowCount}</p>
                <p className="text-sm text-muted-foreground">Stok i ulët</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold">{totalItems - itemsWithStock}</p>
                <p className="text-sm text-muted-foreground">Pa stok</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {lowStockItems.length > 0 && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Paralajmërim: Stok i Ulët
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map(item => (
                  <Badge key={item.id} variant="outline" className="border-amber-500/50" data-testid={`badge-low-stock-${item.id}`}>
                    {item.name}: {item.currentStock} {item.unit}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Kërko artikull..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10" data-testid="input-search-inventory" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
              <SelectValue placeholder="Kategoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të gjitha</SelectItem>
              {CATEGORIES.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredCatalog.map(item => (
            <Card key={item.id} data-testid={`card-inventory-${item.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium" data-testid={`text-item-name-${item.id}`}>{item.name}</span>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Njësia: {item.unit} | Min: {item.minStockLevel || 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`text-lg font-bold ${
                        (item.currentStock || 0) <= (item.minStockLevel || 0) && (item.minStockLevel || 0) > 0
                          ? 'text-amber-500'
                          : ''
                      }`} data-testid={`text-stock-${item.id}`}>
                        {item.currentStock || 0}
                      </span>
                      <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                    </div>

                    <div className="flex gap-1">
                      <Button size="icon" variant="outline"
                        onClick={() => { setSelectedItem(item); setStockAction("in"); setShowStockDialog(true); }}
                        data-testid={`button-stock-in-${item.id}`}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline"
                        onClick={() => { setSelectedItem(item); setStockAction("out"); setShowStockDialog(true); }}
                        data-testid={`button-stock-out-${item.id}`}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost"
                        onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                        data-testid={`button-stock-history-${item.id}`}>
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {selectedItem?.id === item.id && stockHistory.length > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <h4 className="text-sm font-semibold">Historiku i Stokut</h4>
                    {stockHistory.slice(0, 10).map(entry => (
                      <div key={entry.id} className="flex items-center justify-between text-sm py-1 border-b border-dashed last:border-0">
                        <div className="flex items-center gap-2">
                          <Badge variant={entry.entryType === "in" ? "default" : "secondary"}>
                            {entry.entryType === "in" ? "Hyrje" : entry.entryType === "out" ? "Dalje" : "Rregullim"}
                          </Badge>
                          <span>{entry.quantity} {item.unit}</span>
                          {entry.notes && <span className="text-muted-foreground">- {entry.notes}</span>}
                        </div>
                        <div className="text-muted-foreground">
                          {entry.previousStock} → {entry.newStock}
                          <span className="ml-2">{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString('sq') : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {showStockDialog && selectedItem && (
          <StockEntryDialog
            open={showStockDialog}
            onClose={() => setShowStockDialog(false)}
            item={selectedItem}
            defaultType={stockAction}
            onSubmit={(data) => stockMutation.mutate(data)}
            isLoading={stockMutation.isPending}
          />
        )}
      </div>
    </Layout>
  );
}

function StockEntryDialog({ open, onClose, item, defaultType, onSubmit, isLoading }: {
  open: boolean;
  onClose: () => void;
  item: CatalogItem;
  defaultType: "in" | "out" | "adjustment";
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [quantity, setQuantity] = useState("");
  const [entryType, setEntryType] = useState(defaultType);
  const [notes, setNotes] = useState("");

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {entryType === "in" ? "Shtim Stoku" : entryType === "out" ? "Zbritje Stoku" : "Rregullim"} - {item.name}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ catalogItemId: item.id, quantity: parseFloat(quantity), entryType, notes });
        }} className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Stoku aktual: <strong>{item.currentStock || 0} {item.unit}</strong>
          </div>
          <div className="space-y-2">
            <Label>Tipi</Label>
            <Select value={entryType} onValueChange={(v) => setEntryType(v as any)}>
              <SelectTrigger data-testid="select-stock-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">Hyrje (Blerje)</SelectItem>
                <SelectItem value="out">Dalje (Shpenzim)</SelectItem>
                <SelectItem value="adjustment">Rregullim Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{entryType === "adjustment" ? "Sasia e re totale" : "Sasia"}</Label>
            <Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)}
              step="0.01" min="0" required data-testid="input-stock-quantity" />
          </div>
          <div className="space-y-2">
            <Label>Shënime</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} data-testid="input-stock-notes" />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !quantity}
            data-testid="button-save-stock-entry">
            {isLoading ? "Duke u ruajtur..." : "Ruaj"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
