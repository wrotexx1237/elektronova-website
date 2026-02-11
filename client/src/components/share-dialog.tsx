import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageCircle, Mail, Copy, Check } from "lucide-react";
import { JOB_CATEGORY_LABELS, type Job, type JobCategory } from "@shared/schema";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job;
}

function buildJobMessage(job: Job): string {
  const category = JOB_CATEGORY_LABELS[(job.category as JobCategory) || "electric"] || job.category;
  const lines = [
    `ELEKTRONOVA - ${job.invoiceNumber || "Ofertë"}`,
    ``,
    `Klienti: ${job.clientName}`,
    `Adresa: ${job.clientAddress}`,
    `Data: ${job.workDate}`,
    `Kategoria: ${category}`,
    `Lloji: ${job.workType}`,
  ];

  if (job.notes) {
    lines.push(``, `Shënime: ${job.notes.substring(0, 200)}${job.notes.length > 200 ? '...' : ''}`);
  }

  lines.push(``, `---`, `Elektronova | Sherbime Elektrike & Siguri`, `Tel: +383 49 771 673`);

  return lines.join('\n');
}

export function ShareDialog({ open, onOpenChange, job }: ShareDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [emailTo, setEmailTo] = useState(job.clientPhone ? "" : "");

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
              className="text-xs min-h-[120px] resize-none bg-muted/30"
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
              {copied ? <Check className="h-4 w-4 mr-2 text-green-600" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "U kopjua!" : "Kopjo mesazhin"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
