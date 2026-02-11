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
import { Search, Plus, Phone, MapPin, Mail, FileText, Truck, Trash2, Edit2, Tags } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Supplier } from "@shared/schema";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  const { data: allSuppliers = [], isLoading } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
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
      toast({ title: "Furnitori u fshi" });
    },
  });

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

        <Card data-testid="card-suppliers-summary">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Totali i Furnitorëve</p>
                <p className="text-2xl font-bold" data-testid="text-total-suppliers">{allSuppliers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                    </div>
                    <div className="flex gap-1 shrink-0">
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
      </div>
    </Layout>
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
