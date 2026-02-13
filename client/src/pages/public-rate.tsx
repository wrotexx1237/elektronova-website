import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, CheckCircle2, Loader2, Zap, Camera, ShieldAlert, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  electric: Zap,
  camera: Camera,
  alarm: ShieldAlert,
  intercom: Phone,
};

const CATEGORY_LABELS: Record<string, string> = {
  electric: "Elektrike",
  camera: "Kamera",
  alarm: "Alarm",
  intercom: "Interfon",
};

interface RateInfo {
  workType: string;
  category: string;
  hasFeedback: boolean;
  existingRating: number | null;
}

export default function PublicRatePage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<RateInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/public/rate/${token}`)
      .then(r => {
        if (!r.ok) throw new Error("Link i pavlefshëm");
        return r.json();
      })
      .then(data => {
        setInfo(data);
        if (data.hasFeedback) {
          setRating(data.existingRating || 0);
          setSubmitted(true);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Ju lutem zgjidhni vlerësimin", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/rate/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gabim");
      }
      setSubmitted(true);
      toast({ title: "Faleminderit për vlerësimin tuaj!" });
    } catch (err: any) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive font-medium">{error || "Link i pavlefshëm"}</p>
            <p className="text-sm text-muted-foreground mt-2">Ky link nuk ekziston ose ka skaduar.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CategoryIcon = CATEGORY_ICONS[info.category || "electric"] || Zap;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold">Faleminderit!</h2>
            <p className="text-muted-foreground">
              Vlerësimi juaj është regjistruar me sukses.
            </p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star
                  key={s}
                  className={`h-8 w-8 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">Elektronova - Shërbime Elektrike Profesionale</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CategoryIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">Vlerëso Punën</CardTitle>
          <p className="text-sm text-muted-foreground">
            {CATEGORY_LABELS[info.category || "electric"]} - {info.workType}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm font-medium mb-3">Si ishte puna jonë?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  data-testid={`star-${s}`}
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      s <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {rating === 1 && "Dobët"}
              {rating === 2 && "Mjaftueshëm"}
              {rating === 3 && "Mirë"}
              {rating === 4 && "Shumë Mirë"}
              {rating === 5 && "Shkëlqyeshëm"}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Koment (opsional)</label>
            <Textarea
              placeholder="Shkruani përshtypjen tuaj..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              data-testid="input-feedback-comment"
            />
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            data-testid="button-submit-rating"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Dërgo Vlerësimin
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Elektronova - Shërbime Elektrike Profesionale
          </p>
        </CardContent>
      </Card>
    </div>
  );
}