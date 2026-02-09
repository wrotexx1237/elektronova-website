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
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";

export default function Dashboard() {
  const { data: jobs, isLoading, error } = useJobs();
  const deleteJob = useDeleteJob();
  const [search, setSearch] = useState("");

  const filteredJobs = jobs?.filter(job => 
    job.clientName.toLowerCase().includes(search.toLowerCase()) || 
    job.clientAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Procesverbalet</h1>
          <p className="text-muted-foreground mt-2 text-lg">Menaxho punimet dhe klientët</p>
        </div>
        
        <Link href="/new">
          <Button size="lg" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
            <Plus className="mr-2 h-5 w-5" />
            Procesverbal i Ri
          </Button>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="relative mb-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Kërko sipas emrit të klientit..." 
          className="pl-10 h-12 text-base rounded-xl border-2 focus-visible:ring-primary/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
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
            <Button variant="outline">Krijo tani</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs?.map((job) => (
            <div 
              key={job.id} 
              className="group bg-card hover:bg-card/50 border border-border/50 hover:border-primary/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {job.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {job.clientName}
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {job.workType}
                    </span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/edit/${job.id}`}>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Ndrysho
                      </DropdownMenuItem>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
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
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Fshije
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                    Shiko Detajet →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
