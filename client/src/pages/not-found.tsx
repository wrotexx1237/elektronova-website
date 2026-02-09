import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-2 border-border/50 shadow-xl">
        <CardContent className="pt-6 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Faqja nuk u gjet</h1>
            <p className="text-muted-foreground text-sm">
              Faqja që po kërkoni nuk ekziston ose është zhvendosur.
            </p>
          </div>

          <Link href="/">
            <Button className="w-full gap-2 font-medium" size="lg">
              <ArrowLeft className="h-4 w-4" />
              Kthehu në Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
