import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Zap, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorStep, setTwoFactorStep] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [pendingCredentials, setPendingCredentials] = useState<{ username: string; password: string } | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, authLoading, setLocation]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Gabim gjatë hyrjes");
      }
      if (result.requiresTwoFactor) {
        setPendingCredentials(data);
        setTwoFactorStep(true);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gabim gjatë hyrjes";
      toast({
        title: "Gabim",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit2FA = async () => {
    if (!pendingCredentials || !twoFactorCode.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pendingCredentials,
          twoFactorToken: twoFactorCode.trim(),
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Kodi 2FA nuk është i saktë");
      }
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gabim gjatë verifikimit";
      toast({
        title: "Gabim",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (twoFactorStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <span className="text-2xl font-bold text-primary">
                  Verifikim 2FA
                </span>
              </div>
            </div>
            <CardTitle className="text-center text-base font-normal text-muted-foreground">
              Vendosni kodin nga Google Authenticator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twoFactorCode" data-testid="label-2fa-code">
                  Kodi 2FA
                </Label>
                <Input
                  id="twoFactorCode"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest"
                  data-testid="input-2fa-code"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSubmit2FA();
                  }}
                />
              </div>

              <Button
                onClick={onSubmit2FA}
                disabled={isLoading || twoFactorCode.length < 6}
                className="w-full"
                data-testid="button-verify-2fa"
              >
                {isLoading ? "Duke verifikuar..." : "Verifiko"}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setTwoFactorStep(false);
                  setTwoFactorCode("");
                  setPendingCredentials(null);
                }}
                data-testid="button-back-login"
              >
                Kthehu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold text-primary">
                Elektronova
              </span>
            </div>
          </div>
          <CardTitle className="text-center">Hyrje në Sistem</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" data-testid="label-username">
                Emri i Përdoruesit
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Shkruani emrin e përdoruesit"
                data-testid="input-username"
                {...register("username", {
                  required: "Emri i përdoruesit është i detyrueshëm",
                })}
              />
              {errors.username && (
                <p
                  className="text-sm text-destructive"
                  data-testid="error-username"
                >
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" data-testid="label-password">
                Fjalëkalimi
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Shkruani fjalëkalimin"
                data-testid="input-password"
                {...register("password", {
                  required: "Fjalëkalimi është i detyrueshëm",
                })}
              />
              {errors.password && (
                <p
                  className="text-sm text-destructive"
                  data-testid="error-password"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              data-testid="button-login"
            >
              {isLoading ? "Duke u ngarkuar..." : "Identifikohu"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-xs text-muted-foreground">
              Kontaktoni administratorin për llogari të re.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
