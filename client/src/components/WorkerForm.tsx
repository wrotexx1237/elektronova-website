import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWorkerSchema, InsertWorker, Worker } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignaturePad } from "./SignaturePad";

interface WorkerFormProps {
    worker?: Worker;
    onSubmit: (data: InsertWorker) => void;
    isSubmitting?: boolean;
}

export default function WorkerForm({ worker, onSubmit, isSubmitting }: WorkerFormProps) {
    const form = useForm<InsertWorker>({
        resolver: zodResolver(insertWorkerSchema),
        defaultValues: worker ? {
            name: worker.name,
            personalNumber: worker.personalNumber,
            address: worker.address,
            city: worker.city,
            phone: worker.phone,
            email: worker.email || "",
            profession: worker.profession,
            position: worker.position,
            department: worker.department,
            salary: worker.salary,
            bankAccount: worker.bankAccount || "",
            bankName: worker.bankName || "",
            startDate: worker.startDate,
            contractType: worker.contractType,
            contractDuration: worker.contractDuration || "",
            workingHours: worker.workingHours,
            workSchedule: worker.workSchedule,
            workplace: worker.workplace,
            probationPeriod: worker.probationPeriod,
            employerSignature: worker.employerSignature || "",
            paymentMethod: (worker.paymentMethod as "bank" | "cash") || "bank",
        } : {
            contractType: "Caktuar",
            workingHours: 40,
            workSchedule: "Hëne - Premte, 08:00 - 16:00",
            workplace: "Zyrat qendrore / Terren",
            probationPeriod: "1 Muaj",
            salary: 0,
            paymentMethod: "bank" as const,
            bankAccount: "",
            bankName: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <ScrollArea className="h-[60vh] pr-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                        {/* Informata Personale */}
                        <div className="col-span-full mb-2">
                            <h3 className="text-lg font-semibold border-b pb-2">Informata Personale</h3>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Emri dhe Mbiemri *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="personalNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numri Personal *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresa *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Qyteti *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numri i telefonit *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email (Opsionale)</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Informata Profesionale */}
                        <div className="col-span-full mt-4 mb-2">
                            <h3 className="text-lg font-semibold border-b pb-2">Informata Profesionale</h3>
                        </div>

                        <FormField
                            control={form.control}
                            name="profession"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profesioni *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Zgjedh profesionin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Elektricist">Elektricist</SelectItem>
                                            <SelectItem value="Inxhinier">Inxhinier</SelectItem>
                                            <SelectItem value="Teknik">Teknik</SelectItem>
                                            <SelectItem value="Ndihmës">Ndihmës</SelectItem>
                                            <SelectItem value="Administrator">Administrator</SelectItem>
                                            <SelectItem value="Menaxher">Menaxher</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Shërbim ndaj klientit">Shërbim ndaj klientit</SelectItem>
                                            <SelectItem value="Tjetër">Tjetër</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pozita *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Zgjedh pozitën" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Instalues">Instalues</SelectItem>
                                            <SelectItem value="Teknik Alarmi">Teknik Alarmi</SelectItem>
                                            <SelectItem value="Teknik Kamerash">Teknik Kamerash</SelectItem>
                                            <SelectItem value="Mbikëqyrës">Mbikëqyrës</SelectItem>
                                            <SelectItem value="Punëtor Krahu">Punëtor Krahu</SelectItem>
                                            <SelectItem value="Asistente Administrative">Asistente Administrative</SelectItem>
                                            <SelectItem value="Menaxher Social Media">Menaxher Social Media</SelectItem>
                                            <SelectItem value="Menaxhere e Klientëve">Menaxhere e Klientëve</SelectItem>
                                            <SelectItem value="Customer Support">Customer Support</SelectItem>
                                            <SelectItem value="Menaxhim Dokumentacioni">Menaxhim Dokumentacioni</SelectItem>
                                            <SelectItem value="Zëvendës Drejtor">Zëvendës Drejtor</SelectItem>
                                            <SelectItem value="Drejtor">Drejtor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Departamenti *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Zgjedh departamentin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Rrymë Elektrike">Rrymë Elektrike</SelectItem>
                                            <SelectItem value="Kamera & Siguri">Kamera & Siguri</SelectItem>
                                            <SelectItem value="Mirëmbajtje">Mirëmbajtje</SelectItem>
                                            <SelectItem value="Administrata">Administrata</SelectItem>
                                            <SelectItem value="Shitje">Shitje</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Shërbim ndaj klientit">Shërbim ndaj klientit</SelectItem>
                                            <SelectItem value="Logjistika">Logjistika</SelectItem>
                                            <SelectItem value="Menaxhmenti">Menaxhmenti</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Data e fillimit të punës *</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contractType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lloji i kontratës</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Zgjedh llojin" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Caktuar">Kohë e caktuar</SelectItem>
                                            <SelectItem value="Pacaktuar">Kohë e pacaktuar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="contractDuration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Periudha e kontratës</FormLabel>
                                    <FormControl>
                                        <Input placeholder="psh. 1 Vit (E thatë nëse e pacaktuar)" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Informata Financiare & Kushtet */}
                        <div className="col-span-full mt-4 mb-2">
                            <h3 className="text-lg font-semibold border-b pb-2">Informata Financiare & Kushtet</h3>
                        </div>

                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Paga bruto (Euro) *</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Metoda e Pagesës *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value || "bank"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Zgjedh metodën" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="bank">Transfer Bankar</SelectItem>
                                            <SelectItem value="cash">Para në dorë (Cash)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {form.watch("paymentMethod") === "bank" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Banka *</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="bankAccount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Xhirollogaria bankare *</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <FormField
                            control={form.control}
                            name="workingHours"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Orët e punës në javë</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="workSchedule"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Orari i punës</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="workplace"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vendi i punës</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Zgjedh vendin e punës" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Zyrat qendrore">Zyrat qendrore</SelectItem>
                                            <SelectItem value="Terren">Terren</SelectItem>
                                            <SelectItem value="Zyrat qendrore / Terren">Zyrat qendrore / Terren</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="probationPeriod"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Periudha provuese</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Deklarata dhe Nënshkrimet */}
                        <div className="col-span-full mt-6 mb-2">
                            <h3 className="text-lg font-semibold border-b pb-2">Deklarata dhe Nënshkrimet</h3>
                            <p className="text-xs text-muted-foreground mt-2 italic">
                                Duke nënshkruar këtë dokument, palët konfirmojnë vërtetësinë e të dhënave dhe pranojnë kushtet e rëna dakord.
                            </p>
                        </div>

                        <div className="col-span-1">
                            <SignaturePad
                                label="Nënshkrimi i Punëtorit"
                                defaultValue={worker?.workerSignature || undefined}
                                onSave={(data) => form.setValue("workerSignature", data, { shouldDirty: true })}
                            />
                        </div>

                        <div className="col-span-1">
                            <SignaturePad
                                label="Nënshkrimi i Punëdhënësit"
                                defaultValue={worker?.employerSignature || undefined}
                                onSave={(data) => form.setValue("employerSignature", data, { shouldDirty: true })}
                            />
                        </div>

                    </div>
                </ScrollArea>

                <div className="flex justify-end pt-4 border-t">
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-w-[124px]">
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        {worker ? "Ruaj Ndryshimet" : "Regjistro"}
                    </Button>
                </div>
            </form>
        </Form >
    );
}
