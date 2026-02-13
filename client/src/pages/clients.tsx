import { Layout } from "@/components/layout";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Phone, MapPin, Mail, FileText, Briefcase, Trash2, Edit2, FileDown } from "lucide-react";
import { createElektronovaPDF, addPDFTable, addAllFooters } from "@/lib/pdf-utils";
import { calculateJobProgress } from "@/lib/job-progress";
import { useAuth } from "@/hooks/use-auth";
import type { Client, Job } from "@shared/schema";
import { JOB_STATUS_LABELS, JOB_CATEGORY_LABELS, type JobStatus, type JobCategory } from "@shared/schema";

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAdmin } = useAuth();

  const { data: allClients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const clients = search
    ? allClients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search)) ||
        (c.address && c.address.toLowerCase().includes(search.toLowerCase()))
      )
    : allClients;

  const { data: clientJobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/clients", selectedClient?.id, "jobs"],
    queryFn: async () => {
      if (!selectedClient) return [];
      const res = await fetch(`/api/clients/${selectedClient.id}/jobs`, { credentials: "include" });
      return res.json();
    },
    enabled: !!selectedClient,
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; address: string; email: string; notes: string }) => {
      const res = await apiRequest("POST", "/api/clients", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setShowAddDialog(false);
      toast({ title: "Klienti u shtua me sukses" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PUT", `/api/clients/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setEditClient(null);
      toast({ title: "Klienti u përditësua" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/clients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      setSelectedClient(null);
      toast({ title: "Klienti u fshi" });
    },
  });

  const generateClientsPDF = () => {
    const date = new Date().toISOString().split("T")[0];
    const { doc, startY } = createElektronovaPDF("LISTA E KLIENTEVE", date);
    addPDFTable(doc, startY,
      [["Nr.", "Emri", "Telefoni", "Adresa", "Email"]],
      clients.map((client, i) => [
        String(i + 1),
        client.name,
        client.phone || "",
        client.address || "",
        client.email || "",
      ]),
    );
    addAllFooters(doc, "Elektronova - Lista e Klienteve");
    doc.save(`Elektronova_Klientet_${date}.pdf`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-clients-title">Paneli i Klientëve</h1>
            <p className="text-muted-foreground">{allClients.length} klientë të regjistruar</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={generateClientsPDF} data-testid="button-pdf-clients">
              <FileDown className="h-4 w-4 mr-2" /> Shkarko PDF
            </Button>
            <Button onClick={() => setShowAddDialog(true)} data-testid="button-add-client">
              <Plus className="h-4 w-4 mr-2" /> Shto Klient
            </Button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Kërko klient sipas emrit, telefonit ose adresës..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-search-clients"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="font-semibold text-lg">Lista e Klientëve</h2>
            {isLoading ? (
              <p className="text-muted-foreground">Duke u ngarkuar...</p>
            ) : clients.length === 0 ? (
              <Card><CardContent className="p-6 text-center text-muted-foreground">
                {search ? "Asnjë rezultat" : "Asnjë klient i regjistruar"}
              </CardContent></Card>
            ) : (
              clients.map(client => (
                <Card
                  key={client.id}
                  className={`cursor-pointer transition-all ${selectedClient?.id === client.id ? 'ring-2 ring-primary' : 'hover-elevate'}`}
                  onClick={() => setSelectedClient(client)}
                  data-testid={`card-client-${client.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold" data-testid={`text-client-name-${client.id}`}>{client.name}</h3>
                        {client.phone && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" /> {client.phone}
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {client.address}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); setEditClient(client); }}
                          data-testid={`button-edit-client-${client.id}`}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button size="icon" variant="ghost" onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Fshi këtë klient?")) deleteMutation.mutate(client.id);
                          }} data-testid={`button-delete-client-${client.id}`}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div>
            {selectedClient ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      {selectedClient.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedClient.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${selectedClient.phone}`} className="text-primary hover:underline">{selectedClient.phone}</a>
                      </div>
                    )}
                    {selectedClient.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" /> {selectedClient.address}
                      </div>
                    )}
                    {selectedClient.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${selectedClient.email}`} className="text-primary hover:underline">{selectedClient.email}</a>
                      </div>
                    )}
                    {selectedClient.notes && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{selectedClient.notes}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <h3 className="font-semibold">Historiku i Punëve ({clientJobs.length})</h3>
                {clientJobs.length === 0 ? (
                  <Card><CardContent className="p-4 text-center text-muted-foreground">Asnjë punë e regjistruar</CardContent></Card>
                ) : (
                  clientJobs.map(job => (
                    <Card key={job.id} className="hover-elevate cursor-pointer"
                      onClick={() => setLocation(`/edit/${job.id}`)}
                      data-testid={`card-client-job-${job.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <span className="font-mono text-sm">{job.invoiceNumber}</span>
                            <span className="mx-2">-</span>
                            <span>{job.workType}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{JOB_CATEGORY_LABELS[job.category as JobCategory] || job.category}</Badge>
                            <Badge variant={job.status === "e_perfunduar" ? "default" : "secondary"}>
                              {JOB_STATUS_LABELS[job.status as JobStatus] || job.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{job.workDate}</p>
                        {job.status === "ne_progres" && job.category === "electric" && (() => {
                          const progress = calculateJobProgress(job);
                          if (progress.totalRooms === 0) return null;
                          return (
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] text-muted-foreground">{progress.completedRooms}/{progress.totalRooms} dhoma</span>
                                <span className="text-[10px] font-bold" style={{ color: progress.overallPercent === 100 ? '#22c55e' : progress.overallPercent > 50 ? '#3b82f6' : '#f59e0b' }}>{progress.overallPercent}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${progress.overallPercent}%`, backgroundColor: progress.overallPercent === 100 ? '#22c55e' : progress.overallPercent > 50 ? '#3b82f6' : '#f59e0b' }} />
                              </div>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  Zgjidhni një klient për të parë detajet
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <ClientFormDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isPending}
        />

        {editClient && (
          <ClientFormDialog
            open={!!editClient}
            onClose={() => setEditClient(null)}
            client={editClient}
            onSubmit={(data) => updateMutation.mutate({ id: editClient.id, data })}
            isLoading={updateMutation.isPending}
          />
        )}
      </div>
    </Layout>
  );
}

function ClientFormDialog({ open, onClose, client, onSubmit, isLoading }: {
  open: boolean;
  onClose: () => void;
  client?: Client;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState(client?.name || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [address, setAddress] = useState(client?.address || "");
  const [email, setEmail] = useState(client?.email || "");
  const [notes, setNotes] = useState(client?.notes || "");

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Ndrysho Klientin" : "Shto Klient të Ri"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name, phone, address, email, notes }); }} className="space-y-4">
          <div className="space-y-2">
            <Label>Emri *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} required data-testid="input-client-name" />
          </div>
          <div className="space-y-2">
            <Label>Telefoni</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} data-testid="input-client-phone" />
          </div>
          <div className="space-y-2">
            <Label>Adresa</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} data-testid="input-client-address" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} data-testid="input-client-email" />
          </div>
          <div className="space-y-2">
            <Label>Shënime</Label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} data-testid="input-client-notes" />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || !name} data-testid="button-save-client">
            {isLoading ? "Duke u ruajtur..." : "Ruaj"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
