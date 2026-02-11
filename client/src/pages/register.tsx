import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";

interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: { username: "", password: "", confirmPassword: "", fullName: "", phone: "" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({ title: "Gabim", description: "Fjalëkalimet nuk përputhen", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/register", {
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone || null,
        role: "technician",
      });
      await apiRequest("POST", "/api/auth/login", { username: data.username, password: data.password });
      await queryClient.invalidateQueries();
      setLocation("/");
    } catch (error) {
      toast({
        title: "Gabim",
        description: error instanceof Error ? error.message : "Gabim gjatë regjistrimit",
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
              <span className="text-2xl font-bold text-primary">Elektronova</span>
            </div>
          </div>
          <CardTitle className="text-center">Regjistrim i Ri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Emri i Plotë</Label>
              <Input id="fullName" data-testid="input-fullname" placeholder="p.sh. Arben Hoxha"
                {...register("fullName", { required: "Emri është i detyrueshëm" })} />
              {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Emri i Përdoruesit</Label>
              <Input id="username" data-testid="input-username" placeholder="p.sh. arben"
                {...register("username", { required: "Emri i përdoruesit është i detyrueshëm" })} />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefoni</Label>
              <Input id="phone" data-testid="input-phone" placeholder="+383 4X XXX XXX"
                {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Fjalëkalimi</Label>
              <Input id="password" type="password" data-testid="input-password" placeholder="Minimum 6 karaktere"
                {...register("password", { required: "Fjalëkalimi është i detyrueshëm", minLength: { value: 6, message: "Minimum 6 karaktere" } })} />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmo Fjalëkalimin</Label>
              <Input id="confirmPassword" type="password" data-testid="input-confirm-password"
                {...register("confirmPassword", { required: "Konfirmoni fjalëkalimin" })} />
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full" data-testid="button-register-submit">
              {isLoading ? "Duke u regjistruar..." : "Regjistrohu"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setLocation("/login")} data-testid="button-go-login">
              Keni llogari? Identifikohu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
