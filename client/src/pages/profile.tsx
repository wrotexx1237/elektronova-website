import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Layout } from "@/components/layout";
import { User, Mail, Phone, Lock, ShieldCheck, ShieldOff, Loader2, KeyRound, Eye, EyeOff } from "lucide-react";

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<{ qrCode: string; secret: string } | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [showDisable2FA, setShowDisable2FA] = useState(false);

  const { data: currentUser, isLoading } = useQuery<any>({
    queryKey: ["/api/auth/me"],
  });

  const profileForm = useForm<ProfileFormData>({
    values: {
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const profileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => apiRequest("PATCH", "/api/auth/profile", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Sukses", description: "Profili u përditësua me sukses" });
    },
    onError: (err: Error) => {
      toast({ title: "Gabim", description: err.message, variant: "destructive" });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiRequest("POST", "/api/auth/change-password", data),
    onSuccess: () => {
      passwordForm.reset();
      toast({ title: "Sukses", description: "Fjalëkalimi u ndryshua me sukses" });
    },
    onError: (err: Error) => {
      toast({ title: "Gabim", description: err.message, variant: "destructive" });
    },
  });

  const setup2FAMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auth/2fa/setup"),
    onSuccess: async (res: Response) => {
      const data = await res.json();
      setTwoFactorSetup(data);
    },
    onError: (err: Error) => {
      toast({ title: "Gabim", description: err.message, variant: "destructive" });
    },
  });

  const verify2FAMutation = useMutation({
    mutationFn: (token: string) => apiRequest("POST", "/api/auth/2fa/verify", { token }),
    onSuccess: () => {
      setTwoFactorSetup(null);
      setVerifyCode("");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Sukses", description: "2FA u aktivizua me sukses" });
    },
    onError: (err: Error) => {
      toast({ title: "Gabim", description: err.message, variant: "destructive" });
    },
  });

  const disable2FAMutation = useMutation({
    mutationFn: (password: string) => apiRequest("POST", "/api/auth/2fa/disable", { password }),
    onSuccess: () => {
      setShowDisable2FA(false);
      setDisablePassword("");
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Sukses", description: "2FA u çaktivizua" });
    },
    onError: (err: Error) => {
      toast({ title: "Gabim", description: err.message, variant: "destructive" });
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    profileMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({ title: "Gabim", description: "Fjalëkalimet nuk përputhen", variant: "destructive" });
      return;
    }
    if (data.newPassword.length < 6) {
      toast({ title: "Gabim", description: "Fjalëkalimi duhet të ketë së paku 6 karaktere", variant: "destructive" });
      return;
    }
    passwordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-lg">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-profile-title">Profili Im</h1>
            <p className="text-sm text-muted-foreground">Menaxhoni të dhënat e profilit tuaj</p>
          </div>
          <Badge variant="secondary" className="ml-auto no-default-active-elevate">
            {isAdmin ? "Admin" : "Teknician"}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Të Dhënat e Përgjithshme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prof-username">Emri i Përdoruesit</Label>
                <Input
                  id="prof-username"
                  value={currentUser?.username || ""}
                  disabled
                  className="bg-muted"
                  data-testid="input-profile-username"
                />
                <p className="text-xs text-muted-foreground">Emri i përdoruesit nuk mund të ndryshohet</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-fullname">Emri i Plotë</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="prof-fullname"
                    className="pl-10"
                    data-testid="input-profile-fullname"
                    {...profileForm.register("fullName", { required: true })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="prof-email"
                    type="email"
                    className="pl-10"
                    placeholder="email@shembull.com"
                    data-testid="input-profile-email"
                    {...profileForm.register("email")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prof-phone">Telefoni</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="prof-phone"
                    type="tel"
                    className="pl-10"
                    placeholder="+383 4X XXX XXX"
                    data-testid="input-profile-phone"
                    {...profileForm.register("phone")}
                  />
                </div>
              </div>

              <Button type="submit" disabled={profileMutation.isPending} data-testid="button-save-profile">
                {profileMutation.isPending ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <KeyRound className="h-5 w-5" />
              Ndrysho Fjalëkalimin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Fjalëkalimi Aktual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type={showCurrentPass ? "text" : "password"}
                    className="pl-10 pr-10"
                    data-testid="input-current-password"
                    {...passwordForm.register("currentPassword", { required: true })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    tabIndex={-1}
                  >
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Fjalëkalimi i Ri</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showNewPass ? "text" : "password"}
                    className="pl-10 pr-10"
                    data-testid="input-new-password"
                    {...passwordForm.register("newPassword", { required: true, minLength: 6 })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPass(!showNewPass)}
                    tabIndex={-1}
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmo Fjalëkalimin e Ri</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className="pl-10"
                    data-testid="input-confirm-password"
                    {...passwordForm.register("confirmPassword", { required: true })}
                  />
                </div>
              </div>

              <Button type="submit" disabled={passwordMutation.isPending} data-testid="button-change-password">
                {passwordMutation.isPending ? "Duke ndryshuar..." : "Ndrysho Fjalëkalimin"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5" />
              Autentifikimi me Dy Faktorë (2FA)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser?.twoFactorEnabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-800">
                  <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300" data-testid="text-2fa-status">2FA është aktive</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Llogaria juaj është e mbrojtur me autentifikim dy-faktorësh.</p>
                  </div>
                </div>

                {showDisable2FA ? (
                  <div className="space-y-3 p-4 border rounded-md">
                    <p className="text-sm text-muted-foreground">Vendosni fjalëkalimin për të çaktivizuar 2FA:</p>
                    <Input
                      type="password"
                      value={disablePassword}
                      onChange={(e) => setDisablePassword(e.target.value)}
                      placeholder="Fjalëkalimi"
                      data-testid="input-disable-2fa-password"
                    />
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="destructive"
                        onClick={() => disable2FAMutation.mutate(disablePassword)}
                        disabled={disable2FAMutation.isPending || !disablePassword}
                        data-testid="button-confirm-disable-2fa"
                      >
                        {disable2FAMutation.isPending ? "Duke çaktivizuar..." : "Çaktivizo 2FA"}
                      </Button>
                      <Button variant="ghost" onClick={() => { setShowDisable2FA(false); setDisablePassword(""); }}
                        data-testid="button-cancel-disable-2fa">
                        Anulo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowDisable2FA(true)}
                    data-testid="button-disable-2fa"
                  >
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Çaktivizo 2FA
                  </Button>
                )}
              </div>
            ) : twoFactorSetup ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Skanoni kodin QR me Google Authenticator ose një aplikacion tjetër TOTP:
                </p>
                <div className="flex justify-center p-4 bg-white rounded-md">
                  <img
                    src={twoFactorSetup.qrCode}
                    alt="2FA QR Code"
                    className="w-48 h-48"
                    data-testid="img-2fa-qrcode"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Çelësi manual (nëse nuk mund të skanoni):</Label>
                  <div className="p-2 bg-muted rounded-md font-mono text-sm break-all select-all" data-testid="text-2fa-secret">
                    {twoFactorSetup.secret}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verify-2fa">Vendosni kodin 6-shifror për verifikim:</Label>
                  <Input
                    id="verify-2fa"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    className="text-center text-xl tracking-widest max-w-xs"
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                    data-testid="input-verify-2fa-code"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={() => verify2FAMutation.mutate(verifyCode)}
                    disabled={verify2FAMutation.isPending || verifyCode.length < 6}
                    data-testid="button-verify-2fa"
                  >
                    {verify2FAMutation.isPending ? "Duke verifikuar..." : "Aktivizo 2FA"}
                  </Button>
                  <Button variant="ghost" onClick={() => { setTwoFactorSetup(null); setVerifyCode(""); }}
                    data-testid="button-cancel-2fa-setup">
                    Anulo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-md">
                  <ShieldOff className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium" data-testid="text-2fa-status">2FA nuk është aktive</p>
                    <p className="text-sm text-muted-foreground">Aktivizoni 2FA me Google Authenticator për siguri më të lartë.</p>
                  </div>
                </div>
                <Button onClick={() => setup2FAMutation.mutate()} disabled={setup2FAMutation.isPending}
                  data-testid="button-setup-2fa">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  {setup2FAMutation.isPending ? "Duke konfiguruar..." : "Aktivizo 2FA"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
