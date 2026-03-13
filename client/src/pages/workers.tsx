import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Worker, InsertWorker } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Search, FileText, Download, Edit, Eye, User, Briefcase, Calendar, Users, Building2, Lightbulb, ChevronRight, FileCheck, ShieldCheck, AlertCircle, CheckCircle2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import WorkerForm from "./../components/WorkerForm";
import WorkerDetailsTabs from "./../components/WorkerDetailsTabs";
import { generateContractPDF } from "@/lib/pdf-contract";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<string>("lista");
    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isGenerateBatchOpen, setIsGenerateBatchOpen] = useState(false);
    const [batchData, setBatchData] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const { toast } = useToast();

    const { data: workers = [], isLoading } = useQuery<Worker[]>({
        queryKey: ["/api/workers"],
    });

    const { data: workerStatuses = [] } = useQuery<{ workerId: number, status: 'Active' | 'Finished' | 'Idle' }[]>({
        queryKey: ["/api/workers/status"],
        refetchInterval: 30000, // Refresh every 30s
    });

    const createWorkerMutation = useMutation({
        mutationFn: async (data: InsertWorker) => {
            const res = await apiRequest("POST", "/api/workers", data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
            setIsAddDialogOpen(false);
            toast({
                title: "Punëtori u regjistrua me sukses",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Gabim gjatë regjistrimit",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const updateWorkerMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWorker> }) => {
            const res = await apiRequest("PUT", `/api/workers/${id}`, data);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
            setSelectedWorker(null);
            toast({
                title: "Punëtori u përditësua me sukses",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Gabim gjatë përditësimit",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const deleteWorkerMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/workers/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
            toast({
                title: "Punëtori u fshi me sukses",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Gabim gjatë fshirjes",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const generateBatchPayslipsMutation = useMutation({
        mutationFn: async (data: { month: number, year: number }) => {
            const res = await apiRequest("POST", "/api/payslips/batch", data);
            return res.json();
        },
        onSuccess: (data) => {
            setIsGenerateBatchOpen(false);
            toast({
                title: "Fletëpagesat u gjeneruan",
                description: data.message,
            });
            // We should ideally search the cache and invalidate all workers' payslips,
            // but just invalidating the main workers query is fine right now or they will refetch individually.
             queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
        },
        onError: (error: Error) => {
            toast({
                title: "Gabim",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const tips = [
        "Përditëso rregullisht kontratat para skadimit dhe gjenero kontratën PDF të re sapo të ndryshojnë të dhënat e punëtorit (pagat, pozita).",
        "Shto të gjitha të dhënat e sakta për llogaritë bankare të punëtorëve për të evituar vonesat në ekzekutimin e pagave.",
        "Kujdes me afatet e periudhës provuese! Kontrollo rregullisht punëtorët që janë ende në fazën testuese të kontratës.",
    ];

    // Effect to auto-rotate tips
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTipIndex((prev) => (prev + 1) % tips.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [tips.length]);

    const filteredWorkers = workers.filter((worker) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            worker.name.toLowerCase().includes(searchLower) ||
            worker.personalNumber.toLowerCase().includes(searchLower) ||
            (worker.email && worker.email.toLowerCase().includes(searchLower)) ||
            worker.position.toLowerCase().includes(searchLower) ||
            worker.profession.toLowerCase().includes(searchLower) ||
            worker.department.toLowerCase().includes(searchLower)
        );
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <Layout>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-12"
            >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Regjistri i HR</h1>
                        <p className="text-muted-foreground mt-2">
                            Menaxho stafin, fletëpagesat mujore dhe kontratat
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Kërko punëtor..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                            <Dialog open={isGenerateBatchOpen} onOpenChange={setIsGenerateBatchOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full sm:w-auto bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 shadow-sm transition-all duration-300">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Gjenero Pagat
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Gjenero Fletëpagesat për të Gjithë</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <p className="text-sm text-muted-foreground">Ky proces do të llogarisë pagën neto, pensionin, tatimin dhe overtimin automatikisht për secilin punëtor aktiv.</p>
                                        <div className="space-y-2">
                                            <Label>Muaji</Label>
                                            <Input type="number" min="1" max="12" value={batchData.month} onChange={e => setBatchData({...batchData, month: parseInt(e.target.value)})} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Viti</Label>
                                            <Input type="number" value={batchData.year} onChange={e => setBatchData({...batchData, year: parseInt(e.target.value)})} />
                                        </div>
                                        <Button 
                                            onClick={() => generateBatchPayslipsMutation.mutate(batchData)} 
                                            disabled={generateBatchPayslipsMutation.isPending}
                                            className="w-full h-12 text-lg font-bold"
                                        >
                                            {generateBatchPayslipsMutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                            Krijo Fletëpagesat
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="shadow-lg hover:shadow-primary/20 transition-all duration-300 w-full sm:w-auto">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Shto Punëtor të Ri
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Regjistro Punëtor të Ri</DialogTitle>
                                    </DialogHeader>
                                    <WorkerForm
                                        onSubmit={(data: InsertWorker) => createWorkerMutation.mutate(data)}
                                        isSubmitting={createWorkerMutation.isPending}
                                    />
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Custom Sub-Navigation Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/50 scrollbar-hide">
                    {[
                        { id: 'lista', label: 'Lista e Punëtorëve', icon: Users },
                        { id: 'dokumentet', label: 'Dokumentet & Kontratat', icon: FileCheck },
                        { id: 'siguria', label: 'Siguria në Punë', icon: ShieldCheck },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'lista' && (
                        <motion.div
                            key="lista"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Interactive Tips Carousel */}
                            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/50 dark:from-blue-900/10 dark:to-indigo-900/10 dark:border-blue-800/20 rounded-2xl p-5 flex gap-4 items-start shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                                <div className="bg-white dark:bg-blue-950 p-3 rounded-xl text-blue-600 dark:text-blue-400 shrink-0 shadow-sm border border-blue-100 dark:border-blue-900 z-10">
                                    <Lightbulb className="w-5 h-5 animate-pulse" />
                                </div>
                                <div className="flex-1 min-w-0 z-10">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <h4 className="font-bold text-blue-950 dark:text-blue-100 text-sm tracking-tight">Këshillë Profesionale HR</h4>
                                        <div className="flex gap-1">
                                            {tips.map((_, i) => (
                                                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i === currentTipIndex ? 'bg-blue-500' : 'bg-blue-200 dark:bg-blue-800'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.p
                                            key={currentTipIndex}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-sm font-medium text-blue-800/80 dark:text-blue-200/80 leading-relaxed"
                                        >
                                            {tips[currentTipIndex]}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Top Controls Row */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                                    <Card className="shadow-sm border-border/60 hover:border-primary/30 transition-colors">
                                        <CardContent className="flex items-center gap-3 py-4">
                                            <div className="p-2.5 rounded-xl bg-primary/10">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{workers.length}</p>
                                                <p className="text-xs text-muted-foreground font-medium">Totali Punëtorëve</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm border-border/60 hover:border-indigo-500/30 transition-colors">
                                        <CardContent className="flex items-center gap-3 py-4">
                                            <div className="p-2.5 rounded-xl bg-indigo-500/10">
                                                <Briefcase className="h-5 w-5 text-indigo-500" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold">{new Set(workers.map(w => w.position)).size}</p>
                                                <p className="text-xs text-muted-foreground font-medium">Pozita Aktive</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="shadow-sm border-border/60 hover:border-blue-500/30 transition-colors hidden md:block">
                                        <CardContent className="flex items-center gap-3 py-4">
                                            <div className="p-2.5 rounded-xl bg-blue-500/10">
                                                <Building2 className="h-5 w-5 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black tracking-tight">{new Set(workers.map(w => w.department)).size}</p>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">Departamente</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="w-full md:w-80 shrink-0">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Kërko me emër, pozitë..."
                                            className="pl-9 bg-background shadow-sm border-border/60 hover:border-primary/40 transition-colors focus-visible:ring-primary/20 h-11"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {workers.filter(w => w.contractType && w.contractType !== "Pacaktuar").length > 0 && (
                                <div className="bg-amber-50/50 border border-amber-200/50 dark:bg-amber-900/10 dark:border-amber-800/30 rounded-xl p-4 shadow-sm flex items-start gap-4 mb-6">
                                    <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-lg text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">Kontrata me Afat / Kohë të Caktuar</h4>
                                        <p className="text-xs font-medium text-amber-800/80 dark:text-amber-200/80 leading-relaxed max-w-2xl mt-1">
                                            Keni <strong>{workers.filter(w => w.contractType && w.contractType !== "Pacaktuar").length}</strong> punëtor(ë) me kontrata provë ose me afat të caktuar.
                                            <br/>Kushtoni vëmendje skadimeve kur t'i gjeneroni fletëpagesat.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                                {filteredWorkers.map((worker, index) => (
                                    <motion.div
                                        key={worker.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="flex flex-col h-full hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50 overflow-hidden group">
                                            <CardHeader className="pb-4 relative">
                                                {/* Decorative background blur */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                                                <div className="flex justify-between items-start relative z-10">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20 shadow-inner">
                                                            {worker.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <CardTitle className="text-lg font-bold text-foreground">{worker.name}</CardTitle>
                                                                {(() => {
                                                                    const status = workerStatuses.find(s => s.workerId === worker.id)?.status || 'Idle';
                                                                    if (status === 'Active') return <Badge className="bg-green-500 text-[10px] h-4 px-1.5 uppercase font-black animate-pulse">Aktiv</Badge>;
                                                                    if (status === 'Finished') return <Badge className="bg-blue-500 text-[10px] h-4 px-1.5 uppercase font-black">Përfunduar</Badge>;
                                                                    return <Badge variant="outline" className="text-[10px] h-4 px-1.5 uppercase font-black text-muted-foreground opacity-50">Idle</Badge>;
                                                                })()}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground font-medium">
                                                                <Briefcase className="w-3.5 h-3.5" />
                                                                {worker.position}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-2 flex-1 flex flex-col justify-between relative z-10">
                                                <div className="space-y-4 mb-6">
                                                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                                                        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                                                            <div>
                                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Departamenti</p>
                                                                <p className="text-sm font-medium flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                                    {worker.department}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Fillimi i punës</p>
                                                                <p className="text-sm font-medium flex items-center gap-1.5">
                                                                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                                    {worker.startDate}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="px-1">
                                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1">Kontakti</p>
                                                        <p className="text-sm font-medium">{worker.phone}</p>
                                                        {worker.email && <p className="text-sm text-muted-foreground truncate">{worker.email}</p>}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 mt-auto pt-4 border-t border-border/50">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1 bg-background shadow-sm hover:bg-muted"
                                                        onClick={() => setSelectedWorker(worker)}
                                                    >
                                                        <FileText className="w-4 h-4 mr-2 text-muted-foreground" />
                                                        Detajet
                                                    </Button>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="w-9 h-9 shadow-sm"
                                                            title="Shiko Kontratën"
                                                            onClick={() => generateContractPDF(worker, 'preview')}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="default"
                                                            size="icon"
                                                            className="w-9 h-9 shadow-sm"
                                                            title="Shkarko Kontratën"
                                                            onClick={() => generateContractPDF(worker, 'save')}
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="icon"
                                                            className="w-9 h-9 shadow-sm bg-red-500 hover:bg-red-600 focus:ring-red-500"
                                                            title="Fshi Punëtorin"
                                                            onClick={() => {
                                                                if (window.confirm("A jeni të sigurt që dëshironi ta fshini këtë punëtor? Kjo mundësi nuk mund të rikthehet!")) {
                                                                    deleteWorkerMutation.mutate(worker.id);
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-white" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}

                                {filteredWorkers.length === 0 && (
                                    <div className="col-span-full py-12 text-center border rounded-lg bg-muted/20">
                                        <p className="text-muted-foreground">Nuk u gjet asnjë punëtor</p>
                                        {searchQuery && (
                                            <Button
                                                variant="ghost"
                                                onClick={() => setSearchQuery("")}
                                                className="mt-2"
                                            >
                                                Pastro kërkimin
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'dokumentet' && (
                        <motion.div
                            key="dokumentet"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-border/50 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <FileCheck className="w-5 h-5 text-blue-500" />
                                            Kontratat e Punës
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                                            <p className="text-sm text-foreground/80 mb-3">Zgjidhni një punëtor nga lista për të gjeneruar dhe menaxhuar kontratën aktuale të punës sipas Ligjit të Punës në Kosovë.</p>
                                            <Button variant="outline" className="w-full text-sm font-medium" onClick={() => setActiveTab('lista')}>
                                                <Users className="w-4 h-4 mr-2" /> Kthehu tek Lista e Punëtorëve
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-border/50 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                    <CardHeader className="relative z-10">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Download className="w-5 h-5 text-primary" />
                                            Dokumente Ndihmëse
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 relative z-10">
                                        {[
                                            { name: "Letërnjoftimi / Pasaporta", status: "Kërkohet nga punëtori" },
                                            { name: "Certifikata e Mjekut", status: "Rekomandohet (Për punë në lartësi)" },
                                            { name: "Vërtetim nga Gjykata", status: "Për pozita menaxheriale" },
                                            { name: "Kopja e Diplomës", status: "Fakultative" },
                                        ].map((doc, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 shadow-sm hover:border-primary/30 transition-colors">
                                                <div>
                                                    <p className="font-semibold text-sm">{doc.name}</p>
                                                    <p className="text-xs text-muted-foreground">{doc.status}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    onClick={async () => {
                                                        try {
                                                            await apiRequest("POST", "/api/notifications", {
                                                                type: "worker_request",
                                                                title: "Kërkesë për Dokument",
                                                                message: `Kërkesa për ngarkimin e ${doc.name} u dërgua tek punëtori ${selectedWorker?.name || 'i zgjedhur'}.`,
                                                            });
                                                            toast({
                                                                title: "Kërkesa u dërgua",
                                                                description: `Kërkesa për ngarkimin e ${doc.name} u regjistrua në sistem.`,
                                                            });
                                                        } catch (err) {
                                                            toast({
                                                                title: "Gabim",
                                                                description: "Dërgimi i kërkesës dështoi.",
                                                                variant: "destructive"
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Plus className="w-4 h-4 text-primary" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'siguria' && (
                        <motion.div
                            key="siguria"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <div className="bg-amber-50/50 border border-amber-200/50 dark:bg-amber-900/10 dark:border-amber-800/30 rounded-xl p-5 shadow-sm">
                                <div className="flex gap-4">
                                    <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-xl text-amber-600 dark:text-amber-400 shrink-0 h-fit">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1">Pajisjet Mbrojtëse Personale (PMP)</h3>
                                        <p className="text-sm text-amber-800/80 dark:text-amber-200/80 max-w-2xl leading-relaxed">
                                            Sipas rregullores për Sigurinë dhe Shëndetin në Punë, çdo punëtor në terren është i obliguar të pajiset dhe të regjistrojë përdorimin e pajisjeve përkatëse para çdo intervenimi.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { title: "Kamera & Siguri", items: ["Kaskë Mbrojtëse", "Rrip Sigurimi (Lartësi)", "Doreza Izoluese", "Këpucë me mbrojtje"] },
                                    { title: "Instalime Elektrike", items: ["Doreza për tension", "Shpuese elektrike", "Syze mbrojtëse", "Matës Tensioni i Testuar"] },
                                    { title: "Mirëmbajtje", items: ["Xhaketë fosforeshente", "Kutiu i ndihmës së parë", "Pastrues specifik"] },
                                ].map((cat, index) => (
                                    <Card key={index} className="border-border/50 shadow-sm">
                                        <CardHeader className="pb-3 border-b border-border/50 mb-3 bg-muted/20">
                                            <CardTitle className="text-base font-bold flex items-center justify-between">
                                                {cat.title}
                                                <Badge variant="outline" className="text-[10px] bg-background">Obligative</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ul className="space-y-3">
                                                {cat.items.map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                                        <div className="w-5 h-5 rounded-md border border-primary/40 flex items-center justify-center bg-primary/10 text-primary">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                        </div>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                            <Button
                                                variant="secondary"
                                                className="w-full mt-6 text-xs"
                                                size="sm"
                                                onClick={async () => {
                                                    try {
                                                        await apiRequest("POST", "/api/notifications", {
                                                            type: "safety_submission",
                                                            title: "Dorëzim Pajisjesh PMP",
                                                            message: `Pajisjet për ${cat.title} janë konfirmuar si të doruara për punëtorin ${selectedWorker?.name || 'i zgjedhur'}.`,
                                                        });
                                                        toast({
                                                            title: "Dorëzimi u regjistrua",
                                                            description: `Pajisjet për ${cat.title} janë konfirmuar si të doruara.`,
                                                        });
                                                    } catch (err) {
                                                        toast({
                                                            title: "Gabim",
                                                            description: "Regjistrimi i dorëzimit dështoi.",
                                                            variant: "destructive"
                                                        });
                                                    }
                                                }}
                                            >
                                                Dokumento Dorëzimin
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    <Dialog open={!!selectedWorker} onOpenChange={(open) => !open && setSelectedWorker(null)}>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Detajet e Punëtorit / Përditëso</DialogTitle>
                            </DialogHeader>
                            {selectedWorker && (
                                <WorkerDetailsTabs
                                    worker={selectedWorker}
                                    onSubmitUpdate={(data: InsertWorker) => updateWorkerMutation.mutate({ id: selectedWorker.id, data })}
                                    isUpdating={updateWorkerMutation.isPending}
                                />
                            )}
                        </DialogContent>
                    </Dialog>

                </AnimatePresence>
            </motion.div>
        </Layout>
    );
}
