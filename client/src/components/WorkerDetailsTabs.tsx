import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Worker, InsertWorker, LeaveRequest, Attendance, Payslip, WorkerHistory, insertLeaveRequestSchema } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Clock, FileText, History, Palmtree, User, Download, Plus, Trash2, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import WorkerForm from "./WorkerForm";
import { generatePayslipPDF } from "@/lib/pdf-payslip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    worker: Worker;
    onSubmitUpdate: (data: InsertWorker) => void;
    isUpdating: boolean;
}

export default function WorkerDetailsTabs({ worker, onSubmitUpdate, isUpdating }: Props) {
    const [activeTab, setActiveTab] = useState("info");
    const { toast } = useToast();

    // Dialog states
    const [isLeaveOpen, setIsLeaveOpen] = useState(false);
    const [isPayslipOpen, setIsPayslipOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isQrOpen, setIsQrOpen] = useState(false);

    // Form data states
    const [leaveData, setLeaveData] = useState<Partial<LeaveRequest>>({ type: "Vjetor", status: "Aprovuar" });
    const [attendanceData, setAttendanceData] = useState<Partial<Attendance>>({ date: new Date().toISOString().split('T')[0] });
    const [payslipData, setPayslipData] = useState<Partial<Payslip>>({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), status: "E Paguar" });
    const [historyData, setHistoryData] = useState<Partial<WorkerHistory>>({ changeType: "Paga", effectiveDate: new Date().toISOString().split('T')[0] });

    // Queries
    const { data: leaves = [], isLoading: loadingLeaves } = useQuery<LeaveRequest[]>({
        queryKey: [`/api/leave-requests?workerId=${worker.id}`],
    });
    
    const { data: attendances = [], isLoading: loadingAttendances } = useQuery<Attendance[]>({
        queryKey: [`/api/attendance?workerId=${worker.id}`],
    });

    const { data: payslips = [], isLoading: loadingPayslips } = useQuery<Payslip[]>({
        queryKey: [`/api/payslips?workerId=${worker.id}`],
    });

    const { data: history = [], isLoading: loadingHistory } = useQuery<WorkerHistory[]>({
        queryKey: [`/api/worker-history?workerId=${worker.id}`],
    });

    // Mutations
    const createLeaveMutation = useMutation({
        mutationFn: async (data: Partial<LeaveRequest>) => {
            const payload = { ...data, workerId: worker.id };
            // Simple validation
            if (!payload.startDate || !payload.endDate || !payload.days) {
                throw new Error("Ju lutem plotësoni datat dhe ditët.");
            }
            const res = await apiRequest("POST", "/api/leave-requests", payload);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/leave-requests?workerId=${worker.id}`] });
            setIsLeaveOpen(false);
            setLeaveData({ type: "Vjetor", status: "Aprovuar" }); // reset
            toast({ title: "Pushimi u regjistrua me sukses" });
        },
        onError: (error: Error) => {
            toast({ title: "Gabim në regjistrim", description: error.message, variant: "destructive" });
        }
    });

    const updateLeaveMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number, status: string }) => {
            const res = await apiRequest("PUT", `/api/leave-requests/${id}`, { status });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/leave-requests?workerId=${worker.id}`] });
            toast({ title: "Statusi u përditësua me sukses" });
        },
        onError: (error: Error) => {
            toast({ title: "Gabim në përditësim", description: error.message, variant: "destructive" });
        }
    });

    const createAttendanceMutation = useMutation({
        mutationFn: async (data: Partial<Attendance> & { id?: number }) => {
            const payload = { ...data, workerId: worker.id };
            if (data.id) {
                const res = await apiRequest("PUT", `/api/attendance/${data.id}`, payload);
                return res.json();
            } else {
                const res = await apiRequest("POST", "/api/attendance", payload);
                return res.json();
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/attendance?workerId=${worker.id}`] });
            toast({ title: "Vijueshmëria u regjistrua me sukses" });
        },
        onError: (error: Error) => {
            toast({ title: "Gabim në regjistrim", description: error.message, variant: "destructive" });
        }
    });

    const createPayslipMutation = useMutation({
        mutationFn: async (data: Partial<Payslip>) => {
            if (!data.month || !data.year) throw new Error("Muaji dhe viti janë të detyrueshme.");
            
            const pension = worker.salary * 0.05;
            const taxable = worker.salary - pension;
            let tax = 0;
            if (taxable > 80 && taxable <= 250) tax = (taxable - 80) * 0.04;
            else if (taxable > 250 && taxable <= 450) tax = (170 * 0.04) + ((taxable - 250) * 0.08);
            else if (taxable > 450) tax = (170 * 0.04) + (200 * 0.08) + ((taxable - 450) * 0.10);
            const net = worker.salary - pension - tax + (data.bonuses || 0) - (data.deductions || 0);

            const payload = {
                ...data,
                workerId: worker.id,
                grossSalary: worker.salary,
                netSalary: net,
                pensionContribution: pension,
                taxAmount: tax
            };
            const res = await apiRequest("POST", "/api/payslips", payload);
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/payslips?workerId=${worker.id}`] });
            setIsPayslipOpen(false);
            setPayslipData({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), status: "E Paguar", bonuses: 0, deductions: 0 });
            toast({ title: "Fletëpagesa u gjenerua me sukses" });
        },
        onError: (error: Error) => {
            toast({ title: "Gabim", description: error.message, variant: "destructive" });
        }
    });

    const deletePayslipMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiRequest("DELETE", `/api/payslips/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/payslips?workerId=${worker.id}`] });
            toast({ title: "Fletëpagesa u fshi me sukses" });
        },
        onError: (error: Error) => {
            toast({ title: "Gabim", description: error.message, variant: "destructive" });
        }
    });

    const createHistoryMutation = useMutation({
        mutationFn: async (data: Partial<WorkerHistory>) => {
            if (!data.changeType || !data.newValue || !data.effectiveDate) {
                throw new Error("Tipi, Vlera e Re dhe Data janë të detyrueshme.");
            }
            const res = await apiRequest("POST", "/api/worker-history", { ...data, workerId: worker.id });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/worker-history?workerId=${worker.id}`] });
            setIsHistoryOpen(false);
            setHistoryData({ changeType: "Paga", effectiveDate: new Date().toISOString().split('T')[0], newValue: "" });
            toast({ title: "Historiku u regjistrua me sukses" });
        },
        onError: (error: Error) => {
            toast({ title: "Gabim", description: error.message, variant: "destructive" });
        }
    });

    const resetTokenMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", `/api/workers/${worker.id}/reset-token`);
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData([`/api/workers`], (prev: Worker[] | undefined) => {
                if (!prev) return prev;
                return prev.map(w => w.id === data.id ? data : w);
            });
            // Update local worker state if possible or invalid queries
            queryClient.invalidateQueries({ queryKey: [`/api/workers`] });
            toast({ title: "Linku u rigjenerua me sukses" });
        },
        onError: (error: Error) => {
            toast({ title: "Gabim në rigjenerim", description: error.message, variant: "destructive" });
        }
    });

    const handleAutoCheckIn = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const timeNow = new Date().toTimeString().split(' ')[0].slice(0, 5); // HH:MM
        
        const existing = attendances.find((a) => a.date === todayStr);
        if (existing) {
            createAttendanceMutation.mutate({ 
                id: existing.id, 
                date: existing.date,
                checkIn: timeNow,
                checkOut: existing.checkOut || undefined,
                overtimeHours: existing.overtimeHours || undefined,
                notes: existing.notes || undefined
            });
        } else {
            createAttendanceMutation.mutate({ date: todayStr, checkIn: timeNow });
        }
    };

    const handleAutoCheckOut = () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const timeNow = new Date().toTimeString().split(' ')[0].slice(0, 5); // HH:MM
        
        const existing = attendances.find((a) => a.date === todayStr);
        if (existing) {
            createAttendanceMutation.mutate({ 
                id: existing.id, 
                date: existing.date,
                checkIn: existing.checkIn || undefined,
                checkOut: timeNow,
                overtimeHours: existing.overtimeHours || undefined,
                notes: existing.notes || undefined
            });
        } else {
            createAttendanceMutation.mutate({ date: todayStr, checkOut: timeNow });
        }
    };

    // Sub-components for each tab
    const renderLeave = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Historiku i Pushimeve</h3>
                <Button size="sm" onClick={() => setIsLeaveOpen(true)}><Palmtree className="w-4 h-4 mr-2" /> Kërko Pushim</Button>
            </div>
            {leaves.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Nuk ka kërkesa për pushim.</div>
            ) : (
                <div className="space-y-3">
                    {leaves.map((l: LeaveRequest) => (
                        <Card key={l.id} className="shadow-sm">
                            <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="font-medium">{l.type} <Badge variant="outline" className="ml-2">{l.days} Ditë</Badge></div>
                                    <div className="text-sm text-muted-foreground mt-1">{l.startDate} deri {l.endDate}</div>
                                </div>
                                <div className="text-right">
                                    <Badge className={l.status === 'Aprovuar' ? 'bg-green-500 hover:bg-green-600' : l.status === 'Refuzuar' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}>
                                        {l.status}
                                    </Badge>
                                    {l.status === 'Në Pritje' && (
                                        <div className="flex gap-2 mt-3">
                                            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 h-8 text-xs" onClick={() => updateLeaveMutation.mutate({ id: l.id, status: 'Aprovuar' })} disabled={updateLeaveMutation.isPending}>Aprovo</Button>
                                            <Button size="sm" variant="destructive" className="h-8 text-xs" onClick={() => updateLeaveMutation.mutate({ id: l.id, status: 'Refuzuar' })} disabled={updateLeaveMutation.isPending}>Refuzo</Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const renderAttendance = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Vijueshmëria Sot ({new Date().toLocaleDateString('en-GB')})</h3>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50" onClick={handleAutoCheckIn} disabled={createAttendanceMutation.isPending}><Activity className="w-4 h-4 mr-2" /> Hyrja (Check In)</Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleAutoCheckOut} disabled={createAttendanceMutation.isPending}><Activity className="w-4 h-4 mr-2" /> Dalja (Check Out)</Button>
                </div>
            </div>
            {attendances.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Nuk ka të dhëna vijueshmërie.</div>
            ) : (
                <div className="space-y-3">
                    {attendances.map((a: Attendance) => (
                        <Card key={a.id} className="shadow-sm">
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
                                <div className="font-medium w-32 border-r">{a.date}</div>
                                <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                    <div><span className="text-muted-foreground block text-xs">Hyrja</span> {a.checkIn || '-'}</div>
                                    <div><span className="text-muted-foreground block text-xs">Dalja</span> {a.checkOut || '-'}</div>
                                    <div><span className="text-muted-foreground block text-xs">Orë Shtesë</span> {a.overtimeHours ? `${a.overtimeHours} h` : '-'}</div>
                                    <div><span className="text-muted-foreground block text-xs">Shënim</span> {a.notes || '-'}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const renderPayslips = () => (
        <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Fletëpagesat Mujore</h3>
                <Button size="sm" onClick={() => setIsPayslipOpen(true)}><FileText className="w-4 h-4 mr-2" /> Gjenero Fletëpagesë</Button>
            </div>
            {payslips.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Nuk ka fletëpagesa të lidhura.</div>
            ) : (
                <div className="space-y-3">
                    {payslips.map((p: Payslip) => (
                        <Card key={p.id} className="shadow-sm border-l-4 border-l-blue-500">
                            <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h4 className="font-bold">{p.month} / {p.year}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Bruto: {p.grossSalary}€</p>
                                </div>
                                <div className="text-right flex-1">
                                     <div className="text-lg font-bold text-green-600">Neto: {p.netSalary}€</div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={p.status === 'E Paguar' ? 'default' : 'secondary'} className={p.status === 'E Paguar' ? 'bg-green-500' : ''}>
                                            {p.status}
                                        </Badge>
                                        <Button variant="outline" size="icon" className="h-8 w-8 text-primary" onClick={() => generatePayslipPDF(worker, p)}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => { if (confirm("A jeni i sigurt që dëshironi ta fshini fletëpagesën?")) deletePayslipMutation.mutate(p.id); }} disabled={deletePayslipMutation.isPending}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );

    const renderHistory = () => (
         <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Historiku & Modifikimet</h3>
                <Button size="sm" variant="outline" onClick={() => setIsHistoryOpen(true)}><History className="w-4 h-4 mr-2" /> Shto Ndryshim</Button>
            </div>
            {history.length === 0 ? (
                 <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">Nuk ka ndryshime drastike në histori.</div>
            ) : (
                <div className="relative border-l-2 border-primary/20 ml-3 pl-4 space-y-6">
                    {history.map((h: WorkerHistory) => (
                        <div key={h.id} className="relative">
                            <div className="absolute -left-[23px] bg-background border-2 border-primary w-3 h-3 rounded-full mt-1.5"></div>
                            <div className="font-semibold text-sm">{h.effectiveDate} - {h.changeType}</div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                <span className="line-through">{h.oldValue || 'N/A'}</span>
                                <span className="text-primary font-bold">→ {h.newValue}</span>
                            </div>
                            {h.notes && <p className="text-sm mt-2 italic text-muted-foreground">"{h.notes}"</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-border/50">
                {[
                    { id: 'info', label: 'Të Dhënat', icon: User },
                    { id: 'leave', label: 'Pushimet', icon: Palmtree },
                    { id: 'attendance', label: 'Vijueshmëria', icon: Clock },
                    { id: 'payslips', label: 'Fletëpagesat', icon: FileText },
                    { id: 'history', label: 'Historiku', icon: History },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2.5 text-sm font-semibold rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeWorkerTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                 <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[400px]"
                 >
                    {activeTab === 'info' && (
                        <WorkerForm
                            worker={worker}
                            onSubmit={onSubmitUpdate}
                            isSubmitting={isUpdating}
                        />
                    )}
                    {activeTab === 'leave' && renderLeave()}
                    {activeTab === 'attendance' && renderAttendance()}
                    {activeTab === 'payslips' && renderPayslips()}
                    {activeTab === 'history' && renderHistory()}
                 </motion.div>
            </AnimatePresence>

            {/* Magic Link Generator & QR */}
            <div className="mt-8 border-t pt-6 text-center">
                 <h3 className="text-lg font-bold mb-2">Portali i Punëtorit (Vetë-Shërbim)</h3>
                 <p className="text-muted-foreground text-sm mb-4">Secili punëtor ka një link unik ku mund të regjistrojë hyrje/daljet e veta, të kërkojë pushime dhe të shohë fletëpagesat. Përsosur për ta dërguar në WhatsApp/Viber.</p>
                 <Button onClick={() => setIsQrOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 font-bold px-8">
                     Gjenero QR Kodin / Linkun Magjik
                 </Button>
            </div>

            {/* Dialogs */}
            <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Aksesi në Portal</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center py-6 gap-6">
                        {!worker.portalToken ? (
                            <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                                Ky punëtor ende nuk ka një token të portalit. Kontrollo nëse portali është konfiguruar saktë ose provo të ruash/ndryshosh të dhënat e tij në bazën e të dhënave për të gjeneruar një token.
                            </div>
                        ) : (
                            <>
                                <div className="bg-white p-4 rounded-xl border-2 border-indigo-100 shadow-md">
                                    <QRCodeSVG value={`${window.location.origin}/portal/${worker.portalToken}`} size={200} />
                                </div>
                                <div className="space-y-2 w-full">
                                    <Label className="text-center block">Linku i Portalit</Label>
                                    <div className="flex gap-2">
                                        <Input 
                                            readOnly 
                                            value={`${window.location.origin}/portal/${worker.portalToken}`} 
                                            className="bg-gray-50 font-mono text-xs"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="secondary"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/portal/${worker.portalToken}`);
                                                toast({
                                                    title: "U kopjua",
                                                    description: "Linku i portalit u kopjua në clipboard.",
                                                });
                                            }}
                                        >
                                            Kopjo
                                        </Button>
                                    </div>
                                    <div className="pt-2">
                                        <Button 
                                            variant="outline" 
                                            className="w-full text-xs text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => {
                                                if (confirm("A jeni i sigurtë? Linku aktual do të pushojë së funksionuari.")) {
                                                    resetTokenMutation.mutate();
                                                }
                                            }}
                                            disabled={resetTokenMutation.isPending}
                                        >
                                            {resetTokenMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Clock className="w-3 h-3 mr-2" />}
                                            Reset Linkun (Rigjenero Token)
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2 text-center">Ky link dhe QR kod është i përhershëm dhe unik vetëm për këtë punëtor.</p>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isLeaveOpen} onOpenChange={setIsLeaveOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Kërko Pushim</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Tipi i Pushimit</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={leaveData.type} onChange={e => setLeaveData({ ...leaveData, type: e.target.value })}>
                                <option value="Vjetor">Vjetor</option>
                                <option value="Mjekësor">Mjekësor</option>
                                <option value="Tjetër">Tjetër</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Data e Fillimit</Label>
                                <Input type="date" value={leaveData.startDate || ''} onChange={e => setLeaveData({ ...leaveData, startDate: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Data e Mbarimit</Label>
                                <Input type="date" value={leaveData.endDate || ''} onChange={e => setLeaveData({ ...leaveData, endDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Ditë Totale</Label>
                            <Input type="number" value={leaveData.days || ''} onChange={e => setLeaveData({ ...leaveData, days: parseInt(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Arsyeja (Opsionale)</Label>
                            <Textarea value={leaveData.reason || ''} onChange={e => setLeaveData({ ...leaveData, reason: e.target.value })} />
                        </div>
                        <Button className="w-full" onClick={() => createLeaveMutation.mutate(leaveData)} disabled={createLeaveMutation.isPending}>Regjistro Pushimin</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isPayslipOpen} onOpenChange={setIsPayslipOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Gjenero Fletëpagesë të Re</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Muaji (1-12)</Label>
                                <Input type="number" min="1" max="12" value={payslipData.month || ''} onChange={e => setPayslipData({ ...payslipData, month: parseInt(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Viti</Label>
                                <Input type="number" value={payslipData.year || ''} onChange={e => setPayslipData({ ...payslipData, year: parseInt(e.target.value) })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Bonuse (€)</Label>
                            <Input type="number" value={payslipData.bonuses || 0} onChange={e => setPayslipData({ ...payslipData, bonuses: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Ndalesa (€)</Label>
                            <Input type="number" value={payslipData.deductions || 0} onChange={e => setPayslipData({ ...payslipData, deductions: parseFloat(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Statusi</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={payslipData.status} onChange={e => setPayslipData({ ...payslipData, status: e.target.value })}>
                                <option value="E Paguar">E Paguar</option>
                                <option value="E Papaguar">E Papaguar</option>
                            </select>
                        </div>
                        <Button className="w-full" onClick={() => createPayslipMutation.mutate(payslipData)} disabled={createPayslipMutation.isPending}>Gjenero Fletëpagesë në Sistemin DB</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader><DialogTitle>Shto Ndryshim në Histori</DialogTitle></DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>Tipi i Ndryshimit</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={historyData.changeType} onChange={e => setHistoryData({ ...historyData, changeType: e.target.value })}>
                                <option value="Paga">Paga</option>
                                <option value="Pozita">Pozita</option>
                                <option value="Departamenti">Departamenti</option>
                                <option value="Kontrata">Kontrata</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vlera e Vjetër (Opsional)</Label>
                                <Input value={historyData.oldValue || ''} onChange={e => setHistoryData({ ...historyData, oldValue: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Vlera e Re</Label>
                                <Input value={historyData.newValue || ''} onChange={e => setHistoryData({ ...historyData, newValue: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Data Efektive</Label>
                            <Input type="date" value={historyData.effectiveDate || ''} onChange={e => setHistoryData({ ...historyData, effectiveDate: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Shënim (Opsionale)</Label>
                            <Input value={historyData.notes || ''} onChange={e => setHistoryData({ ...historyData, notes: e.target.value })} />
                        </div>
                        <Button className="w-full" onClick={() => createHistoryMutation.mutate(historyData)} disabled={createHistoryMutation.isPending}>Ruaj Ndryshimin</Button>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}
