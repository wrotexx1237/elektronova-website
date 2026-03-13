import { Layout } from "@/components/layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bell, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Info,
  Calendar,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Notification } from "@shared/schema";
import { format } from "date-fns";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });

  const markRead = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("PUT", `/api/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      await apiRequest("PUT", "/api/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
      toast({ title: "Të gjitha u shënuan si të lexuara" });
    },
  });

  const deleteNotif = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
    },
  });

  const clearAll = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/notifications");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/notifications/unread-count"] });
      toast({ title: "Të gjitha njoftimet u fshinë" });
    },
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "debt_alert": return <CreditCard className="h-5 w-5 text-red-500" />;
      case "warranty_expiry": return <ShieldCheck className="h-5 w-5 text-amber-500" />;
      case "weekly_summary": return <Calendar className="h-5 w-5 text-blue-500" />;
      case "job_created": return <Info className="h-5 w-5 text-primary" />;
      default: return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case "debt_alert": return <Badge variant="destructive" className="text-[10px]">BORXH</Badge>;
      case "warranty_expiry": return <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-600">GARANCIA</Badge>;
      case "weekly_summary": return <Badge variant="outline" className="text-[10px] border-blue-500 text-blue-600">RAPORT</Badge>;
      default: return <Badge variant="secondary" className="text-[10px]">NJOFTIM</Badge>;
    }
  };

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Njoftimet</h1>
          <p className="text-muted-foreground mt-2 text-lg">Menaxho njoftimet dhe alertet e sistemit</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending || !notifications?.some(n => !n.isRead)}
          >
            Marko të gjitha si të lexuara
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => clearAll.mutate()}
            disabled={clearAll.isPending || notifications?.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Fshij të gjitha
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Duke ngarkuar njoftimet...</p>
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <Card className="border-dashed border-2 bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Nuk ka njoftime</h3>
              <p className="text-muted-foreground mt-2">Nëse ndodh diçka e rëndësishme, do t'ju njoftojmë këtu.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <Card 
                key={n.id} 
                className={`transition-all hover:shadow-md cursor-pointer border-l-4 ${n.isRead ? 'border-l-muted opacity-80' : 'border-l-primary bg-primary/5'}`}
                onClick={() => { if (!n.isRead) markRead.mutate(n.id); }}
              >
                <CardContent className="p-5 flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${n.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getBadge(n.type)}
                      {!n.isRead && <Badge className="bg-primary text-primary-foreground text-[8px] h-4">IRI</Badge>}
                      <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        {n.createdAt && format(new Date(n.createdAt), 'dd MMMM, HH:mm')}
                      </span>
                    </div>
                    <h3 className={`text-base font-bold mb-1 ${!n.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {n.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {n.message}
                    </p>
                    
                    {n.jobId && (
                      <div className="mt-3">
                        <Link href={`/edit/${n.jobId}`}>
                          <Button variant="ghost" className="p-0 h-auto text-primary text-xs font-bold hover:bg-transparent" onClick={(e) => e.stopPropagation()}>
                            Shiko Procesverbalin <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!n.isRead && (
                        <DropdownMenuItem onClick={() => markRead.mutate(n.id)}>
                          <CheckCircle className="mr-2 h-4 w-4" /> Shëno si i lexuar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteNotif.mutate(n.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Fshij
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
