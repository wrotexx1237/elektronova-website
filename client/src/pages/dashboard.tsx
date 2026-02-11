import { useJobs, useDeleteJob, useDuplicateJob } from "@/hooks/use-jobs";
import { Layout } from "@/components/layout";
import { Link, useLocation } from "wouter";
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Edit,
  Loader2,
  AlertCircle,
  Zap,
  Camera,
  ShieldAlert,
  Phone,
  Copy,
  Hash,
  BookTemplate,
  Clock,
  MapPin,
  Send
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useMemo } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { JOB_CATEGORY_LABELS, JOB_STATUS_LABELS, type Job, type JobCategory, type JobStatus } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { MapDialog } from "@/components/map-dialog";
import { ShareDialog } from "@/components/share-dialog";

const CATEGORY_CARDS: { key: JobCategory; label: string; icon: typeof Zap; color: string }[] = [
  { key: "electric", label: "Rrymë (Elektrike)", icon: Zap, color: "text-amber-500" },
  { key: "camera", label: "Kamera", icon: Camera, color: "text-blue-500" },
  { key: "alarm", label: "Alarm", icon: ShieldAlert, color: "text-red-500" },
  { key: "intercom", label: "Interfon", icon: Phone, color: "text-green-500" },
];

function getCategoryBadgeProps(category: string | null | undefined) {
  switch (category) {
    case "electric": return { label: "RRYMË", icon: Zap, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    case "camera": return { label: "KAMERA", icon: Camera, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    case "alarm": return { label: "ALARM", icon: ShieldAlert, className: "bg-red-500/10 text-red-600 border-red-500/20" };
    case "intercom": return { label: "INTERFON", icon: Phone, className: "bg-green-500/10 text-green-600 border-green-500/20" };
    default: return { label: "RRYMË", icon: Zap, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
  }
}

function getStatusBadgeProps(status: string | null | undefined) {
  switch (status) {
    case "ne_progres": return { label: JOB_STATUS_LABELS.ne_progres, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    case "e_perfunduar": return { label: JOB_STATUS_LABELS.e_perfunduar, className: "bg-green-500/10 text-green-600 border-green-500/20" };
    default: return { label: JOB_STATUS_LABELS.oferte, className: "bg-orange-500/10 text-orange-600 border-orange-500/20" };
  }
}

function useSaveAsTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/jobs/${id}/save-template`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({ title: "Sukses", description: "Puna u ruajt si shabllone!" });
    },
    onError: (e: Error) => toast({ title: "Gabim", description: e.message, variant: "destructive" }),
  });
}

function useTemplates() {
  return useQuery<Job[]>({
    queryKey: ['/api/templates'],
  });
}

function useCreateFromTemplate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/templates/${id}/use`);
      return res.json();
    },
    onSuccess: (data: Job) => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({ title: "Sukses", description: "Punë e re u krijua nga shablloneja!" });
      navigate(`/edit/${data.id}`);
    },
    onError: (e: Error) => toast({ title: "Gabim", description: e.message, variant: "destructive" }),
  });
}

