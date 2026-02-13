import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Zap, Camera, ShieldAlert, Phone, Loader2, FileDown, Wrench } from "lucide-react";
import { JOB_CATEGORY_LABELS, JOB_STATUS_LABELS, type Job, type JobCategory, type JobStatus } from "@shared/schema";
import { createElektronovaPDF, addPDFTable, addAllFooters } from "@/lib/pdf-utils";
import { calculateJobProgress, getRequiredToolsForJob } from "@/lib/job-progress";

function getCategoryStyle(category: string | null | undefined) {
  switch (category) {
    case "electric": return { icon: Zap, bg: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400" };
    case "camera": return { icon: Camera, bg: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400" };
    case "alarm": return { icon: ShieldAlert, bg: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400" };
    case "intercom": return { icon: Phone, bg: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400" };
    default: return { icon: Zap, bg: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400" };
  }
}

const MONTH_NAMES_SQ = [
  "Janar", "Shkurt", "Mars", "Prill", "Maj", "Qershor",
  "Korrik", "Gusht", "Shtator", "Tetor", "Nëntor", "Dhjetor"
];
const DAY_NAMES_SQ = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];

function getStatusColor(status: string | null | undefined) {
  switch (status) {
    case "ne_progres": return "bg-blue-500";
    case "e_perfunduar": return "bg-green-500";
    default: return "bg-orange-500";
  }
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: jobs, isLoading } = useQuery<Job[]>({ queryKey: ["/api/jobs"] });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();

    const days: { date: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: prevMonthLastDay - i, month: month - 1, year, isCurrentMonth: false });
    }

    for (let d = 1; d <= totalDays; d++) {
      days.push({ date: d, month, year, isCurrentMonth: true });
    }

    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: d, month: month + 1, year, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  const jobsByDate = useMemo(() => {
    const map: Record<string, Job[]> = {};
    const regularJobs = (jobs || []).filter(j => !j.isTemplate);
    regularJobs.forEach(job => {
      const dateStr = job.scheduledDate || job.workDate;
      if (!dateStr) return;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(job);
    });
    return map;
  }, [jobs]);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const generateCalendarPDF = () => {
    const { doc, startY } = createElektronovaPDF(`KALENDARI - ${MONTH_NAMES_SQ[month]} ${year}`);
    const monthJobs: Job[] = [];
    Object.entries(jobsByDate).forEach(([dateStr, dateJobs]) => {
      const d = new Date(dateStr + "T00:00:00");
      if (d.getFullYear() === year && d.getMonth() === month) {
        monthJobs.push(...dateJobs);
      }
    });
    addPDFTable(doc, startY,
      [["Nr.", "Klienti", "Lloji Punes", "Kategoria", "Statusi", "Data"]],
      monthJobs.map((job, i) => [
        String(i + 1),
        job.clientName,
        job.workType || "",
        JOB_CATEGORY_LABELS[job.category as JobCategory] || job.category || "",
        JOB_STATUS_LABELS[job.status as JobStatus] || job.status || "",
        job.scheduledDate || job.workDate || "",
      ]),
    );
    addAllFooters(doc, "Elektronova - Kalendari i Puneve");
    doc.save(`Elektronova_Kalendari_${MONTH_NAMES_SQ[month]}_${year}.pdf`);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground" data-testid="text-calendar-title">Kalendari i Punëve</h1>
            <p className="text-muted-foreground mt-1">Shiko punët e planifikuara sipas datës</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" onClick={generateCalendarPDF} data-testid="button-pdf-calendar">
              <FileDown className="h-4 w-4 mr-2" /> Shkarko PDF
            </Button>
            <Button variant="outline" onClick={goToToday} data-testid="button-today">Sot</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <Button size="icon" variant="ghost" onClick={prevMonth} data-testid="button-prev-month">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold" data-testid="text-current-month">
                {MONTH_NAMES_SQ[month]} {year}
              </h2>
              <Button size="icon" variant="ghost" onClick={nextMonth} data-testid="button-next-month">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-7 gap-px mb-1">
                  {DAY_NAMES_SQ.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-muted-foreground py-2 uppercase tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                  {calendarDays.map((day, idx) => {
                    const dateStr = `${day.year}-${String(day.month + 1).padStart(2, '0')}-${String(day.date).padStart(2, '0')}`;
                    const dayJobs = jobsByDate[dateStr] || [];
                    const isToday = dateStr === todayStr;

                    return (
                      <div
                        key={idx}
                        className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 bg-background ${
                          !day.isCurrentMonth ? "opacity-40" : ""
                        } ${isToday ? "ring-2 ring-primary ring-inset" : ""}`}
                        data-testid={`calendar-day-${dateStr}`}
                      >
                        <div className={`text-xs sm:text-sm font-medium mb-1 ${
                          isToday ? "text-primary font-bold" : "text-foreground"
                        }`}>
                          {day.date}
                        </div>
                        <div className="space-y-0.5">
                          {dayJobs.slice(0, 3).map(job => {
                            const style = getCategoryStyle(job.category);
                            return (
                              <Link key={job.id} href={`/edit/${job.id}`}>
                                <div
                                  className={`text-[10px] sm:text-xs p-0.5 sm:p-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity ${style.bg}`}
                                  data-testid={`calendar-job-${job.id}`}
                                  title={`${job.clientName} - ${job.workType}${job.clientPhone ? ' | Tel: ' + job.clientPhone : ''}`}
                                >
                                  <span className="flex items-center gap-0.5">
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(job.status)}`} />
                                    <span className="truncate font-medium">{job.clientName}</span>
                                  </span>
                                </div>
                              </Link>
                            );
                          })}
                          {dayJobs.length > 3 && (
                            <div className="text-[10px] text-muted-foreground text-center">
                              +{dayJobs.length - 3} më shumë
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-bold mb-3" data-testid="text-upcoming-title">Punët e ardhshme</h3>
          {(() => {
            const upcoming = Object.entries(jobsByDate)
              .filter(([date]) => date >= todayStr)
              .sort(([a], [b]) => a.localeCompare(b))
              .slice(0, 10);

            if (upcoming.length === 0) {
              return <p className="text-muted-foreground text-sm">Nuk ka punë të planifikuara.</p>;
            }

            return (
              <div className="space-y-3">
                {upcoming.map(([date, dateJobs]) => (
                  <div key={date}>
                    <div className="text-sm font-bold text-muted-foreground mb-1.5">
                      {new Date(date + "T00:00:00").toLocaleDateString("sq-AL", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </div>
                    <div className="space-y-1.5">
                      {dateJobs.map(job => {
                        const style = getCategoryStyle(job.category);
                        const CatIcon = style.icon;
                        return (
                          <Card key={job.id} className="hover-elevate cursor-pointer" data-testid={`upcoming-job-${job.id}`}>
                            <Link href={`/edit/${job.id}`}>
                              <CardContent className="p-3 flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${style.bg}`}>
                                  <CatIcon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-sm truncate">{job.clientName}</div>
                                  <div className="text-xs text-muted-foreground truncate">{job.clientAddress}</div>
                                </div>
                                <Badge variant="outline" className="text-[10px] shrink-0 no-default-hover-elevate no-default-active-elevate">
                                  {JOB_STATUS_LABELS[(job.status as keyof typeof JOB_STATUS_LABELS) || "oferte"]}
                                </Badge>
                              </CardContent>
                            </Link>
                            {job.status === "ne_progres" && job.category === "electric" && (() => {
                              const progress = calculateJobProgress(job);
                              if (progress.totalRooms === 0) return null;
                              return (
                                <div className="px-3 pb-1">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <span className="text-[10px] text-muted-foreground">{progress.completedRooms}/{progress.totalRooms} dhoma</span>
                                    <span className="text-[10px] font-bold" style={{ color: progress.overallPercent === 100 ? '#22c55e' : progress.overallPercent > 50 ? '#3b82f6' : '#f59e0b' }}>{progress.overallPercent}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-1 overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${progress.overallPercent}%`, backgroundColor: progress.overallPercent === 100 ? '#22c55e' : progress.overallPercent > 50 ? '#3b82f6' : '#f59e0b' }} />
                                  </div>
                                </div>
                              );
                            })()}
                            {(() => {
                              const tools = getRequiredToolsForJob(job);
                              if (tools.length === 0) return null;
                              return (
                                <div className="px-3 pb-2">
                                  <div className="flex items-start gap-1.5">
                                    <Wrench className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                                    <span className="text-[10px] text-muted-foreground leading-relaxed" data-testid={`tools-${job.id}`}>
                                      {tools.slice(0, 5).join(", ")}{tools.length > 5 ? ` +${tools.length - 5}` : ""}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                            {job.clientPhone && (
                              <div className="px-3 pb-2">
                                <a href={`tel:${job.clientPhone}`} className="text-xs text-primary truncate flex items-center gap-1" onClick={(e) => e.stopPropagation()} data-testid={`phone-link-${job.id}`}>
                                  <Phone className="w-3 h-3 shrink-0" /> {job.clientPhone}
                                </a>
                              </div>
                            )}
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </Layout>
  );
}
