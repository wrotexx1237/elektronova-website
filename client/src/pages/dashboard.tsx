import { useJobs, useDeleteJob } from "@/hooks/use-jobs";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
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
  Phone
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
import { useState } from "react";
import { JOB_CATEGORY_LABELS, type JobCategory } from "@shared/schema";

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

export default function Dashboard() {
  const { data: jobs, isLoading, error } = useJobs();
  const deleteJob = useDeleteJob();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredJobs = jobs?.filter(job => {
    const matchesSearch = job.clientName.toLowerCase().includes(search.toLowerCase()) || 
      job.clientAddress.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || (job.category || "electric") === categoryFilter;
    return matchesSearch && matchesCategory;
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
          {CATEGORY_CARDS.map(cat => (
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

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
            <SelectItem value="electric">Rrymë (Elektrike)</SelectItem>
            <SelectItem value="camera">Kamera</SelectItem>
            <SelectItem value="alarm">Alarm</SelectItem>
            <SelectItem value="intercom">Interfon</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
          {filteredJobs?.map((job) => {
            const catBadge = getCategoryBadgeProps(job.category);
            const CatIcon = catBadge.icon;
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

                <div className="mb-3">
                  <Badge variant="outline" className={`text-[10px] font-bold ${catBadge.className}`} data-testid={`badge-category-${job.id}`}>
                    <CatIcon className="h-3 w-3 mr-1" />
                    {catBadge.label}
                  </Badge>
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

                <div className="mt-6 pt-4 border-t flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    ID: #{job.id}
                  </span>
                  <Link href={`/edit/${job.id}`}>
                    <Button variant="ghost" size="sm" data-testid={`button-view-${job.id}`}>
                      Shiko Detajet
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
