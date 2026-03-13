import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageCircle, Mail, Copy, Check } from "lucide-react";
import { JOB_CATEGORY_LABELS, JOB_STATUS_LABELS, type Job, type JobCategory, type JobStatus } from "@shared/schema";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("sq-AL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function calculateTotal(job: Job): number {
  const prices = job.prices || {};
  let total = 0;

  const allData: Record<string, number>[] = [
    job.table2Data || {},
    job.cameraData || {},
    job.intercomData || {},
    job.alarmData || {},
    job.serviceData || {},
  ];

  for (const data of allData) {
    for (const [item, qty] of Object.entries(data)) {
      if (prices[item]) {
        total += (qty || 0) * prices[item];
      }
    }
  }

  if (job.table1Data) {
    for (const [item, rooms] of Object.entries(job.table1Data)) {
      const rowTotal = Object.values(rooms).reduce((s, v) => s + (v || 0), 0);
      if (prices[item]) {
        total += rowTotal * prices[item];
      }
    }
  }

  if (job.discountValue && job.discountValue > 0) {
    if (job.discountType === "percent") {
      total = total * (1 - job.discountValue / 100);
    } else {
      total = total - job.discountValue;
    }
  }

  return Math.max(0, total);
}

function buildJobMessage(job: Job): string {
  const category = JOB_CATEGORY_LABELS[(job.category as JobCategory) || "electric"] || job.category;
  const statusLabel = JOB_STATUS_LABELS[(job.status as JobStatus) || "oferte"] || job.status;
  const total = calculateTotal(job);

  const lines = [
    `━━━━━━━━━━━━━━━━━━━━━`,
    `  ELEKTRONOVA`,
    `  Shërbime Elektrike & Siguri`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    ``,
    `Nr. ${job.invoiceNumber || "---"}`,
    `Statusi: ${statusLabel}`,
    ``,
    `KLIENTI`,
    `Emri: ${job.clientName}`,
  ];

  if (job.clientAddress) {
    lines.push(`Adresa: ${job.clientAddress}`);
  }

  lines.push(
    ``,
    `DETAJET E PUNËS`,
    `Kategoria: ${category}`,
    `Lloji: ${job.workType}`,
    `Data: ${formatDate(job.workDate)}`,
  );

  if (job.scheduledDate) {
    lines.push(`Planifikuar: ${formatDate(job.scheduledDate)}`);
  }

  if (total > 0) {
    lines.push(
      ``,
      `TOTALI: ${total.toFixed(2)} EUR`,
    );

    if (job.discountValue && job.discountValue > 0) {
      const discountText = job.discountType === "percent"
        ? `${job.discountValue}%`
        : `${job.discountValue.toFixed(2)} EUR`;
      lines.push(`(Zbritja: ${discountText})`);
    }
  }

  lines.push(
    ``,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `Elektronova`,
    `Tel: +383 49 771 673`,
    `━━━━━━━━━━━━━━━━━━━━━`,
  );

  return lines.join('\n');
}

export function ShareDialog({ open, onOpenChange, job }: ShareDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState("");

  const message = buildJobMessage(job);

  const shareWhatsApp = () => {
    const phone = (job.clientPhone || "").replace(/\s+/g, "").replace(/^0/, "+383");
    const url = phone
      ? `https://wa.me/${phone.replace(/[^+\d]/g, "")}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareEmail = () => {
    const subject = encodeURIComponent(`Elektronova - ${job.invoiceNumber || "Ofertë"} - ${job.clientName}`);
    const body = encodeURIComponent(message);
    const mailto = emailTo
      ? `mailto:${emailTo}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;
    window.open(mailto, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({ title: "U kopjua!", description: "Mesazhi u kopjua në clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Gabim", description: "Nuk u kopjua.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Ndaj me klientin
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Mesazhi</label>
            <Textarea
              value={message}
              readOnly
              className="text-xs min-h-[200px] resize-none bg-muted/30 font-mono"
              data-testid="textarea-share-message"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button onClick={shareWhatsApp} variant="default" data-testid="button-share-whatsapp">
              <MessageCircle className="h-4 w-4 mr-2" />
              Dërgo me WhatsApp
            </Button>

            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@shembull.com"
                value={emailTo}
                onChange={e => setEmailTo(e.target.value)}
                className="flex-1"
                data-testid="input-share-email"
              />
              <Button variant="outline" onClick={shareEmail} data-testid="button-share-email">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>

            <Button variant="ghost" onClick={copyToClipboard} data-testid="button-copy-message">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "U kopjua!" : "Kopjo mesazhin"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
