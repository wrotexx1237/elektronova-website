import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Zap } from "lucide-react";
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
      await apiRequest("POST", "/api/auth/login", data);
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