function formatTimestamp(ts: string | Date | null | undefined): string {
  if (!ts) return "-";
  const d = new Date(ts);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

export default function Dashboard() {
  const { data: jobs, isLoading, error } = useJobs();
  const deleteJob = useDeleteJob();
  const duplicateJob = useDuplicateJob();
  const saveTemplate = useSaveAsTemplate();
  const { data: templates } = useTemplates();
  const createFromTemplate = useCreateFromTemplate();
  const { user, isAdmin } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [mapJob, setMapJob] = useState<Job | null>(null);
  const [shareJob, setShareJob] = useState<Job | null>(null);

  const userCategories = user?.assignedCategories;
  const hasCategories = userCategories && userCategories.length > 0;

  const visibleCategoryCards = useMemo(() => {
    if (isAdmin || !hasCategories) return CATEGORY_CARDS;
    return CATEGORY_CARDS.filter(c => userCategories!.includes(c.key));
  }, [isAdmin, hasCategories, userCategories]);

  const regularJobs = (jobs || []).filter((j: Job) => !j.isTemplate);

  const filteredJobs = regularJobs.filter((job: Job) => {
    const matchesSearch = job.clientName.toLowerCase().includes(search.toLowerCase()) || 
      job.clientAddress.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || (job.category || "electric") === categoryFilter;
    const matchesStatus = statusFilter === "all" || (job.status || "oferte") === statusFilter;
    const matchesDateFrom = !dateFrom || job.workDate >= dateFrom;
    const matchesDateTo = !dateTo || job.workDate <= dateTo;
    return matchesSearch && matchesCategory && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-dashboard-title">Procesverbalet</h1>
          <p className="text-muted-foreground mt-2 text-lg">Menaxho punimet dhe klientët</p>
        </div>
        <Link href="/new">
          <Button size="lg" className="shadow-lg shadow-primary/20" data-testid="button-new-job">
            <Plus className="mr-2 h-5 w-5" />
            Procesverbal i Ri
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3" data-testid="text-quick-create-title">Krijo Punë të Re (Shpejt)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visibleCategoryCards.map(cat => (
            <Link key={cat.key} href={`/new?category=${cat.key}`}>
              <Card className="hover-elevate cursor-pointer group" data-testid={`card-category-${cat.key}`}>
                <CardContent className="flex flex-col items-center justify-center py-5 gap-2">
                  <div className={`p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors ${cat.color}`}>
                    <cat.icon className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-bold text-center">{cat.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Kërko sipas emrit të klientit..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-category-filter">
              <SelectValue placeholder="Të gjitha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të gjitha kategoritë</SelectItem>
              {visibleCategoryCards.map(c => (
                <SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-status-filter">
              <SelectValue placeholder="Të gjitha statuset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Të gjitha statuset</SelectItem>
              <SelectItem value="oferte">Ofertë</SelectItem>
              <SelectItem value="ne_progres">Në Progres</SelectItem>
              <SelectItem value="e_perfunduar">E Përfunduar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Nga:</span>
            <Input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-[150px]"
              data-testid="input-date-from"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Deri:</span>
            <Input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-[150px]"
              data-testid="input-date-to"
            />
          </div>
          {(dateFrom || dateTo) && (
            <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); }} data-testid="button-clear-dates">
              Pastro datat
            </Button>
          )}
        </div>
      </div>

      {templates && templates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2" data-testid="text-templates-title">
            <BookTemplate className="w-4 h-4" /> Shabllone Pune
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {templates.map((tpl: Job) => {
              const catBadge = getCategoryBadgeProps(tpl.category);
              const CatIcon = catBadge.icon;
              return (
                <Card key={tpl.id} className="hover-elevate cursor-pointer group" data-testid={`card-template-${tpl.id}`}>
                  <CardContent className="py-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm truncate">{tpl.workType}</span>
                      <Badge variant="outline" className={`text-[10px] font-bold shrink-0 no-default-hover-elevate no-default-active-elevate ${catBadge.className}`}>
                        <CatIcon className="h-3 w-3 mr-1" />
                        {catBadge.label}
                      </Badge>
                    </div>
                    {tpl.notes && <p className="text-xs text-muted-foreground line-clamp-2">{tpl.notes}</p>}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => createFromTemplate.mutate(tpl.id)}
                      disabled={createFromTemplate.isPending}
                      data-testid={`button-use-template-${tpl.id}`}
                    >
                      <Plus className="w-3 h-3 mr-1" /> Përdor Shabllonën
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Duke ngarkuar të dhënat...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-destructive">
          <AlertCircle className="h-10 w-10 mb-4" />
          <p>Gabim gjatë ngarkimit të të dhënave.</p>
        </div>
      ) : filteredJobs?.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted-foreground/20">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold">Nuk u gjet asnjë procesverbal</h3>
          <p className="text-muted-foreground mt-2 mb-6">Krijo të parin për të filluar punën.</p>
          <Link href="/new">
            <Button variant="outline" data-testid="button-create-first">Krijo tani</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs?.map((job: Job) => {
            const catBadge = getCategoryBadgeProps(job.category);
            const CatIcon = catBadge.icon;
            const statusBadge = getStatusBadgeProps(job.status);
            return (
              <div 
                key={job.id} 
                className="group bg-card border border-border/50 hover:border-primary/50 rounded-2xl p-6 shadow-sm hover-elevate"
                data-testid={`card-job-${job.id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                      {job.clientName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors truncate" data-testid={`text-client-name-${job.id}`}>
                        {job.clientName}
                      </h3>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                        {job.workType}
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${job.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/edit/${job.id}`}>
                        <DropdownMenuItem data-testid={`button-edit-${job.id}`}>
                          <Edit className="mr-2 h-4 w-4" /> Ndrysho
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem 
                        onClick={() => duplicateJob.mutate(job.id)}
                        data-testid={`button-duplicate-${job.id}`}
                      >
                        <Copy className="mr-2 h-4 w-4" /> Duplikato
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => saveTemplate.mutate(job.id)}
                        data-testid={`button-save-template-${job.id}`}
                      >
                        <BookTemplate className="mr-2 h-4 w-4" /> Ruaj si Shabllone
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive" data-testid={`button-delete-${job.id}`}>
                            <Trash2 className="mr-2 h-4 w-4" /> Fshije
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>A jeni i sigurt?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ky veprim nuk mund të kthehet prapa. Procesverbali për {job.clientName} do të fshihet përgjithmonë.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Anulo</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteJob.mutate(job.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Fshije
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline" className={`text-[10px] font-bold no-default-hover-elevate no-default-active-elevate ${catBadge.className}`} data-testid={`badge-category-${job.id}`}>
                    <CatIcon className="h-3 w-3 mr-1" />
                    {catBadge.label}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] font-bold no-default-hover-elevate no-default-active-elevate ${statusBadge.className}`} data-testid={`badge-status-${job.id}`}>
                    {statusBadge.label}
                  </Badge>
                  {job.invoiceNumber && (
                    <Badge variant="outline" className="text-[10px] font-mono no-default-hover-elevate no-default-active-elevate" data-testid={`badge-invoice-${job.id}`}>
                      <Hash className="h-3 w-3 mr-0.5" />
                      {job.invoiceNumber}
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                    <Calendar className="mr-2 h-4 w-4" />
                    {job.workDate}
                  </div>
                  <div className="text-sm text-foreground/80 line-clamp-2 min-h-[2.5rem]">
                    {job.notes || "Pa shënime shtesë."}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t space-y-2">
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1" data-testid={`text-created-${job.id}`}>
                      <Clock className="w-3 h-3" /> Krijuar: {formatTimestamp(job.createdAt)}
                    </span>
                    {job.updatedAt && job.updatedAt !== job.createdAt && (
                      <span className="flex items-center gap-1" data-testid={`text-updated-${job.id}`}>
                        <Edit className="w-3 h-3" /> Ndryshuar: {formatTimestamp(job.updatedAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMapJob(job)} title="Harta" data-testid={`button-map-${job.id}`}>
                        <MapPin className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShareJob(job)} title="Ndaj" data-testid={`button-share-${job.id}`}>
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Link href={`/edit/${job.id}`}>
                      <Button variant="ghost" size="sm" data-testid={`button-view-${job.id}`}>
                        Shiko Detajet
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mapJob && (
        <MapDialog
          open={!!mapJob}
          onOpenChange={(open) => !open && setMapJob(null)}
          address={mapJob.clientAddress}
          clientName={mapJob.clientName}
        />
      )}

      {shareJob && (
        <ShareDialog
          open={!!shareJob}
          onOpenChange={(open) => !open && setShareJob(null)}
          job={shareJob}
        />
      )}
    </Layout>
  );
}
