import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Trash2, Check, RefreshCw, Maximize2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

interface SignaturePadProps {
    onSave: (signatureDataUrl: string) => void;
    onClear?: () => void;
    label?: string;
    defaultValue?: string;
}

export function SignaturePad({ onSave, onClear, label, defaultValue }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const fullSigCanvas = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    // Sync state with defaultValue presence
    useEffect(() => {
        if (defaultValue) {
            setIsEmpty(false);
        }
    }, [defaultValue]);

    const clear = () => {
        sigCanvas.current?.clear();
        fullSigCanvas.current?.clear();
        setIsEmpty(true);
        onSave("");
        if (onClear) onClear();
    };

    const handleCapture = (canvasRef: React.RefObject<SignatureCanvas>) => {
        if (canvasRef.current && !canvasRef.current.isEmpty()) {
            try {
                const trimmed = canvasRef.current.getTrimmedCanvas();
                onSave(trimmed.toDataURL('image/png'));
                setIsEmpty(false);
            } catch (e) {
                onSave(canvasRef.current.getCanvas().toDataURL('image/png'));
                setIsEmpty(false);
            }
        }
    };

    const handleSaveAndClose = () => {
        handleCapture(fullSigCanvas);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                {label && <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{label}</label>}
            </div>

            <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl bg-white overflow-hidden relative group min-h-[160px] shadow-sm">
                <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    minWidth={5}
                    maxWidth={12}
                    velocityFilterWeight={0.5}
                    canvasProps={{
                        className: "signature-canvas w-full h-40 cursor-crosshair",
                    }}
                    onEnd={() => {
                        setIsEmpty(false);
                        handleCapture(sigCanvas);
                    }}
                />

                {defaultValue && isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 bg-white">
                        <img src={defaultValue} alt="Nënshkrimi aktual" className="max-h-32" />
                    </div>
                )}

                <div className="absolute top-2 right-2 flex gap-1 bg-background/90 p-1 rounded-lg border shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={clear} title="Pastro">
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" title="Zmadho (Full Screen)">
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] w-full h-[85vh] flex flex-col p-4">
                            <DialogHeader>
                                <DialogTitle className="text-center text-xl font-bold">
                                    {label || "Nënshkrimi Dixhital"}
                                </DialogTitle>
                                <p className="text-center text-sm text-muted-foreground italic">
                                    Përdorni gishtin ose mouse-in për të nënshkruar në hapësirën e bardhë
                                </p>
                            </DialogHeader>
                            <div className="flex-1 border-2 border-dashed border-primary/20 rounded-2xl mt-4 bg-white relative overflow-hidden shadow-inner">
                                <SignatureCanvas
                                    ref={fullSigCanvas}
                                    penColor="black"
                                    minWidth={6}
                                    maxWidth={15}
                                    velocityFilterWeight={0.5}
                                    canvasProps={{
                                        className: "w-full h-full cursor-crosshair",
                                    }}
                                    onEnd={() => setIsEmpty(false)}
                                />
                            </div>
                            <DialogFooter className="flex gap-2 sm:justify-center mt-6">
                                <Button variant="outline" onClick={() => fullSigCanvas.current?.clear()} className="flex-1 max-w-[200px] h-12 text-lg">
                                    <Trash2 className="w-5 h-5 mr-2" /> Pastro
                                </Button>
                                <Button onClick={handleSaveAndClose} className="flex-1 max-w-[200px] h-12 text-lg bg-primary text-primary-foreground">
                                    <Check className="w-5 h-5 mr-2" /> Ruaj
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex justify-between items-center px-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                    {isEmpty ? "Drejtojeni nënshkrimin këtu..." : "Nënshkrimi u ruajt automatikisht."}
                </p>
                {!isEmpty && (
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive p-0 hover:bg-transparent" onClick={clear}>
                        Fshi Nënshkrimin
                    </Button>
                )}
            </div>
        </div>
    );
}
