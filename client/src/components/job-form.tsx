import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  insertJobSchema, ROOMS, WORK_TYPES, JOB_CATEGORY_LABELS, JOB_STATUS_LABELS,
  CHECKLIST_ELEKTRIKE, CHECKLIST_KAMERA, CHECKLIST_ALARM, CHECKLIST_INTERFON, CHECKLIST_FINAL,
  type InsertJob, type CatalogItem, type JobCategory, type JobStatus
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Save, FileDown, ArrowLeft, Loader2, Banknote, Camera, PhoneCall,
  Package, Info, Settings, ShieldAlert, Wrench, CheckCircle2, AlertTriangle, Zap, Phone,
  ChevronDown, ShoppingCart, FileText, Eye, EyeOff, Percent, Hash, Tag,
  MapPin, Send, FileSignature, CalendarDays, Star, MessageSquare, Link2, Copy, ExternalLink,
  Award, ClipboardList, FileCheck, Hammer, CircleCheck
} from "lucide-react";
import { Link } from "wouter";
import { useCatalog } from "@/hooks/use-catalog";
import { useAdmin } from "@/hooks/use-admin";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import type { Feedback, Supplier, SupplierPrice } from "@shared/schema";
import { MapDialog } from "@/components/map-dialog";
import { ShareDialog } from "@/components/share-dialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formSchema = insertJobSchema;
type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  initialData?: any;
  onSubmit: (data: InsertJob) => void;
  isPending: boolean;
  title: string;
  defaultCategory?: JobCategory;
}

const CATEGORY_ICON_MAP: Record<string, typeof Zap> = {
  electric: Zap,
  camera: Camera,
  alarm: ShieldAlert,
  intercom: Phone,
};

function getTabsForCategory(category: JobCategory) {
  switch (category) {
    case "electric":
      return { showPajisje: true, showMateriale: true, showKamera: false, showInterfon: false, showAlarm: false, showSherbime: true };
    case "camera":
      return { showPajisje: false, showMateriale: true, showKamera: true, showInterfon: false, showAlarm: false, showSherbime: true };
    case "alarm":
      return { showPajisje: false, showMateriale: true, showKamera: false, showInterfon: false, showAlarm: true, showSherbime: true };
    case "intercom":
      return { showPajisje: false, showMateriale: true, showKamera: false, showInterfon: true, showAlarm: false, showSherbime: true };
    default:
      return { showPajisje: true, showMateriale: true, showKamera: true, showInterfon: true, showAlarm: true, showSherbime: true };
  }
}

function getChecklistsForCategory(category: JobCategory) {
  const sections: { title: string; items: string[] }[] = [];
  switch (category) {
    case "electric":
      sections.push({ title: "Checklist Elektrike", items: CHECKLIST_ELEKTRIKE });
      break;
    case "camera":
      sections.push({ title: "Checklist Kamera", items: CHECKLIST_KAMERA });
      break;
    case "alarm":
      sections.push({ title: "Checklist Alarm", items: CHECKLIST_ALARM });
      break;
    case "intercom":
      sections.push({ title: "Checklist Interfon", items: CHECKLIST_INTERFON });
      break;
  }
  sections.push({ title: "Kontroll Final", items: CHECKLIST_FINAL });
  return sections;
}

const TOOLS_BY_MATERIAL_KEYWORD: Record<string, string[]> = {
  "priz": ["Shafciger (kaçavida)", "Dana / Trapan", "Nivel", "Metro", "Hilti (nese mur betoni)"],
  "çeles": ["Shafciger (kaçavida)", "Dana / Trapan", "Nivel", "Metro", "Hilti (nese mur betoni)"],
  "ndricues": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle", "Tester tensioni"],
  "llamp": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle", "Tester tensioni"],
  "spot": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle", "Sharre per gips", "Tester tensioni"],
  "led": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle"],
  "ventilator": ["Shafciger (kaçavida)", "Dana / Trapan", "Shkalle"],
  "tablo": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Shirit izolues", "Multimeter"],
  "sigures": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Multimeter"],
  "kontaktor": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Multimeter"],
  "rele": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Multimeter"],
  "kabllo": ["Qekiq", "Prerese kabllosh", "Shirit izolues", "Metro", "Dana / Trapan", "Hilti (nese mur betoni)"],
  "kabell": ["Qekiq", "Prerese kabllosh", "Shirit izolues", "Metro", "Dana / Trapan"],
  "gyp": ["Dana / Trapan", "Hilti (nese mur betoni)", "Sharre", "Metro", "Nivel"],
  "kanal": ["Dana / Trapan", "Hilti (nese mur betoni)", "Metro", "Nivel", "Sharre"],
  "tub": ["Dana / Trapan", "Hilti (nese mur betoni)", "Metro", "Sharre"],
  "kamera": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shkalle", "Shafciger (kaçavida)", "Laptop (per konfigurim)"],
  "dvr": ["Shafciger (kaçavida)", "Qekiq", "Prerese kabllosh", "Laptop (per konfigurim)", "Monitor"],
  "nvr": ["Shafciger (kaçavida)", "Qekiq", "Prerese kabllosh", "Laptop (per konfigurim)", "Monitor"],
  "switch": ["Shafciger (kaçavida)", "Qekiq", "Prerese kabllosh", "Laptop (per konfigurim)"],
  "alarm": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle", "Laptop (per konfigurim)"],
  "sensor": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle"],
  "siren": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle"],
  "interfon": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle", "Metro"],
  "panel": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Nivel"],
  "monitor": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Nivel", "Shkalle"],
  "brav": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)"],
  "ups": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni"],
  "stabilizator": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni"],
  "generator": ["Shafciger (kaçavida)", "Qekiq", "Tester tensioni", "Cel angleze"],
};

const TOOLS_BY_CATEGORY: Record<string, string[]> = {
  "Pajisje elektrike": ["Shafciger (kaçavida)", "Dana / Trapan", "Qekiq", "Tester tensioni", "Nivel", "Metro"],
  "Kabllo & Gypa": ["Qekiq", "Prerese kabllosh", "Dana / Trapan", "Shirit izolues", "Metro"],
  "Kamera": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shkalle", "Shafciger (kaçavida)", "Laptop (per konfigurim)"],
  "Interfon": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shkalle", "Shafciger (kaçavida)", "Metro"],
  "Alarm": ["Dana / Trapan", "Hilti (nese mur betoni)", "Shafciger (kaçavida)", "Shkalle", "Laptop (per konfigurim)"],
  "Punë/Shërbime": [],
};

function normalizeName(s: string): string {
  return s.toLowerCase()
    .replace(/ë/g, "e").replace(/ç/g, "c").replace(/é/g, "e")
    .replace(/ü/g, "u").replace(/ö/g, "o").replace(/â/g, "a");
}

function getRequiredTools(itemsWithQty: { name: string; category?: string }[]): string[] {
  const toolSet = new Set<string>();
  itemsWithQty.forEach(item => {
    const nameNorm = normalizeName(item.name);
    for (const [keyword, tools] of Object.entries(TOOLS_BY_MATERIAL_KEYWORD)) {
      if (nameNorm.includes(normalizeName(keyword))) {
        tools.forEach(t => toolSet.add(t));
      }
    }
    if (item.category && TOOLS_BY_CATEGORY[item.category]) {
      TOOLS_BY_CATEGORY[item.category].forEach(t => toolSet.add(t));
    }
  });
  if (toolSet.size === 0 && itemsWithQty.length > 0) {
    ["Shafciger (kaçavida)", "Dana / Trapan", "Qekiq", "Metro"].forEach(t => toolSet.add(t));
  }
  return Array.from(toolSet).sort();
}

function getWorkTypesForCategory(category: JobCategory) {
  switch (category) {
    case "electric": return ["Instalim i ri", "Riparim", "Tjetër"];
    case "camera": return ["Kamera"];
    case "alarm": return ["Alarm"];
    case "intercom": return ["Interfon"];
    default: return [...WORK_TYPES];
  }
}

interface ItemQtyInfo {
  name: string;
  unit: string;
  qty: number;
  salePrice: number;
  purchasePrice: number;
}

function PriceRow({ item, form, showCost, isAdmin }: { item: CatalogItem; form: any; showCost: boolean; isAdmin: boolean }) {
  const prices = form.watch("prices") || {};
  const purchasePrices = form.watch("purchasePrices") || {};
  const saleVal = prices[item.name] ?? "";
  const purchaseVal = purchasePrices[item.name] ?? "";

  const updateSalePrice = (val: number | string) => {
    const cur = form.getValues("prices") || {};
    const numVal = typeof val === "string" ? (val === "" ? 0 : parseFloat(val)) : val;
    form.setValue("prices", { ...cur, [item.name]: isNaN(numVal) ? 0 : numVal }, { shouldDirty: true });
  };

  const updatePurchasePrice = (val: number | string) => {
    const cur = form.getValues("purchasePrices") || {};
    const numVal = typeof val === "string" ? (val === "" ? 0 : parseFloat(val)) : val;
    form.setValue("purchasePrices", { ...cur, [item.name]: isNaN(numVal) ? 0 : numVal }, { shouldDirty: true });
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-center p-2 rounded hover:bg-muted/20">
      <span className="col-span-4 text-xs font-bold truncate">{item.name}</span>
      <div className="col-span-3">
        <div className="flex items-center bg-background rounded border px-1">
          <Banknote className="w-3 h-3 text-primary mr-1 shrink-0" />
          <Input
            type="number"
            step="0.01"
            className="h-7 border-0 bg-transparent text-right text-xs p-0"
            placeholder="0.00"
            value={saleVal === 0 ? "" : saleVal}
            onChange={e => updateSalePrice(e.target.value)}
            data-testid={`price-sale-${item.name}`}
          />
        </div>
      </div>
      {showCost && isAdmin && (
        <div className="col-span-3">
          <div className="flex items-center bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800 px-1">
            <ShoppingCart className="w-3 h-3 text-amber-600 mr-1 shrink-0" />
            <Input
              type="number"
              step="0.01"
              className="h-7 border-0 bg-transparent text-right text-xs p-0"
              placeholder="0.00"
              value={purchaseVal === 0 ? "" : purchaseVal}
              onChange={e => updatePurchasePrice(e.target.value)}
              data-testid={`price-purchase-${item.name}`}
            />
          </div>
        </div>
      )}
      {!(showCost && isAdmin) && <div className="col-span-3"></div>}
      <div className="col-span-2"></div>
    </div>
  );
}

type BestPriceItem = { item: CatalogItem; price: number; supplierName: string; supplierId: number };
type PriceComp = { item: CatalogItem; selectedPrice: number; cheapestPrice: number; cheapestSupplierName: string; isCheapest: boolean; diff: number };

