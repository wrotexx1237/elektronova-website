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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search, Plus, Phone, MapPin, Mail, FileText, Truck, Trash2, Edit2, Tags,
  DollarSign, ArrowUpDown, TrendingDown, TrendingUp, BarChart3, ChevronDown, ChevronUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Supplier, CatalogItem, SupplierPrice } from "@shared/schema";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [priceSupplier, setPriceSupplier] = useState<Supplier | null>(null);
  const [activeTab, setActiveTab] = useState("suppliers");
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { data: allSuppliers = [], isLoading } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: catalogItems = [] } = useQuery<CatalogItem[]>({
    queryKey: ["/api/catalog"],
  });

  const { data: allSupplierPrices = [] } = useQuery<SupplierPrice[]>({
    queryKey: ["/api/supplier-prices"],
  });

  const { data: comparisonData = [] } = useQuery<any[]>({
    queryKey: ["/api/supplier-prices/comparison"],
  });

  const suppliers = search
    ? allSuppliers.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.phone && s.phone.includes(search)) ||
        (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
        (s.address && s.address.toLowerCase().includes(search.toLowerCase()))
      )
    : allSuppliers;

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; email: string; address: string; categories: string[]; notes: string }) => {
      const res = await apiRequest("POST", "/api/suppliers", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      setShowAddDialog(false);
      toast({ title: "Furnitori u shtua me sukses" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/suppliers/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      setEditSupplier(null);
      toast({ title: "Furnitori u përditësua" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-prices/comparison"] });
      toast({ title: "Furnitori u fshi" });
    },
  });

  const supplierPriceCount = (supplierId: number) =>
    allSupplierPrices.filter(sp => sp.supplierId === supplierId).length;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-suppliers-title">Paneli i Furnitorëve</h1>
            <p className="text-muted-foreground" data-testid="text-suppliers-count">{allSuppliers.length} furnitorë të regjistruar</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-supplier">
            <Plus className="h-4 w-4 mr-2" /> Shto Furnitor
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList data-testid="tabs-suppliers">
            <TabsTrigger value="suppliers" data-testid="tab-suppliers-list">
              <Truck className="h-4 w-4 mr-1.5" /> Furnitorët
            </TabsTrigger>
            <TabsTrigger value="comparison" data-testid="tab-price-comparison">
              <BarChart3 className="h-4 w-4 mr-1.5" /> Krahasimi i Çmimeve
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kërko furnitor sipas emrit, telefonit, emailit ose adresës..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                data-testid="input-search-suppliers"
              />
            </div>

            {isLoading ? (
              <p className="text-muted-foreground" data-testid="text-loading">Duke u ngarkuar...</p>
            ) : suppliers.length === 0 ? (
              <Card data-testid="card-empty-state">
                <CardContent className="p-6 text-center text-muted-foreground">
                  {search ? "Asnjë rezultat" : "Asnjë furnitor i regjistruar"}
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suppliers.map(supplier => (
                  <Card
                    key={supplier.id}
                    className="hover-elevate"
                    data-testid={`card-supplier-${supplier.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="font-semibold" data-testid={`text-supplier-name-${supplier.id}`}>{supplier.name}</h3>
                          {supplier.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 shrink-0" />
                              <a href={`tel:${supplier.phone}`} className="text-primary hover:underline" data-testid={`text-supplier-phone-${supplier.id}`}>
                                {supplier.phone}
                              </a>
                            </div>
                          )}
                          {supplier.email && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3 shrink-0" />
                              <a href={`mailto:${supplier.email}`} className="text-primary hover:underline truncate" data-testid={`text-supplier-email-${supplier.id}`}>
                                {supplier.email}
                              </a>
                            </div>
                          )}
                          {supplier.address && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span data-testid={`text-supplier-address-${supplier.id}`}>{supplier.address}</span>
                            </div>
                          )}
                          {supplier.categories && (supplier.categories as string[]).length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap mt-2">
                              <Tags className="h-3 w-3 text-muted-foreground shrink-0" />
                              {(supplier.categories as string[]).map((cat, i) => (
                                <Badge key={i} variant="secondary" className="text-xs no-default-active-elevate" data-testid={`badge-supplier-category-${supplier.id}-${i}`}>
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {supplier.notes && (
                            <div className="flex items-start gap-1.5 text-sm text-muted-foreground mt-1">
                              <FileText className="h-3 w-3 shrink-0 mt-0.5" />
                              <span className="line-clamp-2" data-testid={`text-supplier-notes-${supplier.id}`}>{supplier.notes}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-sm mt-2">
                            <DollarSign className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground" data-testid={`text-supplier-price-count-${supplier.id}`}>
                              {supplierPriceCount(supplier.id)} produkte me çmim
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button size="icon" variant="ghost" onClick={() => setPriceSupplier(supplier)}
                            data-testid={`button-prices-supplier-${supplier.id}`}>
                            <DollarSign className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setEditSupplier(supplier)}
                            data-testid={`button-edit-supplier-${supplier.id}`}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button size="icon" variant="ghost" onClick={() => {
                              if (confirm("Fshi këtë furnitor?")) deleteMutation.mutate(supplier.id);
                            }} data-testid={`button-delete-supplier-${supplier.id}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <PriceComparisonView
              comparisonData={comparisonData}
              allSuppliers={allSuppliers}
              catalogItems={catalogItems}
            />
          </TabsContent>
        </Tabs>

        <SupplierFormDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />

        {editSupplier && (
          <SupplierFormDialog
            open={!!editSupplier}
            onClose={() => setEditSupplier(null)}
            supplier={editSupplier}
            onSubmit={(data) => updateMutation.mutate({ id: editSupplier.id, data })}
            isLoading={updateMutation.isPending}
          />
        )}

        {priceSupplier && (
          <SupplierPricesDialog
            open={!!priceSupplier}
            onClose={() => setPriceSupplier(null)}
            supplier={priceSupplier}
            catalogItems={catalogItems}
            allSupplierPrices={allSupplierPrices}
            allSuppliers={allSuppliers}
          />
        )}
      </div>
    </Layout>
  );
}

function PriceComparisonView({ comparisonData, allSuppliers, catalogItems }: {
  comparisonData: any[];
  allSuppliers: Supplier[];
  catalogItems: CatalogItem[];
}) {
  const [searchComparison, setSearchComparison] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const categories = [...new Set(catalogItems.map(c => c.category))];

  const filtered = comparisonData.filter(item => {
    const matchSearch = !searchComparison ||
      item.catalogItem.name.toLowerCase().includes(searchComparison.toLowerCase());
    const matchCategory = categoryFilter === "all" || item.catalogItem.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  if (comparisonData.length === 0) {
    return (
      <Card data-testid="card-empty-comparison">
        <CardContent className="p-6 text-center text-muted-foreground">
          Asnjë çmim furnitori nuk është vendosur ende. Shtoni çmime duke klikuar butonin e çmimeve tek secili furnitor.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kërko produkt..."
            value={searchComparison}
            onChange={(e) => setSearchComparison(e.target.value)}
            className="pl-10"
            data-testid="input-search-comparison"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Të gjitha</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const minPrice = item.suppliers.length > 0 ? item.suppliers[0].price : 0;
          const maxPrice = item.suppliers.length > 0 ? item.suppliers[item.suppliers.length - 1].price : 0;
          const priceDiff = maxPrice - minPrice;
          const isExpanded = expandedItem === item.catalogItem.id;

          return (
            <Card key={item.catalogItem.id} data-testid={`card-comparison-${item.catalogItem.id}`}>
              <CardContent className="p-0">
                <button
                  type="button"
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover-elevate rounded-md"
                  onClick={() => setExpandedItem(isExpanded ? null : item.catalogItem.id)}
                  data-testid={`button-toggle-comparison-${item.catalogItem.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{item.catalogItem.name}</span>
                      <Badge variant="secondary" className="text-xs no-default-active-elevate">
                        {item.catalogItem.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs no-default-active-elevate">
                        {item.suppliers.length} furnitorë
                      </Badge>
                    </div>
                    {item.suppliers.length > 0 && (
                      <div className="mt-1.5 text-sm">
                        <span className="text-green-700 dark:text-green-400 font-medium">
                          Furnitori më i lirë: {item.suppliers[0].supplier.name} — {minPrice.toFixed(2)} €
                        </span>
                        {priceDiff > 0 && (
                          <span className="text-muted-foreground ml-2">
                            (kurseni {priceDiff.toFixed(2)} € nga më i shtrenjtë)
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-green-600 dark:text-green-400" />
                        Min: {minPrice.toFixed(2)} €
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-red-500 dark:text-red-400" />
                        Max: {maxPrice.toFixed(2)} €
                      </span>
                      {priceDiff > 0 && (
                        <span className="flex items-center gap-1">
                          <ArrowUpDown className="h-3 w-3" />
                          Diferenca: {priceDiff.toFixed(2)} €
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    <div className="border-t pt-3">
                      {item.suppliers.map((sp: any, idx: number) => {
                        const isCheapest = idx === 0;
                        const diffFromCheapest = sp.price - minPrice;

                        return (
                          <div
                            key={sp.supplier.id}
                            className={`flex items-center justify-between gap-3 py-2 px-3 rounded-md ${isCheapest ? 'bg-green-50 dark:bg-green-950/30' : ''}`}
                            data-testid={`row-supplier-price-${item.catalogItem.id}-${sp.supplier.id}`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-medium text-sm">{sp.supplier.name}</span>
                              {isCheapest && item.suppliers.length > 1 && (
                                <Badge variant="default" className="text-xs no-default-active-elevate">
                                  Më i lirë
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-semibold">{sp.price.toFixed(2)} &euro;</span>
                              {!isCheapest && (
                                <span className="text-xs text-red-500 dark:text-red-400">
                                  +{diffFromCheapest.toFixed(2)} &euro;
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Asnjë rezultat për këtë kërkim
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SupplierPricesDialog({ open, onClose, supplier, catalogItems, allSupplierPrices, allSuppliers }: {
  open: boolean;
  onClose: () => void;
  supplier: Supplier;
  catalogItems: CatalogItem[];
  allSupplierPrices: SupplierPrice[];
  allSuppliers: Supplier[];
}) {
  const { toast } = useToast();
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<string>("");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [searchItem, setSearchItem] = useState("");

  const supplierPrices = allSupplierPrices.filter(sp => sp.supplierId === supplier.id);

  const catalogMap = new Map(catalogItems.map(c => [c.id, c]));
  const supplierMap = new Map(allSuppliers.map(s => [s.id, s]));

  const saveMutation = useMutation({
    mutationFn: async (data: { supplierId: number; catalogItemId: number; price: number; notes: string | null }) => {
      const res = await apiRequest("POST", "/api/supplier-prices", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-prices/comparison"] });
      setSelectedCatalogItem("");
      setPrice("");
      setNotes("");
      toast({ title: "Çmimi u ruajt" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/supplier-prices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-prices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/supplier-prices/comparison"] });
      toast({ title: "Çmimi u fshi" });
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalogItem || !price) return;
    saveMutation.mutate({
      supplierId: supplier.id,
      catalogItemId: parseInt(selectedCatalogItem),
      price: parseFloat(price),
      notes: notes || null,
    });
  };

  const supplierCategories = (supplier.categories as string[] | null) || [];

  const categoryFilteredCatalog = supplierCategories.length > 0
    ? catalogItems.filter(c => {
        const catLower = c.category.toLowerCase();
        return supplierCategories.some(sc => {
          const scLower = sc.toLowerCase();
          return catLower.startsWith(scLower) || scLower.startsWith(catLower);
        });
      })
    : catalogItems;

  const filteredCatalog = searchItem
    ? categoryFilteredCatalog.filter(c => c.name.toLowerCase().includes(searchItem.toLowerCase()))
    : categoryFilteredCatalog;

  const getOtherSupplierPrices = (catalogItemId: number) => {
    return allSupplierPrices
      .filter(sp => sp.catalogItemId === catalogItemId && sp.supplierId !== supplier.id)
      .map(sp => ({
        ...sp,
        supplierName: supplierMap.get(sp.supplierId)?.name || "I panjohur",
      }))
      .sort((a, b) => a.price - b.price);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-supplier-prices-title">
            Çmimet e Furnitorit: {supplier.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-3 border-b pb-4">
          <p className="text-sm text-muted-foreground">Shto ose përditëso çmimin për një produkt</p>
          <div className="space-y-2">
            <Label>Produkti</Label>
            <Select value={selectedCatalogItem} onValueChange={setSelectedCatalogItem}>
              <SelectTrigger data-testid="select-catalog-item">
                <SelectValue placeholder="Zgjidhni produktin" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Kërko produkt..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    data-testid="input-search-catalog-item"
                  />
                </div>
                {filteredCatalog.map(item => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name} ({item.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label>Çmimi (&euro;)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                data-testid="input-supplier-price"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Shënim</Label>
              <Input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Opsionale"
                data-testid="input-supplier-price-notes"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={!selectedCatalogItem || !price || saveMutation.isPending}
            data-testid="button-save-price"
          >
            {saveMutation.isPending ? "Duke u ruajtur..." : "Ruaj Çmimin"}
          </Button>
        </form>

        {selectedCatalogItem && (
          <ComparisonPreview
            catalogItemId={parseInt(selectedCatalogItem)}
            currentSupplierId={supplier.id}
            currentPrice={price ? parseFloat(price) : undefined}
            allSupplierPrices={allSupplierPrices}
            supplierMap={supplierMap}
            catalogMap={catalogMap}
          />
        )}

        <div className="space-y-2 mt-4">
          <h3 className="font-medium text-sm text-muted-foreground">Çmimet aktuale ({supplierPrices.length})</h3>
          {supplierPrices.length === 0 ? (
            <p className="text-sm text-muted-foreground">Asnjë çmim i vendosur</p>
          ) : (
            <div className="space-y-2">
              {supplierPrices.map(sp => {
                const catItem = catalogMap.get(sp.catalogItemId);
                const otherPrices = getOtherSupplierPrices(sp.catalogItemId);
                const cheapestOther = otherPrices.length > 0 ? otherPrices[0].price : null;
                const isCheapest = cheapestOther === null || sp.price <= cheapestOther;
                const diffFromCheapest = cheapestOther !== null ? sp.price - cheapestOther : 0;

                return (
                  <Card key={sp.id} data-testid={`card-supplier-price-${sp.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm">{catItem?.name || "?"}</span>
                            <Badge variant="secondary" className="text-xs no-default-active-elevate">
                              {catItem?.category}
                            </Badge>
                            {isCheapest && otherPrices.length > 0 && (
                              <Badge variant="default" className="text-xs no-default-active-elevate">
                                Më i lirë
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className="font-semibold">{sp.price.toFixed(2)} &euro;</span>
                            {!isCheapest && cheapestOther !== null && (
                              <span className="text-xs text-red-500 dark:text-red-400">
                                +{diffFromCheapest.toFixed(2)} &euro; nga më i liri ({otherPrices[0].supplierName})
                              </span>
                            )}
                            {isCheapest && otherPrices.length > 0 && (
                              <span className="text-xs text-green-600 dark:text-green-400">
                                {(cheapestOther! - sp.price + (otherPrices.length > 1 ? 0 : diffFromCheapest)).toFixed(2) !== "0.00"
                                  ? `Kurseni ${(otherPrices[otherPrices.length - 1].price - sp.price).toFixed(2)} € vs më i shtrenjti`
                                  : "Çmimi më i mirë"
                                }
                              </span>
                            )}
                          </div>
                          {sp.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{sp.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCatalogItem(String(sp.catalogItemId));
                              setPrice(String(sp.price));
                              setNotes(sp.notes || "");
                            }}
                            data-testid={`button-edit-price-${sp.id}`}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              if (confirm("Fshi këtë çmim?")) deleteMutation.mutate(sp.id);
                            }}
                            data-testid={`button-delete-price-${sp.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ComparisonPreview({ catalogItemId, currentSupplierId, currentPrice, allSupplierPrices, supplierMap, catalogMap }: {
  catalogItemId: number;
  currentSupplierId: number;
  currentPrice?: number;
  allSupplierPrices: SupplierPrice[];
  supplierMap: Map<number, Supplier>;
  catalogMap: Map<number, CatalogItem>;
}) {
  const otherPrices = allSupplierPrices
    .filter(sp => sp.catalogItemId === catalogItemId && sp.supplierId !== currentSupplierId)
    .map(sp => ({
      ...sp,
      supplierName: supplierMap.get(sp.supplierId)?.name || "?",
    }))
    .sort((a, b) => a.price - b.price);

  if (otherPrices.length === 0) return null;

  const catItem = catalogMap.get(catalogItemId);

  return (
    <Card className="border-dashed" data-testid="card-comparison-preview">
      <CardContent className="p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <ArrowUpDown className="h-3 w-3" />
          Krahasimi me furnitorë të tjerë për: {catItem?.name}
        </p>
        {otherPrices.map(op => {
          const diff = currentPrice ? currentPrice - op.price : null;
          return (
            <div key={op.id} className="flex items-center justify-between gap-2 text-sm">
              <span>{op.supplierName}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{op.price.toFixed(2)} &euro;</span>
                {diff !== null && diff !== 0 && (
                  <span className={`text-xs ${diff > 0 ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} &euro;
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function SupplierFormDialog({ open, onClose, supplier, onSubmit, isLoading }: {
  open: boolean;
  onClose: () => void;
  supplier?: Supplier;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState(supplier?.name || "");
  const [phone, setPhone] = useState(supplier?.phone || "");
  const [email, setEmail] = useState(supplier?.email || "");
  const [address, setAddress] = useState(supplier?.address || "");
  const [categoriesText, setCategoriesText] = useState(
    supplier?.categories ? (supplier.categories as string[]).join(", ") : ""
  );
  const [notes, setNotes] = useState(supplier?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categories = categoriesText
      .split(",")
      .map(c => c.trim())
      .filter(c => c.length > 0);
    onSubmit({ name, phone, email, address, categories, notes });
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle data-testid="text-supplier-dialog-title">
            {supplier ? "Ndrysho Furnitorin" : "Shto Furnitor të Ri"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Emri *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required data-testid="input-supplier-name" />
          </div>
          <div className="space-y-2">
            <Label>Telefoni</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} data-testid="input-supplier-phone" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} type="email" data-testid="input-supplier-email" />
          </div>
          <div className="space-y-2">
            <Label>Adresa</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} data-testid="input-supplier-address" />
          </div>
          <div className="space-y-2">
            <Label>Kategoritë (ndaj me presje)</Label>
            <Input
              value={categoriesText}
              onChange={e => setCategoriesText(e.target.value)}
              placeholder="p.sh. Kabllo, Kamera, Material"
              data-testid="input-supplier-categories"
            />
          </div>
          <div className="space-y-2">
            <Label>Shënime</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} data-testid="input-supplier-notes" />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !name} data-testid="button-save-supplier">
            {isLoading ? "Duke u ruajtur..." : "Ruaj"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
