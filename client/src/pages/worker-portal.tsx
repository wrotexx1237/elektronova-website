import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Worker, Attendance, LeaveRequest, Payslip } from "@shared/schema";
import { Loader2, LogIn, LogOut, FileText, Palmtree, Clock, CheckCircle2, ChevronRight, X, Calendar, Download } from "lucide-react";
import { format, differenceInMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function WorkerPortal() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isPayslipsOpen, setIsPayslipsOpen] = useState(false);
  
  // Forms
  const [leaveData, setLeaveData] = useState<Partial<LeaveRequest>>({ type: "Vjetor", status: "Në Pritje" });

  // Auto-calculate Leave Days
  useEffect(() => {
    if (leaveData.startDate && leaveData.endDate) {
      const start = new Date(leaveData.startDate);
      const end = new Date(leaveData.endDate);
      let count = 0;
      let cur = new Date(start);
      while (cur <= end) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++; // Skip Sat (6) and Sun (0)
        cur.setDate(cur.getDate() + 1);
      }
      if (count !== leaveData.days) {
        setLeaveData(prev => ({ ...prev, days: count }));
      }
    }
  }, [leaveData.startDate, leaveData.endDate, leaveData.days]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: worker, isLoading: isLoadingWorker, error } = useQuery<Worker>({
    queryKey: [`/api/worker-portal/${token}`],
  });

  useEffect(() => {
    if (worker) console.log("Worker data loaded:", worker);
    if (error) console.error("Worker fetch error:", error);
  }, [worker, error]);

  const { data: attendanceHistory, isLoading: isLoadingAttendance } = useQuery<Attendance[]>({
    queryKey: [`/api/worker-portal/${token}/attendance`],
    enabled: !!worker?.id,
  });

  const { data: payslips, isLoading: isLoadingPayslips } = useQuery<Payslip[]>({
    queryKey: [`/api/worker-portal/${token}/payslips`],
    enabled: !!worker?.id,
  });

  const checkInMutation = useMutation({
    mutationFn: async () => {
      const now = new Date();
      const payload = {
        workerId: worker!.id,
        date: format(now, 'yyyy-MM-dd'),
        checkIn: format(now, 'HH:mm'),
        checkOut: null,
        overtimeHours: 0
      };
      
      const res = await apiRequest("POST", `/api/worker-portal/${token}/attendance`, payload);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: "Gabim në server" }));
        throw new Error(errData.message || "Gabim në server");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/worker-portal/${token}/attendance`] });
      toast({
        title: "Hyrja u regjistrua me sukses!",
        description: `Ora e regjistrimit: ${format(new Date(), 'HH:mm')}`,
      });
    },
    onError: (error: Error) => toast({ title: "Gabim nga serveri", description: error.message, variant: "destructive" })
  });

  const checkOutMutation = useMutation({
    mutationFn: async (latestAttendance: Attendance) => {
      const now = new Date();
      
      const checkInDate = new Date(`${latestAttendance.date}T${latestAttendance.checkIn}:00`);
      const minsDiff = differenceInMinutes(now, checkInDate);
      const hoursDiff = minsDiff / 60;
      
      let overtime = 0;
      // Parse scheduled end time from workSchedule (e.g. "16:00")
      let scheduledEndTime = "16:00"; 
      if (worker?.workSchedule) {
        const match = worker.workSchedule.match(/(\d{2}:\d{2})\s*$/);
        if (match) scheduledEndTime = match[1];
      }

      const scheduledEndParts = scheduledEndTime.split(':');
      const scheduledEndDate = new Date(now);
      scheduledEndDate.setHours(parseInt(scheduledEndParts[0]), parseInt(scheduledEndParts[1]), 0);

      if (now > scheduledEndDate) {
          const otMins = differenceInMinutes(now, scheduledEndDate);
          overtime = Number((otMins / 60).toFixed(2));
      }

      const payload = {
        ...latestAttendance,
        checkOut: format(now, 'HH:mm'),
        overtimeHours: overtime
      };

      const { createdAt, ...strippedPayload } = payload as any;

      const res = await apiRequest("PUT", `/api/worker-portal/${token}/attendance/${latestAttendance.id}`, strippedPayload);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ message: "Gabim në server" }));
        throw new Error(errData.message || "Gabim në server");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/worker-portal/${token}/attendance`] });
      toast({
        title: "Dalja u regjistrua me sukses!",
        description: `Ora e përfundimit: ${format(new Date(), 'HH:mm')}`,
      });
    },
    onError: (error: Error) => toast({ title: "Gabim nga serveri", description: error.message, variant: "destructive" })
  });

  const createLeaveMutation = useMutation({
      mutationFn: async (data: Partial<LeaveRequest>) => {
          const res = await apiRequest("POST", `/api/worker-portal/${token}/leave-requests`, { ...data, workerId: worker!.id, status: "Në Pritje" });
          if (!res.ok) {
            const errData = await res.json().catch(() => ({ message: "Gabim në server" }));
            throw new Error(errData.message || "Gabim në server");
          }
          return res.json();
      },
      onSuccess: () => {
          setIsLeaveOpen(false);
          setLeaveData({ type: "Vjetor", status: "Në Pritje" });
          queryClient.invalidateQueries({ queryKey: [`/api/leave-requests`] });
          toast({
              title: "Kërkesa u dërgua me sukses!",
              description: "HR do ta shqyrtojë kërkesën së shpejti.",
          });
      },
      onError: (error: Error) => {
          toast({
              title: "Gabim gjatë dërgimit",
              description: error.message,
              variant: "destructive",
          });
      },
  });

  const { data: leaveHistory } = useQuery<LeaveRequest[]>({
    queryKey: [`/api/worker-portal/${token}/leave-requests`],
    enabled: !!worker?.id,
  });

  if (isLoadingWorker) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="flex flex-col h-screen items-center justify-center p-6 bg-gray-50 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 shadow-sm">
           <LogOut className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Link i Pavlefshëm</h1>
        <p className="text-muted-foreground">Ky link nuk ekziston ose shërbimi është i padisponueshëm.</p>
      </div>
    );
  }

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todaysAttendance = attendanceHistory?.find(a => a.date === todayStr);
  const isCheckedIn = !!(todaysAttendance && todaysAttendance.checkIn && !todaysAttendance.checkOut);
  const isCheckedOut = !!(todaysAttendance && todaysAttendance.checkOut);
  const isWeekend = [0, 6].includes(new Date().getDay());

  const approvedDays = leaveHistory?.filter(l => l.status === "Aprovuar").reduce((sum, l) => sum + (l.days || 0), 0) || 0;
  const remainingLeave = 20 - approvedDays;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Premium Header Profile */}
      <div className="bg-gradient-to-br from-[#1E293B] to-[#334155] px-6 py-12 shadow-2xl rounded-b-[40px] text-white relative overflow-hidden">
          <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          
          <div className="max-w-md mx-auto relative z-10 flex justify-between items-start">
              <div>
                  <h1 className="text-3xl font-black tracking-tight drop-shadow-md text-white/95">Tungjatjeta,</h1>
                  <h2 className="text-2xl font-semibold text-blue-100 mt-1">{worker?.name?.split(' ')[0] || 'Punëtor'} 👋</h2>
                  <p className="text-sm text-slate-400 mt-1 font-medium">{worker.position}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
                  <span className="text-2xl font-black text-white">{worker?.name?.charAt(0) || 'P'}</span>
              </div>
          </div>
      </div>

      <div className="max-w-md mx-auto w-full px-5 flex-1 pb-10 space-y-6">
          {/* Main Attendance Card */}
          <Card className="border-0 shadow-xl overflow-hidden rounded-3xl relative top-[-30px] bg-white ring-1 ring-black/5">
            <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100 flex flex-row items-center justify-between px-6 py-5">
              <div>
                <CardTitle className="text-lg text-gray-800">Sot</CardTitle>
                <CardDescription className="font-medium text-gray-500">{format(new Date(), 'dd MMMM yyyy')}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black tabular-nums text-slate-800 tracking-tight">{format(currentTime, 'HH:mm')}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{format(currentTime, 'ss')} sekonda</div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 px-6 pb-8 text-center bg-white">
                {isCheckedOut ? (
                    <div className="flex flex-col items-center justify-center py-4 space-y-4">
                        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-1 ring-8 ring-green-50/50">
                             <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div>
                            <p className="font-bold text-xl text-gray-900">Dita përfundoi e suksesshme!</p>
                            <p className="text-gray-500 mt-1 font-medium">Dalja u regjistrua në <span className="font-black text-slate-800">{todaysAttendance.checkOut}</span></p>
                        </div>
                    </div>
                ) : isCheckedIn ? (
                    <div className="space-y-6 py-2">
                        <div className="inline-flex items-center gap-2 justify-center text-sm font-bold text-blue-700 bg-blue-50 px-5 py-2.5 rounded-full ring-1 ring-blue-100">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                            </span>
                             Tani jeni në punë nga ora {todaysAttendance.checkIn}
                        </div>
                        <Button 
                            variant="destructive" 
                            size="lg" 
                            className="w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                            onClick={() => checkOutMutation.mutate(todaysAttendance)}
                            disabled={checkOutMutation.isPending}
                        >
                            {checkOutMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <LogOut className="h-6 w-6 mr-3" />}
                            Regjistro Daljen
                        </Button>
                    </div>
                ) : (
                     <div className="space-y-5 py-2">
                        {isWeekend ? (
                            <div className="bg-slate-50 text-slate-500 text-sm font-semibold rounded-xl p-4 flex items-center gap-3 border border-slate-200">
                                <Calendar className="w-5 h-5" />
                                Sot është fundjavë. Pushim!
                            </div>
                        ) : (
                            <div className="bg-amber-50 text-amber-700 text-sm font-semibold rounded-xl p-4 flex items-center gap-3">
                                <Clock className="w-5 h-5" />
                                Gati për të nisur ditën?
                            </div>
                        )}
                        <Button 
                            size="lg" 
                            className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-900/10 active:scale-95 transition-all"
                            onClick={() => checkInMutation.mutate()}
                            disabled={checkInMutation.isPending || (isWeekend && !isCheckedIn)}
                        >
                            {checkInMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <LogIn className="h-6 w-6 mr-3 text-emerald-400" />}
                            Vërteto Hyrjen në Punë
                        </Button>
                    </div>
                )}
            </CardContent>
          </Card>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
              <Dialog open={isLeaveOpen} onOpenChange={setIsLeaveOpen}>
                  <DialogTrigger asChild>
                      <Button variant="outline" className="h-[120px] flex flex-col items-center justify-center gap-3 rounded-[24px] bg-white shadow-md border-0 ring-1 ring-black/5 hover:ring-indigo-500/50 hover:bg-indigo-50/30 transition-all text-slate-700">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-1">
                              <Palmtree className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">Kërko Pushim</span>
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-[24px] p-6">
                      <DialogHeader className="mb-2">
                          <DialogTitle className="text-xl font-bold flex items-center gap-2">
                              <Palmtree className="w-5 h-5 text-indigo-500" />
                              Kërkesë për Pushim
                          </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-5 mt-2">
                          <div className="space-y-2.5">
                              <Label className="text-slate-600 font-semibold">Tipi i Pushimit</Label>
                              <select className="flex h-12 w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={leaveData.type} onChange={e => setLeaveData({ ...leaveData, type: e.target.value })}>
                                  <option value="Vjetor">Pushim Vjetor</option>
                                  <option value="Mjekësor">Pushim Mjekësor</option>
                                  <option value="Tjetër">Tjetër</option>
                              </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2.5">
                                  <Label className="text-slate-600 font-semibold">Nga Data</Label>
                                  <Input type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" value={leaveData.startDate || ''} onChange={e => setLeaveData({ ...leaveData, startDate: e.target.value })} />
                              </div>
                              <div className="space-y-2.5">
                                  <Label className="text-slate-600 font-semibold">Deri më</Label>
                                  <Input type="date" className="h-12 rounded-xl bg-gray-50 border-gray-200" value={leaveData.endDate || ''} onChange={e => setLeaveData({ ...leaveData, endDate: e.target.value })} />
                              </div>
                          </div>
                          <div className="space-y-2.5">
                              <Label className="text-slate-600 font-semibold flex justify-between">
                                  <span>Numri i Ditëve</span>
                                  <span className="text-indigo-600 font-black">Mbetja: {remainingLeave}</span>
                              </Label>
                              <Input type="number" readOnly className="h-12 rounded-xl bg-indigo-50/50 border-indigo-100 font-black text-indigo-700" placeholder="P.sh. 5" value={leaveData.days || ''} />
                              <p className="text-[10px] text-slate-400 font-medium">*Llogaritet automatikisht duke hequr fundjavat</p>
                          </div>
                          <div className="space-y-2.5">
                              <Label className="text-slate-600 font-semibold">Arsyeja (Nëse ka)</Label>
                              <Textarea className="rounded-xl bg-gray-50 border-gray-200 resize-none" rows={3} placeholder="Shkruani një përshkrim të shkurtër..." value={leaveData.reason || ''} onChange={e => setLeaveData({ ...leaveData, reason: e.target.value })} />
                          </div>
                          <Button className="w-full h-14 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 mt-4" onClick={() => createLeaveMutation.mutate(leaveData)} disabled={createLeaveMutation.isPending}>
                              {createLeaveMutation.isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
                              Dërgo Kërkesën
                          </Button>
                      </div>
                  </DialogContent>
              </Dialog>

              <Dialog open={isPayslipsOpen} onOpenChange={setIsPayslipsOpen}>
                  <DialogTrigger asChild>
                      <Button variant="outline" className="h-[120px] flex flex-col items-center justify-center gap-3 rounded-[24px] bg-white shadow-md border-0 ring-1 ring-black/5 hover:ring-emerald-500/50 hover:bg-emerald-50/30 transition-all text-slate-700">
                          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-1">
                              <FileText className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-sm tracking-tight">Fletëpagesat</span>
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-[24px] p-6 max-h-[85vh] overflow-y-auto">
                      <DialogHeader className="mb-4">
                          <DialogTitle className="text-xl font-bold flex items-center gap-2">
                              <FileText className="w-5 h-5 text-emerald-500" />
                              Fletëpagesat e Mia
                          </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                          {isLoadingPayslips ? (
                              <div className="py-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
                          ) : payslips && payslips.length > 0 ? (
                              payslips.slice().reverse().map(payslip => (
                                  <div key={payslip.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                                      <div>
                                          <div className="font-bold text-slate-800">{payslip.month}/{payslip.year}</div>
                                          <div className="text-sm font-medium text-emerald-600 mt-1">{payslip.status}</div>
                                      </div>
                                      <div className="flex flex-col items-end gap-1">
                                          <div className="font-black text-slate-900 border-b border-dashed border-slate-300 pb-1 mb-1">
                                            €{(payslip.netSalary || 0).toFixed(2)}
                                          </div>
                                          {/* In a real scenario we could generate PDF here directly using pdf-payslip.ts, but for the worker portal it serves as a great visual log */}
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="text-center py-8 text-slate-400 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                Nuk ka fletëpagesa të dërguara ende.
                              </div>
                          )}
                      </div>
                  </DialogContent>
              </Dialog>
          </div>

           {/* Recent Attendance (Last 5 days) */}
          <div className="mt-6 pt-2">
              <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Historiku i Ditëve</h3>
              </div>
              <div className="space-y-3">
                  {isLoadingAttendance ? (
                       <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
                  ) : attendanceHistory && attendanceHistory.length > 0 ? (
                      attendanceHistory.slice(0, 5).map((record) => (
                           <div key={record.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between transition-all hover:shadow-md">
                               <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-xl bg-slate-50 flex flex-col justify-center items-center ring-1 ring-slate-100">
                                       <span className="text-xs font-bold text-slate-400">{format(new Date(record.date!), 'MMM')}</span>
                                       <span className="text-lg font-black text-slate-700 leading-none">{format(new Date(record.date!), 'dd')}</span>
                                   </div>
                                   <div>
                                       <div className="font-bold text-slate-800">Orari i Punës</div>
                                       {record.overtimeHours ? (
                                           <div className="text-xs font-bold text-indigo-500 mt-0.5 bg-indigo-50 px-2 rounded-md inline-block">+{record.overtimeHours} orë shtesë</div>
                                       ) : (
                                           <div className="text-xs font-medium text-slate-400 mt-0.5">Orar i rregullt</div>
                                       )}
                                   </div>
                               </div>
                               <div className="text-right flex flex-col items-end gap-1">
                                   <div className="text-sm font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1"><LogIn className="w-3 h-3"/> {record.checkIn || '--:--'}</div>
                                   <div className="text-sm font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1"><LogOut className="w-3 h-3"/> {record.checkOut || '--:--'}</div>
                               </div>
                           </div>
                      ))
                  ) : (
                      <div className="bg-white p-8 rounded-3xl text-center shadow-sm border border-gray-100">
                          <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                          <p className="text-sm font-bold text-slate-400">Nuk ka të dhëna historike ende.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}