function SupplierComparisonField({ form, suppliers, supplierPrices: spData, catalog, category }: {
  form: any;
  suppliers: Supplier[];
  supplierPrices: SupplierPrice[];
  catalog: CatalogItem[];
  category: string;
}) {
  const [mode, setMode] = useState<"single" | "best">("single");

  const relevantCatalogItems = catalog.filter((c: CatalogItem) => {
    if (category === "electric") return c.category === "Pajisje elektrike" || c.category === "Kabllo & Gypa" || c.category === "Punë/Shërbime";
    if (category === "camera") return c.category === "Kamera" || c.category === "Kabllo & Gypa" || c.category === "Punë/Shërbime";
    if (category === "alarm") return c.category === "Alarm" || c.category === "Kabllo & Gypa" || c.category === "Punë/Shërbime";
    if (category === "intercom") return c.category === "Interfon" || c.category === "Kabllo & Gypa" || c.category === "Punë/Shërbime";
    return true;
  });

  const selectedSupplierId = form.watch("supplierId");

  const supplierPriceComparison: PriceComp[] = (mode === "single" && selectedSupplierId) ? relevantCatalogItems.map((item: CatalogItem) => {
    const pricesForItem = spData.filter(sp => sp.catalogItemId === item.id);
    const selectedPrice = pricesForItem.find(sp => sp.supplierId === selectedSupplierId);
    if (!selectedPrice) return null;
    const allPricesSorted = [...pricesForItem].sort((a, b) => a.price - b.price);
    const cheapestPrice = allPricesSorted[0];
    const cheapestSupplier = suppliers.find(s => s.id === cheapestPrice?.supplierId);
    const isCheapest = cheapestPrice?.supplierId === selectedSupplierId;
    return {
      item,
      selectedPrice: selectedPrice.price,
      cheapestPrice: cheapestPrice?.price || 0,
      cheapestSupplierName: cheapestSupplier?.name || "",
      isCheapest,
      diff: selectedPrice.price - (cheapestPrice?.price || 0),
    };
  }).filter((x: PriceComp | null): x is PriceComp => x !== null) : [];

  const totalSelected = supplierPriceComparison.reduce((sum: number, c: PriceComp) => sum + c.selectedPrice, 0);
  const totalCheapest = supplierPriceComparison.reduce((sum: number, c: PriceComp) => sum + c.cheapestPrice, 0);

  const bestPriceList: BestPriceItem[] = mode === "best" ? relevantCatalogItems.map((item: CatalogItem) => {
    const pricesForItem = [...spData.filter(sp => sp.catalogItemId === item.id)].sort((a, b) => a.price - b.price);
    if (pricesForItem.length === 0) return null;
    const best = pricesForItem[0];
    const supplier = suppliers.find(s => s.id === best.supplierId);
    return { item, price: best.price, supplierName: supplier?.name || "I panjohur", supplierId: best.supplierId };
  }).filter((x: BestPriceItem | null): x is BestPriceItem => x !== null) : [];

  const bestBySupplier: Record<string, BestPriceItem[]> = {};
  bestPriceList.forEach(bp => {
    if (!bestBySupplier[bp.supplierName]) bestBySupplier[bp.supplierName] = [];
    bestBySupplier[bp.supplierName].push(bp);
  });

  const bestTotal = bestPriceList.reduce((s, bp) => s + bp.price, 0);
  const worstTotal = relevantCatalogItems.reduce((s: number, item: CatalogItem) => {
    const pricesForItem = spData.filter(sp => sp.catalogItemId === item.id);
    if (pricesForItem.length === 0) return s;
    return s + Math.max(...pricesForItem.map(p => p.price));
  }, 0);

  return (
    <div className="space-y-2">
      <FormField control={form.control} name="supplierId" render={({ field }) => (
        <FormItem>
          <FormLabel>Furnitori</FormLabel>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "single" ? "default" : "outline"}
              onClick={() => setMode("single")}
              data-testid="button-mode-single"
            >
              Një furnitor
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "best" ? "default" : "outline"}
              onClick={() => { setMode("best"); field.onChange(null); }}
              data-testid="button-mode-best"
            >
              Çmimi më i mirë
            </Button>
          </div>
          {mode === "single" && (
            <Select
              onValueChange={(val) => field.onChange(val === "none" ? null : parseInt(val))}
              value={field.value ? String(field.value) : "none"}
            >
              <FormControl><SelectTrigger data-testid="select-supplier"><SelectValue placeholder="Zgjidhni furnitorin" /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="none">Pa furnitor</SelectItem>
                {suppliers.map(s => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {mode === "single" && selectedSupplierId && supplierPriceComparison.length > 0 && (
            <div className="mt-2 border rounded-md p-3 bg-muted/30 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Krahasimi i çmimeve për këtë furnitor:</p>
              <div className="space-y-1">
                {supplierPriceComparison.map((c) => (
                  <div key={c.item.id} className="flex items-center justify-between text-xs gap-2" data-testid={`supplier-price-row-${c.item.id}`}>
                    <span className="truncate flex-1 min-w-0">{c.item.name}</span>
                    <span className="font-medium shrink-0">{c.selectedPrice.toFixed(2)} €</span>
                    {c.isCheapest ? (
                      <Badge variant="default" className="text-[10px] shrink-0 no-default-active-elevate">Më i lirë</Badge>
                    ) : (
                      <span className="text-red-500 dark:text-red-400 shrink-0">+{c.diff.toFixed(2)} € (më lirë: {c.cheapestSupplierName})</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 mt-2 text-xs">
                {totalSelected > totalCheapest ? (
                  <>
                    <span className="text-muted-foreground">Për çmim më të mirë, zgjidhni furnitorët e shënuar me të kuqe. Do të kursenit </span>
                    <span className="font-semibold text-green-700 dark:text-green-400">{(totalSelected - totalCheapest).toFixed(2)} €</span>
                  </>
                ) : (
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Ky furnitor ka çmimet më të lira për të gjitha produktet! Kurseni {supplierPriceComparison.reduce((s: number, c: PriceComp) => {
                      const others = spData.filter(sp => sp.catalogItemId === c.item.id && sp.supplierId !== selectedSupplierId);
                      const maxOther = others.length > 0 ? Math.max(...others.map(o => o.price)) : c.selectedPrice;
                      return s + (maxOther - c.selectedPrice);
                    }, 0).toFixed(2)} € krahasuar me furnitorin më të shtrenjtë.
                  </span>
                )}
              </div>
            </div>
          )}
          {mode === "best" && bestPriceList.length > 0 && (
            <div className="mt-2 border rounded-md p-3 bg-muted/30 space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Çmimet më të lira nga të gjithë furnitorët:</p>
              {Object.entries(bestBySupplier).map(([supplierName, items]) => (
                <div key={supplierName} className="space-y-1">
                  <p className="text-xs font-semibold flex items-center gap-1">
                    <ShoppingCart className="h-3 w-3" /> {supplierName}
                  </p>
                  {items.map(bp => (
                    <div key={bp.item.id} className="flex items-center justify-between text-xs gap-2 pl-4" data-testid={`best-price-row-${bp.item.id}`}>
                      <span className="truncate flex-1 min-w-0">{bp.item.name}</span>
                      <span className="font-medium text-green-700 dark:text-green-400 shrink-0">{bp.price.toFixed(2)} €</span>
                    </div>
                  ))}
                  <div className="pl-4 text-xs text-muted-foreground">
                    Nëntotali: {items.reduce((s, bp) => s + bp.price, 0).toFixed(2)} €
                  </div>
                </div>
              ))}
              <div className="border-t pt-2 text-xs space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Totali me çmimet më të lira:</span>
                  <span className="text-green-700 dark:text-green-400">{bestTotal.toFixed(2)} €</span>
                </div>
                {worstTotal > bestTotal && (
                  <div className="text-muted-foreground">
                    Kurseni <span className="font-semibold text-green-700 dark:text-green-400">{(worstTotal - bestTotal).toFixed(2)} €</span> krahasuar me çmimet më të shtrenjta
                  </div>
                )}
              </div>
            </div>
          )}
          {mode === "best" && bestPriceList.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">Asnjë çmim furnitori nuk është vendosur ende.</p>
          )}
        </FormItem>
      )} />
    </div>
  );
}

function FeedbackSection({ jobId }: { jobId: number }) {
  const { toast } = useToast();
  const { data: feedbackList, isLoading } = useQuery<any[]>({ queryKey: ['/api/feedback', jobId] });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [ratingLink, setRatingLink] = useState<string | null>(null);

  const submitFeedback = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/feedback", { jobId, rating, comment });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feedback', jobId] });
      setComment("");
      toast({ title: "Vlerësimi u ruajt me sukses!" });
    },
  });

  const deleteFeedback = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/feedback/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feedback', jobId] });
      toast({ title: "Vlerësimi u fshi" });
    },
  });

  const generateLink = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/jobs/${jobId}/generate-feedback-token`);
      return res.json();
    },
    onSuccess: (data: { token: string }) => {
      const link = `${window.location.origin}/rate/${data.token}`;
      setRatingLink(link);
      toast({ title: "Linku u gjenerua!" });
    },
  });

  const copyLink = () => {
    if (ratingLink) {
      navigator.clipboard.writeText(ratingLink).then(() => {
        toast({ title: "Linku u kopjua!" });
      });
    }
  };

  const existingFeedback = feedbackList && feedbackList.length > 0 ? feedbackList[0] : null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="w-4 h-4" />
          Vlerësimi i Klientit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {existingFeedback ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-5 h-5 ${s <= existingFeedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{existingFeedback.rating}/5</span>
            </div>
            {existingFeedback.comment && <p className="text-sm text-muted-foreground">{existingFeedback.comment}</p>}
            <Button variant="ghost" size="sm" onClick={() => deleteFeedback.mutate(existingFeedback.id)} data-testid="button-delete-feedback">
              Fshi vlerësimin
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => setRating(s)} data-testid={`button-star-${s}`}>
                  <Star className={`w-6 h-6 cursor-pointer transition-colors ${s <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-yellow-300'}`} />
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Komenti i klientit (opsionale)..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="resize-none"
              data-testid="input-feedback-comment"
            />
            <Button onClick={() => submitFeedback.mutate()} disabled={submitFeedback.isPending} data-testid="button-submit-feedback">
              {submitFeedback.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Star className="w-4 h-4 mr-2" />}
              Ruaj Vlerësimin
            </Button>
          </div>
        )}

        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Dërgo link klientit për vlerësim</p>
          {ratingLink ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input value={ratingLink} readOnly className="text-xs" data-testid="input-rating-link" />
                <Button variant="outline" size="icon" onClick={copyLink} title="Kopjo linkun" data-testid="button-copy-link">
                  <Copy className="h-4 w-4" />
                </Button>
                <a href={ratingLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" title="Hap linkun" data-testid="button-open-link">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
              <p className="text-xs text-muted-foreground">Dërgoni këtë link klientit (WhatsApp, SMS, Email)</p>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateLink.mutate()}
              disabled={generateLink.isPending}
              data-testid="button-generate-rating-link"
            >
              {generateLink.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Link2 className="h-4 w-4 mr-2" />}
              Gjenero Link Vlerësimi
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function JobForm({ initialData, onSubmit, isPending, title, defaultCategory }: JobFormProps) {
  const { data: catalog } = useCatalog();
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const [showCost, setShowCost] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: supplierPrices = [] } = useQuery<SupplierPrice[]>({
    queryKey: ["/api/supplier-prices"],
  });

  const resolvedCategory: JobCategory = (initialData?.category || defaultCategory || "electric") as JobCategory;

  const DEFAULT_NOTES = "Kjo ofertë është përgatitur mbi bazën e kërkesës së klientit dhe gjendjes aktuale të objektit në momentin e inspektimit. Oferta nuk përbën kontratë përfundimtare dhe mund të pësojë ndryshime në rast të punimeve shtesë, materialeve të paplanifikuara apo kërkesave të reja nga klienti. Punimet realizohen vetëm pas konfirmimit zyrtar të ofertës.";

  const defaultValues: JobFormValues = initialData
    ? { ...initialData, notes: initialData.notes || DEFAULT_NOTES }
    : {
      clientName: "", clientPhone: "", clientAddress: "",
      workDate: new Date().toISOString().split('T')[0],
      workType: getWorkTypesForCategory(resolvedCategory)[0],
      category: resolvedCategory,
      status: "oferte" as JobStatus,
      notes: DEFAULT_NOTES,
      discountType: "percent" as const,
      discountValue: 0,
      table1Data: {}, table2Data: {}, cameraData: {},
      intercomData: {}, alarmData: {}, serviceData: {},
      prices: {}, purchasePrices: {}, checklistData: {},
      vatRate: 0, paymentStatus: "pa_paguar", paidAmount: 0,
      paymentDate: null, paymentMethod: null, warrantyMonths: 12, completedDate: null,
    };

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const category = (form.watch("category") || resolvedCategory) as JobCategory;
  const tabVis = getTabsForCategory(category);
  const CatIcon = CATEGORY_ICON_MAP[category] || Zap;

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

  useEffect(() => {
    if (!catalog || catalog.length === 0) return;
    const currentPrices = form.getValues("prices") || {};
    const currentPurchasePrices = form.getValues("purchasePrices") || {};
    let salePricesChanged = false;
    let purchasePricesChanged = false;
    const newSalePrices = { ...currentPrices };
    const newPurchasePrices = { ...currentPurchasePrices };

    catalog.forEach((item: CatalogItem) => {
      if (!(item.name in newSalePrices) && item.salePrice && item.salePrice > 0) {
        newSalePrices[item.name] = item.salePrice;
        salePricesChanged = true;
      }
      if (!(item.name in newPurchasePrices) && item.purchasePrice && item.purchasePrice > 0) {
        newPurchasePrices[item.name] = item.purchasePrice;
        purchasePricesChanged = true;
      }
    });

    if (salePricesChanged) form.setValue("prices", newSalePrices);
    if (purchasePricesChanged) form.setValue("purchasePrices", newPurchasePrices);
  }, [catalog]);

  const getVisibleItems = () => {
    const items: CatalogItem[] = [];
    if (tabVis.showPajisje) items.push(...pajisjeItems);
    if (tabVis.showMateriale) items.push(...materialItems);
    if (tabVis.showKamera) items.push(...cameraItems);
    if (tabVis.showInterfon) items.push(...intercomItems);
    if (tabVis.showAlarm) items.push(...alarmItems);
    if (tabVis.showSherbime) items.push(...serviceItems);
    return items;
  };

  const getQtyForRoomItem = (item: string) => {
    const allTable1 = form.watch("table1Data") || {};
    const rowData = allTable1[item] || {};
    return Object.values(rowData).reduce((a: number, b: number) => a + (b || 0), 0);
  };

  const getSimpleQty = (field: string, item: string) => {
    const allData = form.watch(field as any) || {};
    return allData[item] || 0;
  };

  const getPriceForItem = (item: string) => {
    const allPrices = form.watch("prices") || {};
    return allPrices[item] || 0;
  };

  const getAllItemsWithQty = (): ItemQtyInfo[] => {
    const data = form.getValues();
    const result: ItemQtyInfo[] = [];

    if (tabVis.showPajisje) {
      pajisjeItems.forEach((c: CatalogItem) => {
        const rd = data.table1Data?.[c.name] || {};
        const qty = Object.values(rd).reduce((a: number, b: number) => a + (b || 0), 0);
        if (qty > 0) result.push({ name: c.name, unit: c.unit, qty, salePrice: data.prices?.[c.name] || 0, purchasePrice: data.purchasePrices?.[c.name] || 0 });
      });
    }

    const sections = [
      ...(tabVis.showMateriale ? [{ items: materialItems, data: data.table2Data }] : []),
      ...(tabVis.showKamera ? [{ items: cameraItems, data: data.cameraData }] : []),
      ...(tabVis.showInterfon ? [{ items: intercomItems, data: data.intercomData }] : []),
      ...(tabVis.showAlarm ? [{ items: alarmItems, data: data.alarmData }] : []),
      ...(tabVis.showSherbime ? [{ items: serviceItems, data: data.serviceData }] : []),
    ];
    sections.forEach(sec => {
      sec.items.forEach((c: CatalogItem) => {
        const qty = sec.data?.[c.name] || 0;
        if (qty > 0) result.push({ name: c.name, unit: c.unit, qty, salePrice: data.prices?.[c.name] || 0, purchasePrice: data.purchasePrices?.[c.name] || 0 });
      });
    });

    return result;
  };

  const calculateTotals = () => {
    const items = getAllItemsWithQty();
    const subtotalSale = items.reduce((sum, i) => sum + i.qty * i.salePrice, 0);
    const totalPurchase = items.reduce((sum, i) => sum + i.qty * i.purchasePrice, 0);
    const discType = form.getValues("discountType") || "percent";
    const discVal = form.getValues("discountValue") || 0;
    let discountAmount = 0;
    if (discType === "percent") {
      discountAmount = subtotalSale * (discVal / 100);
    } else {
      discountAmount = discVal;
    }
    discountAmount = Math.min(discountAmount, subtotalSale);
    const totalSale = subtotalSale - discountAmount;
    return { subtotalSale, totalSale, totalPurchase, profit: totalSale - totalPurchase, discountAmount };
  };

  const getChecklistWarnings = () => {
    const data = form.getValues();
    const warnings: string[] = [];
    const checkedCount = Object.values(data.checklistData || {}).filter(Boolean).length;
    if (checkedCount === 0) {
      warnings.push("Checklist nuk eshte plotesuar");
    }
    CHECKLIST_FINAL.forEach(item => {
      if (!data.checklistData?.[item]) {
        warnings.push(`Mungon: ${item}`);
      }
    });
    return warnings;
  };

  const addPDFHeader = (doc: jsPDF) => {
    const tc: [number, number, number] = [41, 128, 185];
    const pageW = doc.internal.pageSize.width;
    doc.setFontSize(22); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("ELEKTRONOVA", pageW / 2, 18, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
    doc.text("Sherbime Elektrike & Siguri | Tel: +383 49 771 673 / +383 49 205 271", pageW / 2, 24, { align: "center" });
    doc.setDrawColor(41, 128, 185); doc.setLineWidth(0.5);
    doc.line(14, 28, pageW - 14, 28);
  };

  const addPDFFooter = (doc: jsPDF, pageNum: number, totalPages: number) => {
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    doc.setDrawColor(200); doc.setLineWidth(0.3);
    doc.line(14, pageH - 15, pageW - 14, pageH - 15);
    doc.setFontSize(7); doc.setTextColor(140); doc.setFont("helvetica", "normal");
    doc.text("Punime elektrike - Procesverbal materiali", 14, pageH - 10);
    doc.text(`Faqja ${pageNum} / ${totalPages}`, pageW - 14, pageH - 10, { align: "right" });
  };

  const addSignatures = (doc: jsPDF) => {
    const signY = doc.internal.pageSize.height - 40;
    doc.setDrawColor(150); doc.setLineWidth(0.3);
    doc.line(20, signY, 85, signY); doc.line(125, signY, 190, signY);
    doc.setFontSize(9); doc.setTextColor(80); doc.setFont("helvetica", "normal");
    doc.text("Nenshkrimi i Klientit", 35, signY + 6);
    doc.text("Punekryeresi (Elektronova)", 130, signY + 6);
  };

  const generateClientPDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const { subtotalSale, totalSale, discountAmount } = calculateTotals();
    const tc: [number, number, number] = [41, 128, 185];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;

    addPDFHeader(doc);

    doc.setFontSize(14); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("FATURE / OFERTE", pageW / 2, 38, { align: "center" });

    doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(0);
    doc.text(`Klienti: ${data.clientName}`, 14, 48);
    doc.text(`Adresa: ${data.clientAddress}`, 14, 53);
    doc.text(`Tel: ${data.clientPhone || '-'}`, 14, 58);
    doc.text(`Data: ${data.workDate}`, pageW - 60, 48);
    doc.text(`Lloji: ${data.workType}`, pageW - 60, 53);
    if (initialData?.invoiceNumber) {
      doc.text(`Nr. Fatures: ${initialData.invoiceNumber}`, pageW - 60, 58);
    } else {
      doc.text(`Kategoria: ${JOB_CATEGORY_LABELS[category] || category}`, pageW - 60, 58);
    }

    if (items.length > 0) {
      let nr = 1;
      const body = items.map(i => [
        (nr++).toString(),
        i.name,
        i.unit,
        i.qty.toString(),
        i.salePrice > 0 ? i.salePrice.toFixed(2) : "-",
        (i.qty * i.salePrice) > 0 ? (i.qty * i.salePrice).toFixed(2) : "-",
      ]);

      autoTable(doc, {
        startY: 65,
        head: [["Nr.", "Pershkrimi", "Njesia", "Sasia", "Cmimi (EUR)", "Totali (EUR)"]],
        body,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 249, 252] },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 60 },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 18, halign: 'center' },
          4: { cellWidth: 28, halign: 'right' },
          5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' },
        },
      });
    }

    const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 80;

    doc.setDrawColor(41, 128, 185); doc.setLineWidth(0.5);
    doc.line(pageW - 80, finalY - 2, pageW - 14, finalY - 2);

    let totalLineY = finalY;
    const vatRate = data.vatRate || 0;
    if (discountAmount > 0) {
      doc.setFontSize(10); doc.setTextColor(80); doc.setFont("helvetica", "normal");
      doc.text(`Nentotali: ${subtotalSale.toFixed(2)} EUR`, pageW - 14, totalLineY + 5, { align: "right" });
      totalLineY += 7;
      const discLabel = (data.discountType || "percent") === "percent" 
        ? `Zbritja (${data.discountValue || 0}%):` 
        : "Zbritja:";
      doc.setTextColor(220, 50, 50);
      doc.text(`${discLabel} -${discountAmount.toFixed(2)} EUR`, pageW - 14, totalLineY + 5, { align: "right" });
      totalLineY += 7;
    }
    if (vatRate > 0) {
      const vatAmount = totalSale * (vatRate / 100);
      const totalWithVat = totalSale + vatAmount;
      doc.setFontSize(10); doc.setTextColor(80); doc.setFont("helvetica", "normal");
      doc.text(`Totali pa TVSH: ${totalSale.toFixed(2)} EUR`, pageW - 14, totalLineY + 5, { align: "right" });
      totalLineY += 7;
      doc.text(`TVSH (${vatRate}%): ${vatAmount.toFixed(2)} EUR`, pageW - 14, totalLineY + 5, { align: "right" });
      totalLineY += 7;
      doc.setFontSize(12); doc.setTextColor(0); doc.setFont("helvetica", "bold");
      doc.text(`TOTALI me TVSH: ${totalWithVat.toFixed(2)} EUR`, pageW - 14, totalLineY + 5, { align: "right" });
    } else {
      doc.setFontSize(12); doc.setTextColor(0); doc.setFont("helvetica", "bold");
      doc.text(`TOTALI: ${totalSale.toFixed(2)} EUR`, pageW - 14, totalLineY + 5, { align: "right" });
    }
    doc.setDrawColor(41, 128, 185); doc.setLineWidth(0.3);
    doc.line(pageW - 80, totalLineY + 8, pageW - 14, totalLineY + 8);

    if (data.notes) {
      const notesY = totalLineY + 16;
      doc.setFillColor(245, 248, 252);
      doc.roundedRect(14, notesY - 4, pageW - 28, 28, 2, 2, 'F');
      doc.setDrawColor(41, 128, 185); doc.setLineWidth(0.2);
      doc.roundedRect(14, notesY - 4, pageW - 28, 28, 2, 2, 'S');
      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(41, 128, 185);
      doc.text("Kushtet e Ofertes:", 18, notesY + 2);
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(60);
      const splitNotes = doc.splitTextToSize(data.notes, pageW - 36);
      doc.text(splitNotes, 18, notesY + 8);
    }

    addSignatures(doc);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addPDFFooter(doc, i, totalPages);
    }

    doc.save(`Elektronova_Fature_${data.clientName.replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "PDF per Klient u gjenerua!" });
  };

  const generatePurchasePDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const { totalPurchase } = calculateTotals();
    const tc: [number, number, number] = [44, 62, 80];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;

    addPDFHeader(doc);

    doc.setFontSize(14); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("LISTA E BLERJES", pageW / 2, 38, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(100);
    doc.text(`Per punen: ${data.clientName} - ${data.workDate}`, pageW / 2, 44, { align: "center" });

    if (items.length > 0) {
      let nr = 1;
      const body = items.map(i => [
        (nr++).toString(),
        i.name,
        i.unit,
        i.qty.toString(),
      ]);

      autoTable(doc, {
        startY: 52,
        head: [["Nr.", "Artikulli", "Njesia", "Sasia"]],
        body,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 9, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 90 },
          2: { cellWidth: 30, halign: 'center' },
          3: { cellWidth: 25, halign: 'center' },
        },
      });
    }

    const finalY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 10 : 70;

    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(0);
    doc.text("Shenime per furnizim:", 14, finalY + 15);
    doc.setDrawColor(200); doc.setLineWidth(0.2);
    for (let i = 0; i < 5; i++) {
      doc.line(14, finalY + 22 + i * 8, pageW - 14, finalY + 22 + i * 8);
    }

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addPDFFooter(doc, i, totalPages);
    }

    doc.save(`Elektronova_Blerje_${data.clientName.replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "PDF per Blerje u gjenerua!" });
  };

  const generateContractPDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const { totalSale, discountAmount, subtotalSale } = calculateTotals();
    const tc: [number, number, number] = [41, 128, 185];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const m = 14;
    const colMid = pageW / 2;
    const cW = pageW - 2 * m;
    const s = 3.5;

    addPDFHeader(doc);

    doc.setFontSize(13); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("KONTRATE PUNE", colMid, 35, { align: "center" });
    doc.setFontSize(7.5); doc.setTextColor(100); doc.setFont("helvetica", "normal");
    doc.text(`Nr. ${initialData?.invoiceNumber || "___"}  |  Data: ${data.workDate}`, colMid, 40, { align: "center" });

    let y = 44;
    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.5);
    doc.line(m, y, pageW - m, y);
    y += 5;

    doc.setFontSize(6.5); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("KONTRAKTORI", m, y);
    doc.text("POROSITESI (KLIENTI)", colMid + 5, y);
    y += s;
    doc.setFont("helvetica", "bold"); doc.setTextColor(0); doc.setFontSize(7.5);
    doc.text("ELEKTRONOVA", m, y);
    doc.text(`${data.clientName}`, colMid + 5, y);
    y += s;
    doc.setFont("helvetica", "normal"); doc.setTextColor(60); doc.setFontSize(6.5);
    doc.text("Sherbime Elektrike & Siguri", m, y);
    doc.text(`${data.clientAddress || ""}`, colMid + 5, y);
    y += s;
    doc.text("Tel: +383 49 771 673 / +383 49 205 271", m, y);
    if (data.clientPhone) doc.text(`Tel: ${data.clientPhone}`, colMid + 5, y);

    y += 4;
    doc.setDrawColor(200); doc.setLineWidth(0.2);
    doc.line(m, y, pageW - m, y);
    y += 4;

    const sect = (num: string, title: string) => {
      doc.setFontSize(7); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
      doc.text(`NENI ${num} - ${title}`, m, y);
      y += s + 0.5;
      doc.setFontSize(6.5); doc.setTextColor(40); doc.setFont("helvetica", "normal");
    };

    const txt = (text: string) => {
      const lines = doc.splitTextToSize(text, cW);
      doc.text(lines, m, y);
      y += lines.length * s;
    };

    const catLabel = JOB_CATEGORY_LABELS[category] || category;

    sect("1", "PALET KONTRAKTUESE");
    txt(`Kjo kontrate lidhet ndermjet ELEKTRONOVA (Sherbime Elektrike & Siguri), me seli ne Kosove, si kryeres i punimeve (Kontraktori), dhe ${data.clientName}, me adrese ne ${data.clientAddress || "---"}, si porositesi i punimeve (Klienti). Te dyja palet deklarojne se kane kapacitetin ligjor per te hyre ne kete marreveshje dhe pranojne kushtet e meposhtme.`);
    y += 1.5;

    sect("2", "OBJEKTI I KONTRATES");
    txt(`Kontraktori merr persiper kryerjen e punimeve te llojit "${data.workType}" - Kategoria: ${catLabel}, ne adresen e specifikuar te klientit. Punimet perfshijne furnizimin, transportin dhe instalimin e te gjitha materialeve elektrike dhe te sigurise sipas specifikimeve te marreveshura ndermjet paleve, duke siguruar standarde profesionale te punes dhe perputhshmeri me normat teknike ne fuqi.`);
    y += 1.5;

    sect("3", "MATERIALET DHE SHERBIMET");
    if (items.length > 0) {
      txt(`Materialet dhe sherbimet e perfshira ne kete kontrate jane te listuara ne faturen/oferten Nr. ${initialData?.invoiceNumber || "___"} e cila eshte pjese e pandashme e kesaj kontrate. Lista perfshine gjithsej ${items.length} artikuj/sherbime. Kontraktori garanton se te gjitha materialet jane te reja, origjinale dhe ne perputhje me standardet e cilesise. Cdo ndryshim ne liste behet vetem me pelqimin e te dyja paleve.`);
    } else {
      txt(`Materialet dhe sherbimet do te specifikohen ne oferten perfundimtare e cila do te jete pjese e pandashme e kesaj kontrate. Kontraktori garanton se te gjitha materialet do te jene te reja, origjinale dhe ne perputhje me standardet e cilesise.`);
    }
    y += 1.5;

    sect("4", "CMIMI DHE MENYRA E PAGESES");
    if (discountAmount > 0) {
      doc.setFont("helvetica", "normal");
      doc.text(`Nentotali: ${subtotalSale.toFixed(2)} EUR`, m, y);
      doc.text(`Zbritja: -${discountAmount.toFixed(2)} EUR`, m + 55, y);
      y += s;
    }
    doc.setFont("helvetica", "bold"); doc.setTextColor(0); doc.setFontSize(7);
    doc.text(`Vlera totale e kontrates: ${totalSale.toFixed(2)} EUR`, m, y);
    y += s;
    doc.setFont("helvetica", "normal"); doc.setTextColor(40); doc.setFontSize(6.5);
    txt("Pagesa realizohet ne dy keste: 50% parapagim para fillimit te punimeve dhe 50% pas perfundimit te plote te punimeve dhe pranimit zyrtar nga klienti. Pagesa mund te behet me para ne dore ose permes transferit bankar. Ne rast te vonesave ne pagese mbi 15 dite, kontraktori rezervon te drejten per te nderpre punimet deri ne rregullimin e pageses.");
    y += 1.5;

    sect("5", "AFATI I FILLIMIT DHE PERFUNDIMIT");
    txt(`Punimet fillojne me daten ${data.scheduledDate || data.workDate}, ose ne nje date tjeter te marreveshur me shkrim ndermjet paleve. Afati i perfundimit percaktohet sipas volumit te punimeve dhe kushteve ne terren. Kontraktori angazhohet te perfundoje punimet brenda afatit te marreveshur. Ne rast vonesash per arsye objektive (kushte atmosferike, mungese materialesh ne treg, ndryshime nga klienti), kontraktori njofton klientin menjehere dhe afati zgjatet perkatesiht.`);
    y += 1.5;

    sect("6", "GARANCIA DHE PERGJEGJESIA");
    txt("Kontraktori garanton cilesine e materialeve dhe punimeve per nje periudhe prej 12 (dymbedhjete) muajsh nga data e perfundimit te punimeve. Garancia mbulon defektet ne materiale dhe ne cilesine e punes se kryer. Garancia nuk aplikohet per demtime te shkaktuara nga perdorimi i gabuar i instalimeve, fatkeqesite natyrore, nderhyrjet e personave te paautorizuar, ose mos-mirembajtja e duhur e sistemit nga klienti.");
    y += 1.5;

    sect("7", "TE DREJTAT DHE DETYRIMET E PALEVE");
    txt("Kontraktori detyrohet: te kryeje punimet me profesionalizem, te perdore materiale cilesore, te respektoje afatet, dhe te lere vendin e punes te paster. Klienti detyrohet: te siguroje qasje te lire ne objekt, te mos nderhyje ne punimet ne progres, te kryeje pagesat sipas afateve, dhe te njoftoje kontraktorin per cdo problem brenda periudhes se garancise.");
    y += 1.5;

    sect("8", "KUSHTET PERFUNDIMTARE");
    const terms = [
      "8.1 Punimet shtese jashte objektit te kesaj kontrate faturohen vecmas pas marreveshjes paraprake me klientin.",
      "8.2 Kontraktori nuk mban pergjegjesi per demtimet ne infrastrukturen ekzistuese te objektit qe nuk jane shkaktuar nga punimet.",
      "8.3 Materialet e teperta mbeten prone e kontraktorit dhe i kthehen atij pas perfundimit te punimeve.",
      "8.4 Cdo mosmarreveshje ndermjet paleve zgjidhet fillimisht permes dialogut. Ne pamundesi, kompetente eshte gjykata kompetente ne Kosove.",
      "8.5 Kjo kontrate eshte hartuar ne dy kopje origjinale, nga nje per secilen pale, dhe hyn ne fuqi menjehere pas nenshkrimit.",
    ];
    terms.forEach(t => {
      const tLines = doc.splitTextToSize(t, cW);
      doc.text(tLines, m, y);
      y += tLines.length * s;
    });

    y += 2;
    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.3);
    doc.line(m, y, pageW - m, y);

    const signY = pageH - 30;
    doc.setFontSize(6.5); doc.setTextColor(80); doc.setFont("helvetica", "normal");
    doc.text("Data: ____/____/________", m, signY);
    doc.text("Data: ____/____/________", colMid + 15, signY);

    doc.setDrawColor(120); doc.setLineWidth(0.3);
    doc.line(m, signY + 8, m + 72, signY + 8);
    doc.line(colMid + 15, signY + 8, colMid + 87, signY + 8);
    doc.setFontSize(6.5); doc.setTextColor(80);
    doc.text("Nenshkrimi i Klientit", m + 18, signY + 12);
    doc.text("ELEKTRONOVA (Kontraktori)", colMid + 23, signY + 12);

    doc.setDrawColor(200); doc.setLineWidth(0.2);
    doc.line(m, pageH - 12, pageW - m, pageH - 12);
    doc.setFontSize(5.5); doc.setTextColor(140); doc.setFont("helvetica", "normal");
    doc.text("ELEKTRONOVA | Sherbime Elektrike & Siguri | Tel: +383 49 771 673 / +383 49 205 271", m, pageH - 8);
    doc.text(`Kontrate Nr. ${initialData?.invoiceNumber || "___"}`, pageW - m, pageH - 8, { align: "right" });

    doc.save(`Elektronova_Kontrate_${(data.clientName || "").replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "Kontrata u gjenerua me sukses!" });
  };

  const generateWarrantyPDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const tc: [number, number, number] = [41, 128, 185];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const m = 14;
    const colMid = pageW / 2;
    const cW = pageW - 2 * m;

    addPDFHeader(doc);

    doc.setFontSize(16); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("CERTIFIKATE GARANCIE", colMid, 38, { align: "center" });
    doc.setFontSize(8); doc.setTextColor(100); doc.setFont("helvetica", "normal");
    doc.text(`Nr. ${initialData?.invoiceNumber || "___"}  |  Leshuar me: ${data.workDate}`, colMid, 44, { align: "center" });

    let y = 52;

    doc.setFillColor(245, 248, 252);
    doc.roundedRect(m, y - 3, cW, 32, 2, 2, 'F');
    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.3);
    doc.roundedRect(m, y - 3, cW, 32, 2, 2, 'S');

    doc.setFontSize(9); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("TE DHENAT E KLIENTIT", m + 4, y + 2);
    doc.setFontSize(9); doc.setTextColor(0); doc.setFont("helvetica", "normal");
    doc.text(`Klienti: ${data.clientName}`, m + 4, y + 9);
    doc.text(`Adresa: ${data.clientAddress || "-"}`, m + 4, y + 15);
    doc.text(`Tel: ${data.clientPhone || "-"}`, m + 4, y + 21);
    doc.text(`Kategoria: ${JOB_CATEGORY_LABELS[category] || category}`, pageW / 2 + 10, y + 9);
    doc.text(`Lloji: ${data.workType}`, pageW / 2 + 10, y + 15);
    doc.text(`Data e Punes: ${data.workDate}`, pageW / 2 + 10, y + 21);

    y += 38;

    const warrantyMonths = data.warrantyMonths || 12;
    const startDate = data.completedDate || data.workDate;
    let endDate = "___";
    try {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + warrantyMonths);
      endDate = d.toISOString().split("T")[0];
    } catch {}

    doc.setFillColor(41, 128, 185);
    doc.roundedRect(m, y - 3, cW, 22, 2, 2, 'F');
    doc.setFontSize(11); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold");
    doc.text("PERIUDHA E GARANCISE", colMid, y + 4, { align: "center" });
    doc.setFontSize(14);
    doc.text(`${warrantyMonths} MUAJ`, colMid, y + 13, { align: "center" });

    y += 26;
    doc.setFontSize(9); doc.setTextColor(0); doc.setFont("helvetica", "normal");
    doc.text(`Fillimi: ${startDate}`, m + 20, y + 3);
    doc.text(`Perfundimi: ${endDate}`, pageW / 2 + 20, y + 3);

    y += 12;

    if (items.length > 0) {
      doc.setFontSize(9); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
      doc.text("MATERIALET E MBULUARA NGA GARANCIA", m, y);
      y += 3;

      let nr = 1;
      const body = items.map(i => [(nr++).toString(), i.name, i.unit, i.qty.toString()]);

      autoTable(doc, {
        startY: y,
        head: [["Nr.", "Artikulli", "Njesia", "Sasia"]],
        body,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7.5, cellPadding: 2.5 },
        alternateRowStyles: { fillColor: [245, 249, 252] },
        columnStyles: { 0: { cellWidth: 12, halign: 'center' }, 1: { cellWidth: 100 }, 2: { cellWidth: 25, halign: 'center' }, 3: { cellWidth: 20, halign: 'center' } },
      });

      y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 30;
    }

    if (y > pageH - 80) { doc.addPage(); y = 20; }

    doc.setFontSize(8); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("KUSHTET E GARANCISE", m, y);
    y += 5;
    doc.setFontSize(7); doc.setTextColor(40); doc.setFont("helvetica", "normal");
    const terms = [
      "1. Garancia mbulon defektet ne materiale dhe ne cilesine e punes se kryer.",
      "2. Garancia nuk aplikohet per demtime te shkaktuara nga perdorimi i gabuar.",
      "3. Garancia nuk mbulon nderhyrjet e personave te paautorizuar ne sistem.",
      "4. Garancia nuk aplikohet per demtime nga fatkeqesite natyrore.",
      "5. Per te aktivizuar garancine, klienti duhet te kontaktoje Elektronova brenda periudhes.",
      "6. Riparimi ose zevendesimi behet brenda 7 diteve pune nga njoftimi.",
    ];
    terms.forEach(t => { doc.text(t, m, y); y += 4; });

    const signY = pageH - 30;
    doc.setDrawColor(120); doc.setLineWidth(0.3);
    doc.line(m, signY + 8, m + 72, signY + 8);
    doc.line(colMid + 15, signY + 8, colMid + 87, signY + 8);
    doc.setFontSize(7); doc.setTextColor(80);
    doc.text("Nenshkrimi i Klientit", m + 18, signY + 12);
    doc.text("ELEKTRONOVA (Garanti)", colMid + 28, signY + 12);

    doc.setDrawColor(200); doc.setLineWidth(0.2);
    doc.line(m, pageH - 12, pageW - m, pageH - 12);
    doc.setFontSize(5.5); doc.setTextColor(140);
    doc.text("ELEKTRONOVA | Sherbime Elektrike & Siguri | Tel: +383 49 771 673 / +383 49 205 271", m, pageH - 8);
    doc.text(`Certifikate Garancie Nr. ${initialData?.invoiceNumber || "___"}`, pageW - m, pageH - 8, { align: "right" });

    doc.save(`Elektronova_Garanci_${(data.clientName || "").replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "Certifikata e Garancise u gjenerua!" });
  };

  const generateWorkReportPDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const { totalSale, totalPurchase, discountAmount, subtotalSale } = calculateTotals();
    const tc: [number, number, number] = [41, 128, 185];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const m = 14;
    const colMid = pageW / 2;
    const cW = pageW - 2 * m;

    addPDFHeader(doc);

    doc.setFontSize(14); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("RAPORT PUNE / PROCESVERBAL DOREZIMI", colMid, 38, { align: "center" });
    doc.setFontSize(8); doc.setTextColor(100); doc.setFont("helvetica", "normal");
    doc.text(`Nr. ${initialData?.invoiceNumber || "___"}  |  Data: ${data.workDate}`, colMid, 44, { align: "center" });

    let y = 52;
    doc.setFillColor(245, 248, 252);
    doc.roundedRect(m, y - 3, cW / 2 - 2, 28, 2, 2, 'F');
    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.2);
    doc.roundedRect(m, y - 3, cW / 2 - 2, 28, 2, 2, 'S');

    doc.setFontSize(8); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("KLIENTI", m + 3, y + 2);
    doc.setFontSize(8); doc.setTextColor(0); doc.setFont("helvetica", "normal");
    doc.text(`${data.clientName}`, m + 3, y + 8);
    doc.text(`${data.clientAddress || "-"}`, m + 3, y + 14);
    doc.text(`Tel: ${data.clientPhone || "-"}`, m + 3, y + 20);

    const rightX = colMid + 2;
    doc.setFillColor(245, 248, 252);
    doc.roundedRect(rightX, y - 3, cW / 2 - 2, 28, 2, 2, 'F');
    doc.setDrawColor(tc[0], tc[1], tc[2]);
    doc.roundedRect(rightX, y - 3, cW / 2 - 2, 28, 2, 2, 'S');

    doc.setFontSize(8); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("DETAJET E PUNES", rightX + 3, y + 2);
    doc.setFontSize(8); doc.setTextColor(0); doc.setFont("helvetica", "normal");
    doc.text(`Kategoria: ${JOB_CATEGORY_LABELS[category] || category}`, rightX + 3, y + 8);
    doc.text(`Lloji: ${data.workType}`, rightX + 3, y + 14);
    doc.text(`Statusi: ${JOB_STATUS_LABELS[(data.status || "oferte") as JobStatus] || data.status}`, rightX + 3, y + 20);

    y += 34;

    if (items.length > 0) {
      doc.setFontSize(9); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
      doc.text("MATERIALET E PERDORURA", m, y);
      y += 3;

      let nr = 1;
      const body = items.map(i => [
        (nr++).toString(), i.name, i.unit, i.qty.toString(),
        i.salePrice > 0 ? i.salePrice.toFixed(2) : "-",
        (i.qty * i.salePrice) > 0 ? (i.qty * i.salePrice).toFixed(2) : "-",
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Nr.", "Pershkrimi", "Njesia", "Sasia", "Cmimi", "Totali"]],
        body,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7.5, cellPadding: 2.5 },
        alternateRowStyles: { fillColor: [245, 249, 252] },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 65 },
          2: { cellWidth: 18, halign: 'center' }, 3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' }, 5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
        },
      });

      y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 30;
    }

    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.3);
    doc.line(pageW - 75, y, pageW - m, y);
    y += 5;

    if (discountAmount > 0) {
      doc.setFontSize(9); doc.setTextColor(80); doc.setFont("helvetica", "normal");
      doc.text(`Nentotali: ${subtotalSale.toFixed(2)} EUR`, pageW - m, y, { align: "right" });
      y += 5;
      doc.setTextColor(220, 50, 50);
      doc.text(`Zbritja: -${discountAmount.toFixed(2)} EUR`, pageW - m, y, { align: "right" });
      y += 5;
    }
    const vatRate = data.vatRate || 0;
    if (vatRate > 0) {
      const vatAmount = totalSale * (vatRate / 100);
      const totalWithVat = totalSale + vatAmount;
      doc.setFontSize(9); doc.setTextColor(80); doc.setFont("helvetica", "normal");
      doc.text(`Totali pa TVSH: ${totalSale.toFixed(2)} EUR`, pageW - m, y, { align: "right" }); y += 5;
      doc.text(`TVSH (${vatRate}%): ${vatAmount.toFixed(2)} EUR`, pageW - m, y, { align: "right" }); y += 5;
      doc.setFontSize(11); doc.setTextColor(0); doc.setFont("helvetica", "bold");
      doc.text(`TOTALI: ${totalWithVat.toFixed(2)} EUR`, pageW - m, y, { align: "right" });
    } else {
      doc.setFontSize(11); doc.setTextColor(0); doc.setFont("helvetica", "bold");
      doc.text(`TOTALI: ${totalSale.toFixed(2)} EUR`, pageW - m, y, { align: "right" });
    }

    y += 10;
    if (y > pageH - 80) { doc.addPage(); y = 20; }

    const checklists = [
      ...(category === "electric" ? CHECKLIST_ELEKTRIKE : []),
      ...(category === "camera" ? CHECKLIST_KAMERA : []),
      ...(category === "alarm" ? CHECKLIST_ALARM : []),
      ...(category === "intercom" ? CHECKLIST_INTERFON : []),
      ...CHECKLIST_FINAL,
    ];

    if (checklists.length > 0) {
      doc.setFontSize(9); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
      doc.text("KONTROLLET E KRYERA", m, y);
      y += 3;

      const checkData = data.checklistData || {};
      const checkBody = checklists.map(item => [
        checkData[item] ? "OK" : "X",
        item,
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Status", "Kontrolli"]],
        body: checkBody,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 15, halign: 'center', fontStyle: 'bold' },
          1: { cellWidth: 140 },
        },
        didParseCell: (hookData: any) => {
          if (hookData.section === 'body' && hookData.column.index === 0) {
            if (hookData.cell.raw === "OK") {
              hookData.cell.styles.textColor = [39, 174, 96];
            } else {
              hookData.cell.styles.textColor = [231, 76, 60];
            }
          }
        },
      });

      y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 20;
    }

    if (data.notes) {
      if (y > pageH - 50) { doc.addPage(); y = 20; }
      doc.setFillColor(245, 248, 252);
      doc.roundedRect(m, y - 2, cW, 20, 2, 2, 'F');
      doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.2);
      doc.roundedRect(m, y - 2, cW, 20, 2, 2, 'S');
      doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(tc[0], tc[1], tc[2]);
      doc.text("SHENIME:", m + 3, y + 3);
      doc.setFont("helvetica", "normal"); doc.setTextColor(60); doc.setFontSize(7);
      const splitNotes = doc.splitTextToSize(data.notes, cW - 8);
      doc.text(splitNotes, m + 3, y + 8);
    }

    addSignatures(doc);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addPDFFooter(doc, i, totalPages);
    }

    doc.save(`Elektronova_RaportPune_${(data.clientName || "").replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "Raporti i Punes u gjenerua!" });
  };

  const generateDetailedQuotePDF = () => {
    const data = form.getValues();
    const items = getAllItemsWithQty();
    const { subtotalSale, totalSale, discountAmount } = calculateTotals();
    const tc: [number, number, number] = [41, 128, 185];
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;
    const m = 14;
    const colMid = pageW / 2;
    const cW = pageW - 2 * m;

    addPDFHeader(doc);

    doc.setFontSize(16); doc.setTextColor(0); doc.setFont("helvetica", "bold");
    doc.text("PREVENTIV / OFERTE", colMid, 38, { align: "center" });
    doc.setFontSize(8); doc.setTextColor(100); doc.setFont("helvetica", "normal");
    doc.text(`Nr. ${initialData?.invoiceNumber || "___"}  |  Data: ${data.workDate}`, colMid, 44, { align: "center" });

    let y = 52;

    doc.setFillColor(245, 248, 252);
    doc.roundedRect(m, y - 3, cW / 2 - 2, 28, 2, 2, 'F');
    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.2);
    doc.roundedRect(m, y - 3, cW / 2 - 2, 28, 2, 2, 'S');

    doc.setFontSize(8); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("PER:", m + 3, y + 2);
    doc.setFontSize(9); doc.setTextColor(0); doc.setFont("helvetica", "normal");
    doc.text(`${data.clientName}`, m + 3, y + 8);
    doc.text(`${data.clientAddress || "-"}`, m + 3, y + 14);
    doc.text(`Tel: ${data.clientPhone || "-"}`, m + 3, y + 20);

    const rightX = colMid + 2;
    doc.setFillColor(245, 248, 252);
    doc.roundedRect(rightX, y - 3, cW / 2 - 2, 28, 2, 2, 'F');
    doc.setDrawColor(tc[0], tc[1], tc[2]);
    doc.roundedRect(rightX, y - 3, cW / 2 - 2, 28, 2, 2, 'S');

    doc.setFontSize(8); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("NGA:", rightX + 3, y + 2);
    doc.setFontSize(9); doc.setTextColor(0); doc.setFont("helvetica", "normal");
    doc.text("ELEKTRONOVA", rightX + 3, y + 8);
    doc.text("Sherbime Elektrike & Siguri", rightX + 3, y + 14);
    doc.text("Tel: +383 49 771 673", rightX + 3, y + 20);

    y += 34;

    doc.setFontSize(9); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("PERSHKRIMI I PUNIMEVE", m, y);
    y += 5;
    doc.setFontSize(8); doc.setTextColor(0); doc.setFont("helvetica", "normal");
    doc.text(`Kategoria: ${JOB_CATEGORY_LABELS[category] || category}`, m, y);
    doc.text(`Lloji i Punes: ${data.workType}`, pageW / 2, y);
    y += 8;

    if (items.length > 0) {
      let nr = 1;
      const body = items.map(i => [
        (nr++).toString(), i.name, i.unit, i.qty.toString(),
        i.salePrice > 0 ? i.salePrice.toFixed(2) : "-",
        (i.qty * i.salePrice) > 0 ? (i.qty * i.salePrice).toFixed(2) : "-",
      ]);

      autoTable(doc, {
        startY: y,
        head: [["Nr.", "Pershkrimi i Artikullit", "Njesia", "Sasia", "Cmimi (EUR)", "Totali (EUR)"]],
        body,
        theme: 'striped',
        headStyles: { fillColor: tc, fontSize: 8, fontStyle: 'bold' },
        styles: { fontSize: 7.5, cellPadding: 2.5 },
        alternateRowStyles: { fillColor: [245, 249, 252] },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 65 },
          2: { cellWidth: 18, halign: 'center' }, 3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 25, halign: 'right' }, 5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
        },
      });

      y = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : y + 30;
    }

    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.3);
    doc.line(pageW - 75, y, pageW - m, y);
    y += 6;

    if (discountAmount > 0) {
      doc.setFontSize(9); doc.setTextColor(80); doc.setFont("helvetica", "normal");
      doc.text(`Nentotali: ${subtotalSale.toFixed(2)} EUR`, pageW - m, y, { align: "right" }); y += 5;
      const discLabel = (data.discountType || "percent") === "percent" ? `Zbritja (${data.discountValue || 0}%):` : "Zbritja:";
      doc.setTextColor(220, 50, 50);
      doc.text(`${discLabel} -${discountAmount.toFixed(2)} EUR`, pageW - m, y, { align: "right" }); y += 5;
    }
    const vatRate = data.vatRate || 0;
    if (vatRate > 0) {
      const vatAmount = totalSale * (vatRate / 100);
      const totalWithVat = totalSale + vatAmount;
      doc.setFontSize(9); doc.setTextColor(80); doc.setFont("helvetica", "normal");
      doc.text(`Totali pa TVSH: ${totalSale.toFixed(2)} EUR`, pageW - m, y, { align: "right" }); y += 5;
      doc.text(`TVSH (${vatRate}%): ${vatAmount.toFixed(2)} EUR`, pageW - m, y, { align: "right" }); y += 5;
      doc.setFontSize(12); doc.setTextColor(0); doc.setFont("helvetica", "bold");
      doc.text(`TOTALI me TVSH: ${totalWithVat.toFixed(2)} EUR`, pageW - m, y, { align: "right" });
    } else {
      doc.setFontSize(12); doc.setTextColor(0); doc.setFont("helvetica", "bold");
      doc.text(`TOTALI: ${totalSale.toFixed(2)} EUR`, pageW - m, y, { align: "right" });
    }
    y += 8;

    if (y > pageH - 75) { doc.addPage(); y = 20; }

    doc.setFillColor(245, 248, 252);
    doc.roundedRect(m, y, cW, 42, 2, 2, 'F');
    doc.setDrawColor(tc[0], tc[1], tc[2]); doc.setLineWidth(0.2);
    doc.roundedRect(m, y, cW, 42, 2, 2, 'S');

    doc.setFontSize(8); doc.setTextColor(tc[0], tc[1], tc[2]); doc.setFont("helvetica", "bold");
    doc.text("KUSHTET E OFERTES", m + 3, y + 5);
    doc.setFontSize(7); doc.setTextColor(40); doc.setFont("helvetica", "normal");
    const conditions = [
      "1. Kjo oferte eshte e vlefshme per 30 (tridhjete) dite nga data e leshimit.",
      "2. Cmimet perfshijne furnizimin, transportin dhe instalimin e materialeve.",
      "3. Pagesa realizohet: 50% parapagim para fillimit dhe 50% pas perfundimit te punimeve.",
      "4. Pagesa mund te behet me para ne dore ose transfer bankar.",
      "5. Punimet fillojne brenda 3-5 diteve pune pas konfirmimit te ofertes dhe parapagimit.",
      "6. Garancia: " + (data.warrantyMonths || 12) + " muaj per materialet dhe punimet.",
      "7. Ndryshimet ne projekt pas fillimit te punimeve mund te sjellin kosto shtese.",
    ];
    conditions.forEach((c, idx) => {
      doc.text(c, m + 3, y + 11 + idx * 4);
    });

    if (data.notes) {
      y += 48;
      doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(tc[0], tc[1], tc[2]);
      doc.text("SHENIME SHTESE:", m, y);
      doc.setFont("helvetica", "normal"); doc.setTextColor(60); doc.setFontSize(7);
      const splitNotes = doc.splitTextToSize(data.notes, cW);
      doc.text(splitNotes, m, y + 5);
    }

    addSignatures(doc);

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addPDFFooter(doc, i, totalPages);
    }

    doc.save(`Elektronova_Preventiv_${(data.clientName || "").replace(/\s/g, '_')}_${data.workDate}.pdf`);
    toast({ title: "Preventivi/Oferta u gjenerua!" });
  };

  const updateRoomQty = (itemName: string, room: string, val: number) => {
    const cur = form.getValues("table1Data") || {};
    const rowData = { ...(cur[itemName] || {}) };
    rowData[room] = isNaN(val) ? 0 : val;
    form.setValue("table1Data", { ...cur, [itemName]: rowData }, { shouldDirty: true });
  };

  const updateSimpleQty = (fieldName: string, itemName: string, val: number) => {
    const cur = form.getValues(fieldName as any) || {};
    form.setValue(fieldName as any, { ...cur, [itemName]: isNaN(val) ? 0 : val }, { shouldDirty: true });
  };

  const renderRoomTable = () => {
    const table1Data = form.watch("table1Data") || {};
    return (
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
            {pajisjeItems.map((c: CatalogItem) => {
              const qty = getQtyForRoomItem(c.name);
              const price = getPriceForItem(c.name);
              const rowData = table1Data[c.name] || {};
              const isOutOfStock = (c.currentStock === 0 || c.currentStock === null) && c.minStockLevel && c.minStockLevel > 0;
              return (
                <tr key={c.id} className={`hover:bg-muted/30 ${isOutOfStock ? 'opacity-60' : ''}`}>
                  <td className="p-2 font-medium sticky left-0 bg-background z-10 border-r text-xs">
                    <span className="flex items-center gap-1">
                      {c.name}
                      {isOutOfStock && (
                        <Badge variant="destructive" className="text-[8px] px-1 py-0">Pa Stok</Badge>
                      )}
                    </span>
                  </td>
                  {ROOMS.map(r => (
                    <td key={r} className="p-0.5">
                      <input
                        type="number"
                        className={`w-full h-8 text-center bg-transparent outline-none border-b border-transparent focus:border-primary text-xs ${isOutOfStock ? 'cursor-not-allowed text-muted-foreground' : ''}`}
                        value={rowData[r] || ""}
                        onChange={e => {
                          if (isOutOfStock) return;
                          updateRoomQty(c.name, r, e.target.valueAsNumber);
                        }}
                        disabled={!!isOutOfStock}
                        title={isOutOfStock ? 'Ky produkt nuk ka stok - shtoni stok para se ta përdorni' : ''}
                        data-testid={`input-${c.name}-${r}`}
                      />
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
  };

  const renderSimpleSection = (items: CatalogItem[], fieldName: string) => {
    const sectionData = form.watch(fieldName as any) || {};
    return (
      <Card>
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(c => {
            const qty = sectionData[c.name] || 0;
            const price = getPriceForItem(c.name);
            const isOutOfStock = (c.currentStock === 0 || c.currentStock === null) && c.minStockLevel && c.minStockLevel > 0;
            return (
              <div key={c.id} className={`p-2 border rounded-lg flex items-center justify-between gap-2 hover:border-primary/50 transition-colors ${isOutOfStock ? 'opacity-60 border-destructive/30' : ''}`}>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate flex items-center gap-1">
                    {c.name}
                    {isOutOfStock && (
                      <Badge variant="destructive" className="text-[8px] px-1 py-0">Pa Stok</Badge>
                    )}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{c.unit}</span>
                  {(qty * price) > 0 && <span className="text-[10px] text-primary font-black">{(qty * price).toFixed(2)} €</span>}
                </div>
                <div className="flex items-center bg-muted/50 rounded overflow-hidden w-20 shrink-0 border">
                  <Input
                    type="number"
                    className={`h-7 border-0 bg-transparent text-right px-1 text-xs ${isOutOfStock ? 'cursor-not-allowed' : ''}`}
                    value={qty || ""}
                    onChange={e => {
                      if (isOutOfStock) return;
                      updateSimpleQty(fieldName, c.name, e.target.valueAsNumber);
                    }}
                    disabled={!!isOutOfStock}
                    title={isOutOfStock ? 'Ky produkt nuk ka stok - shtoni stok para se ta përdorni' : ''}
                    data-testid={`input-${c.name}`}
                  />
                  <span className="text-[9px] px-1 bg-muted uppercase font-bold border-l whitespace-nowrap">{c.unit}</span>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <p className="text-muted-foreground text-sm col-span-full text-center py-4">Nuk ka artikuj ne kete kategori. Shto ne Katalogun e Admin.</p>}
        </CardContent>
      </Card>
    );
  };

  const renderChecklist = () => {
    const sections = getChecklistsForCategory(category);
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
              {sec.items.map(item => {
                const checklistData = form.watch("checklistData") || {};
                const checked = !!checklistData[item];
                return (
                  <label key={item} className="flex items-center gap-3 p-2 rounded hover:bg-muted/30 cursor-pointer" data-testid={`checklist-${item}`}>
                    <Checkbox checked={checked} onCheckedChange={(val) => {
                      const cur = form.getValues("checklistData") || {};
                      form.setValue("checklistData", { ...cur, [item]: !!val }, { shouldDirty: true });
                    }} />
                    <span className={`text-sm ${checked ? "line-through text-muted-foreground" : ""}`}>{item}</span>
                  </label>
                );
              })}
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

  const getVisibleCategorySections = (): { label: string; items: CatalogItem[] }[] => {
    const sections: { label: string; items: CatalogItem[] }[] = [];
    if (tabVis.showPajisje && pajisjeItems.length > 0) sections.push({ label: "Pajisje Elektrike", items: pajisjeItems });
    if (tabVis.showMateriale && materialItems.length > 0) sections.push({ label: "Kabllo & Gypa", items: materialItems });
    if (tabVis.showKamera && cameraItems.length > 0) sections.push({ label: "Kamera", items: cameraItems });
    if (tabVis.showInterfon && intercomItems.length > 0) sections.push({ label: "Interfon", items: intercomItems });
    if (tabVis.showAlarm && alarmItems.length > 0) sections.push({ label: "Alarm", items: alarmItems });
    if (tabVis.showSherbime && serviceItems.length > 0) sections.push({ label: "Pune / Sherbime", items: serviceItems });
    return sections;
  };

  const renderPricing = () => {
    const categorySections = getVisibleCategorySections();
    const totals = calculateTotals();
    return (
      <div className="space-y-4">
        {isAdmin && (
          <div className="flex items-center justify-between gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex-wrap">
            <span className="text-sm font-bold text-amber-700">Pamja e Kostos (Admin)</span>
            <div className="flex items-center gap-2 flex-wrap">
              {initialData?.id && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const res = await apiRequest('POST', `/api/jobs/${initialData.id}/apply-best-prices`);
                      const data = await res.json();
                      if (data.applied && data.applied.length > 0) {
                        const newPP = { ...form.getValues("purchasePrices"), ...data.purchasePrices };
                        form.setValue("purchasePrices", newPP, { shouldDirty: true });
                        toast({ title: "Çmimet u aplikuan", description: `${data.applied.length} artikuj u përditësuan me çmimet më të lira` });
                      } else {
                        toast({ title: "Asnjë ndryshim", description: "Nuk u gjetën çmime furnitorësh për artikujt e kësaj pune" });
                      }
                    } catch {
                      toast({ title: "Gabim", description: "Nuk u arrit të aplikohen çmimet", variant: "destructive" });
                    }
                  }}
                  data-testid="button-apply-best-prices"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" /> Apliko Çmimet më të Lira
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCost(!showCost)}
                data-testid="button-toggle-cost"
              >
                {showCost ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                {showCost ? "Fshih Koston" : "Shfaq Koston"}
              </Button>
            </div>
          </div>
        )}

        {categorySections.map(section => (
          <Card key={section.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Banknote className="w-4 h-4 text-primary" />
                {section.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="hidden sm:grid grid-cols-12 gap-2 p-2 text-xs font-bold text-muted-foreground border-b mb-2">
                <span className="col-span-4">Artikulli</span>
                <span className="col-span-3">Cmimi Shitjes (EUR)</span>
                {showCost && isAdmin ? <span className="col-span-3">Cmimi Blerjes (EUR)</span> : <span className="col-span-3"></span>}
                <span className="col-span-2"></span>
              </div>
              <div className="space-y-1">
                {section.items.map((c: CatalogItem) => (
                  <PriceRow key={c.id} item={c} form={form} showCost={showCost} isAdmin={isAdmin} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {categorySections.length === 0 && (
          <Card><CardContent className="pt-6"><p className="text-muted-foreground text-center text-sm py-4">Ngarko katalogun...</p></CardContent></Card>
        )}

        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-col gap-2">
              {totals.discountAmount > 0 && (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Nentotali:</span>
                    <span className="text-sm font-bold text-muted-foreground" data-testid="text-subtotal">{totals.subtotalSale.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-red-500 flex items-center gap-1"><Tag className="w-3 h-3" /> Zbritja:</span>
                    <span className="text-sm font-bold text-red-500" data-testid="text-discount">-{totals.discountAmount.toFixed(2)} EUR</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm font-bold">Totali Shitjes:</span>
                <span className="text-lg font-black text-primary" data-testid="text-total-sale">{totals.totalSale.toFixed(2)} EUR</span>
              </div>
              {showCost && isAdmin && (
                <>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-bold text-amber-600">Totali Kostos:</span>
                    <span className="text-lg font-black text-amber-600" data-testid="text-total-purchase">{totals.totalPurchase.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-bold text-green-600">Fitimi:</span>
                    <span className="text-lg font-black text-green-600" data-testid="text-profit">{totals.profit.toFixed(2)} EUR</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const lowStockItems = (catalog || []).filter((c: CatalogItem) => {
    if (!c.minStockLevel || c.minStockLevel <= 0) return false;
    return (c.currentStock || 0) <= c.minStockLevel;
  });

  const [stockWarningOpen, setStockWarningOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const availableWorkTypes = getWorkTypesForCategory(category);
  const watchedDiscountType = form.watch("discountType");
  const watchedDiscountValue = form.watch("discountValue");
  const totals = calculateTotals();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm sticky top-16 z-10 backdrop-blur-md">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/"><Button variant="ghost" size="icon" data-testid="button-back"><ArrowLeft /></Button></Link>
          <div className="flex items-center gap-2 min-w-0">
            <CatIcon className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-xl font-bold truncate" data-testid="text-form-title">{title}</h1>
          </div>
          <Badge variant="outline" className="text-[10px] shrink-0" data-testid="badge-form-category">{JOB_CATEGORY_LABELS[category]}</Badge>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Vlera Totale</p>
            <p className="text-xl font-black text-primary" data-testid="text-grand-total">{totals.totalSale.toFixed(2)} €</p>
            {isAdmin && showCost && (
              <p className="text-xs font-bold text-green-600" data-testid="text-header-profit">Fitimi: {totals.profit.toFixed(2)} €</p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" data-testid="button-pdf-dropdown">
                <FileDown className="mr-2" /> PDF <ChevronDown className="ml-1 w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={generateClientPDF} data-testid="button-pdf-client">
                <FileText className="mr-2 w-4 h-4" /> PDF per Klient (Fature/Oferte)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generatePurchasePDF} data-testid="button-pdf-purchase">
                <ShoppingCart className="mr-2 w-4 h-4" /> PDF per Blerje (Lista ime)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateContractPDF} data-testid="button-pdf-contract">
                <FileSignature className="mr-2 w-4 h-4" /> Kontrate Pune
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={generateWarrantyPDF} data-testid="button-pdf-warranty">
                <Award className="mr-2 w-4 h-4" /> Certifikate Garancie
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateWorkReportPDF} data-testid="button-pdf-report">
                <ClipboardList className="mr-2 w-4 h-4" /> Raport Pune (Dorezimi)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateDetailedQuotePDF} data-testid="button-pdf-quote">
                <FileCheck className="mr-2 w-4 h-4" /> Preventiv / Oferte Detajuar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {initialData && (
            <>
              <Button type="button" variant="outline" size="icon" onClick={() => setMapOpen(true)} title="Shiko ne harte" data-testid="button-map">
                <MapPin className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" onClick={() => setShareOpen(true)} title="Ndaj me klientin" data-testid="button-share">
                <Send className="h-4 w-4" />
              </Button>
            </>
          )}

          <Button type="button" onClick={() => {
            const cleanNumericRecord = (rec: Record<string, any> | undefined) => {
              if (!rec) return {};
              const cleaned: Record<string, number> = {};
              for (const [k, v] of Object.entries(rec)) {
                const num = Number(v);
                if (!isNaN(num)) cleaned[k] = num;
              }
              return cleaned;
            };
            const cleanTable1 = (rec: Record<string, any> | undefined) => {
              if (!rec) return {};
              const cleaned: Record<string, Record<string, number>> = {};
              for (const [item, rooms] of Object.entries(rec)) {
                if (rooms && typeof rooms === 'object') {
                  cleaned[item] = cleanNumericRecord(rooms);
                }
              }
              return cleaned;
            };
            const vals = form.getValues();
            vals.table1Data = cleanTable1(vals.table1Data);
            vals.table2Data = cleanNumericRecord(vals.table2Data);
            vals.cameraData = cleanNumericRecord(vals.cameraData);
            vals.intercomData = cleanNumericRecord(vals.intercomData);
            vals.alarmData = cleanNumericRecord(vals.alarmData);
            vals.serviceData = cleanNumericRecord(vals.serviceData);
            vals.prices = cleanNumericRecord(vals.prices);
            vals.purchasePrices = cleanNumericRecord(vals.purchasePrices);
            for (const key of Object.keys(vals.table1Data || {})) {
              if (Object.keys(vals.table1Data![key]).length === 0) delete vals.table1Data![key];
            }
            for (const field of ['table2Data', 'cameraData', 'intercomData', 'alarmData', 'serviceData'] as const) {
              for (const [k, v] of Object.entries(vals[field] || {})) {
                if (v === 0 || isNaN(v as number)) delete (vals[field] as any)[k];
              }
            }
            form.reset(vals);
            form.handleSubmit(onSubmit, (errors) => {
              const errorFields = Object.keys(errors);
              toast({ title: "Ploteso fushat e detyrueshme", description: `Kthehu te tab-i "Klienti" dhe ploteso: ${errorFields.join(', ')}`, variant: "destructive" });
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
                {tabVis.showPajisje && <TabsTrigger value="pajisje" className="gap-2" data-testid="tab-pajisje"><Package className="w-4 h-4" /> Pajisje</TabsTrigger>}
                {tabVis.showMateriale && <TabsTrigger value="materiale" className="gap-2" data-testid="tab-materiale"><Settings className="w-4 h-4" /> Materiale</TabsTrigger>}
                {tabVis.showKamera && <TabsTrigger value="kamera" className="gap-2" data-testid="tab-kamera"><Camera className="w-4 h-4" /> Kamera</TabsTrigger>}
                {tabVis.showInterfon && <TabsTrigger value="interfon" className="gap-2" data-testid="tab-interfon"><PhoneCall className="w-4 h-4" /> Interfon</TabsTrigger>}
                {tabVis.showAlarm && <TabsTrigger value="alarm" className="gap-2" data-testid="tab-alarm"><ShieldAlert className="w-4 h-4" /> Alarm</TabsTrigger>}
                {tabVis.showSherbime && <TabsTrigger value="sherbime" className="gap-2" data-testid="tab-sherbime"><Wrench className="w-4 h-4" /> Sherbime</TabsTrigger>}
                <TabsTrigger value="financat" className="gap-2" data-testid="tab-financat"><Banknote className="w-4 h-4" /> Financat</TabsTrigger>
                <TabsTrigger value="checklist" className="gap-2" data-testid="tab-checklist"><CheckCircle2 className="w-4 h-4" /> Checklist</TabsTrigger>
                <TabsTrigger value="cmimet" className="gap-2" data-testid="tab-cmimet"><Banknote className="w-4 h-4" /> Cmimet</TabsTrigger>
              </TabsList>
            </div>

            {lowStockItems.length > 0 && (
              <div className="border border-amber-500/30 rounded-lg bg-amber-500/5 mb-2">
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-3 text-left"
                  onClick={() => setStockWarningOpen(!stockWarningOpen)}
                  data-testid="button-stock-warning-toggle"
                >
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {lowStockItems.length} produkte me stok te ulet
                  </span>
                  <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform ${stockWarningOpen ? 'rotate-180' : ''}`} />
                </button>
                {stockWarningOpen && (
                  <div className="px-3 pb-3 space-y-1">
                    {lowStockItems.map((item: CatalogItem) => (
                      <div key={item.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-amber-500/10" data-testid={`stock-warning-${item.id}`}>
                        <span className="font-medium truncate">{item.name}</span>
                        <span className="shrink-0 text-amber-700 dark:text-amber-400 font-bold">
                          {item.currentStock || 0} / {item.minStockLevel} {item.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(() => {
              const t1 = form.watch("table1Data") || {};
              const t2 = form.watch("table2Data") || {};
              const cam = form.watch("cameraData") || {};
              const intc = form.watch("intercomData") || {};
              const alm = form.watch("alarmData") || {};
              const srv = form.watch("serviceData") || {};
              const allActive: { name: string; category?: string }[] = [];
              const addItems = (items: CatalogItem[], data: Record<string, any>, isRoom?: boolean) => {
                items.forEach(c => {
                  const qty = isRoom
                    ? Object.values(data[c.name] || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0)
                    : (data[c.name] || 0);
                  if (qty > 0) allActive.push({ name: c.name, category: c.category });
                });
              };
              if (tabVis.showPajisje) addItems(pajisjeItems, t1, true);
              if (tabVis.showMateriale) addItems(materialItems, t2);
              if (tabVis.showKamera) addItems(cameraItems, cam);
              if (tabVis.showInterfon) addItems(intercomItems, intc);
              if (tabVis.showAlarm) addItems(alarmItems, alm);
              if (tabVis.showSherbime) addItems(serviceItems, srv);
              const requiredTools = getRequiredTools(allActive);
              if (requiredTools.length === 0) return null;
              return (
                <div className="border border-blue-500/30 rounded-lg bg-blue-500/5 mb-2" data-testid="section-tools">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-2 p-3 text-left"
                    onClick={() => setToolsOpen(!toolsOpen)}
                    data-testid="button-tools-toggle"
                  >
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <Hammer className="w-4 h-4" />
                      Veglat e Nevojshme ({requiredTools.length})
                    </span>
                    <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {toolsOpen && (
                    <div className="px-3 pb-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {requiredTools.map(tool => (
                          <div key={tool} className="flex items-center gap-2 text-xs p-2 rounded bg-blue-500/10" data-testid={`tool-${tool}`}>
                            <CircleCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                            <span className="font-medium text-blue-800 dark:text-blue-300">{tool}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

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
                    <FormItem><FormLabel>Adresa</FormLabel><FormControl><Input {...field} data-testid="input-client-address" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="locationUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Plus Code / Lokacioni</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="psh. 8GJ2JCW2+G9"
                            data-testid="input-location-url"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title="Merr lokacionin GPS"
                          data-testid="button-get-gps"
                          onClick={() => {
                            if (!navigator.geolocation) {
                              toast({ title: "GPS nuk mbështetet në këtë pajisje", variant: "destructive" });
                              return;
                            }
                            toast({ title: "Duke marrë lokacionin..." });
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                const lat = pos.coords.latitude;
                                const lng = pos.coords.longitude;
                                form.setValue("latitude", lat, { shouldDirty: true });
                                form.setValue("longitude", lng, { shouldDirty: true });
                                const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
                                form.setValue("locationUrl", mapsUrl, { shouldDirty: true });
                                toast({ title: "Lokacioni u regjistrua me sukses!" });
                              },
                              (err) => {
                                toast({ title: "Nuk mund të merret lokacioni: " + err.message, variant: "destructive" });
                              },
                              { enableHighAccuracy: true, timeout: 10000 }
                            );
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                      {form.watch("latitude") && form.watch("longitude") && (
                        <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          GPS: {Number(form.watch("latitude")).toFixed(6)}, {Number(form.watch("longitude")).toFixed(6)}
                          <a
                            href={`https://maps.google.com/?q=${form.watch("latitude")},${form.watch("longitude")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline ml-1"
                          >
                            Shiko në hartë
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">Shtypni butonin GPS ose kopjoni Plus Code nga Google Maps</p>
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="workDate" render={({ field }) => (
                      <FormItem><FormLabel>Data e Punës</FormLabel><FormControl><Input type="date" {...field} data-testid="input-work-date" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="scheduledDate" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Data e Planifikuar</FormLabel>
                        <FormControl><Input type="date" {...field} value={field.value || ""} data-testid="input-scheduled-date" /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="workType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lloji i Punes</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger data-testid="select-work-type"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableWorkTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statusi</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "oferte"}>
                          <FormControl><SelectTrigger data-testid="select-status"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="oferte">{JOB_STATUS_LABELS.oferte}</SelectItem>
                            <SelectItem value="ne_progres">{JOB_STATUS_LABELS.ne_progres}</SelectItem>
                            <SelectItem value="e_perfunduar">{JOB_STATUS_LABELS.e_perfunduar}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    {initialData?.invoiceNumber && (
                      <FormItem>
                        <FormLabel>Nr. Fatures</FormLabel>
                        <div className="flex items-center gap-2 h-9 px-3 border rounded-md bg-muted/30">
                          <Hash className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-mono" data-testid="text-invoice-number">{initialData.invoiceNumber}</span>
                        </div>
                      </FormItem>
                    )}
                  </div>
                  <SupplierComparisonField
                    form={form}
                    suppliers={suppliers}
                    supplierPrices={supplierPrices}
                    catalog={catalog || []}
                    category={category}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="discountType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lloji i Zbritjes</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || "percent"}>
                          <FormControl><SelectTrigger data-testid="select-discount-type"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="percent">Perqindje (%)</SelectItem>
                            <SelectItem value="fixed">Shume Fikse (EUR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="discountValue" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vlera e Zbritjes</FormLabel>
                        <FormControl>
                          <div className="flex items-center border rounded-md bg-background">
                            <Tag className="w-4 h-4 text-muted-foreground ml-2" />
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              className="border-0"
                              placeholder="0"
                              value={field.value === 0 ? "" : field.value}
                              onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                              data-testid="input-discount-value"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>Shenime</FormLabel><FormControl><Textarea {...field} value={field.value || ""} readOnly className="bg-muted/30 text-muted-foreground cursor-not-allowed text-xs" data-testid="input-notes" /></FormControl></FormItem>
                  )} />
                </CardContent>
              </Card>
            </TabsContent>

            {tabVis.showPajisje && <TabsContent value="pajisje">{renderRoomTable()}</TabsContent>}
            {tabVis.showMateriale && <TabsContent value="materiale">{renderSimpleSection(materialItems, "table2Data")}</TabsContent>}
            {tabVis.showKamera && <TabsContent value="kamera">{renderSimpleSection(cameraItems, "cameraData")}</TabsContent>}
            {tabVis.showInterfon && <TabsContent value="interfon">{renderSimpleSection(intercomItems, "intercomData")}</TabsContent>}
            {tabVis.showAlarm && <TabsContent value="alarm">{renderSimpleSection(alarmItems, "alarmData")}</TabsContent>}
            {tabVis.showSherbime && <TabsContent value="sherbime">{renderSimpleSection(serviceItems, "serviceData")}</TabsContent>}
            <TabsContent value="financat">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base"><Banknote className="w-4 h-4" /> Pagesa & TVSH & Garancia</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground">TVSH (Tatimi mbi Vleren e Shtuar)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="vatRate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shkalla e TVSH-se (%)</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md bg-background">
                              <Percent className="w-4 h-4 text-muted-foreground ml-2" />
                              <Input type="number" step="0.5" min="0" max="100" className="border-0" placeholder="0" value={field.value === 0 ? "" : field.value} onChange={e => field.onChange(e.target.valueAsNumber || 0)} data-testid="input-vat-rate" />
                            </div>
                          </FormControl>
                          <p className="text-xs text-muted-foreground">0% = pa TVSH, 18% = standarde</p>
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground">Statusi i Pageses</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="paymentStatus" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Statusi</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || "pa_paguar"}>
                            <FormControl><SelectTrigger data-testid="select-payment-status"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="pa_paguar">Pa Paguar</SelectItem>
                              <SelectItem value="pjeserisht">Pjeserisht e Paguar</SelectItem>
                              <SelectItem value="paguar">E Paguar</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="paidAmount" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shuma e Paguar (EUR)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" placeholder="0.00" value={field.value === 0 ? "" : field.value} onChange={e => field.onChange(e.target.valueAsNumber || 0)} data-testid="input-paid-amount" />
                          </FormControl>
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="paymentDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data e Pageses</FormLabel>
                          <FormControl><Input type="date" {...field} value={field.value || ""} data-testid="input-payment-date" /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Menyra e Pageses</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl><SelectTrigger data-testid="select-payment-method"><SelectValue placeholder="Zgjidhni" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="bank">Bankë</SelectItem>
                              <SelectItem value="other">Tjetër</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground">Garancia</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="warrantyMonths" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Periudha e Garancise (muaj)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="120" placeholder="12" value={field.value === 12 ? "12" : field.value} onChange={e => field.onChange(e.target.valueAsNumber || 12)} data-testid="input-warranty-months" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground">Standarde: 12 muaj</p>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="completedDate" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data e Perfundimit</FormLabel>
                          <FormControl><Input type="date" {...field} value={field.value || ""} data-testid="input-completed-date" /></FormControl>
                          <p className="text-xs text-muted-foreground">Vendoset automatikisht kur statusi behet "E Perfunduar"</p>
                        </FormItem>
                      )} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="checklist">{renderChecklist()}</TabsContent>
            <TabsContent value="cmimet">{renderPricing()}</TabsContent>
          </Tabs>
        </form>
      </Form>

      {initialData && initialData.status === "e_perfunduar" && (
        <FeedbackSection jobId={initialData.id} />
      )}

      <MapDialog
        open={mapOpen}
        onOpenChange={setMapOpen}
        address={form.getValues("clientAddress") || ""}
        clientName={form.getValues("clientName") || ""}
        locationUrl={form.getValues("locationUrl") || ""}
      />

      {initialData && (
        <ShareDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          job={initialData}
        />
      )}
    </div>
  );
}
