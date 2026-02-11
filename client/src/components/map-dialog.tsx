import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Navigation, MapPin, ExternalLink } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: string;
  clientName: string;
  locationUrl?: string;
}

function extractCoordsFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;

  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /q=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /ll=(-?\d+\.\d+),(-?\d+\.\d+)/,
    /place\/.*\/(-?\d+\.\d+),(-?\d+\.\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
  }
  return null;
}

export function MapDialog({ open, onOpenChange, address, clientName, locationUrl }: MapDialogProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!open) return;

    setLoading(true);
    setError(null);
    setCoords(null);

    const urlCoords = locationUrl ? extractCoordsFromGoogleMapsUrl(locationUrl) : null;
    if (urlCoords) {
      setCoords(urlCoords);
      setLoading(false);
      return;
    }

    if (!address) {
      setError("Nuk ka adresë ose lokacion të vendosur.");
      setLoading(false);
      return;
    }

    const searchAddress = `${address}, Kosovo`;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`, {
      headers: { 'Accept-Language': 'sq' }
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
        } else {
          setError("Adresa nuk u gjet në hartë. Provoni të vendosni linkun e Google Maps.");
        }
      })
      .catch(() => {
        setError("Gabim gjatë kërkimit të adresës.");
      })
      .finally(() => setLoading(false));
  }, [open, address, locationUrl]);

  useEffect(() => {
    if (!coords || !mapRef.current || !open) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      const map = L.map(mapRef.current).setView([coords.lat, coords.lng], 16);
      mapInstance.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="background:hsl(var(--primary));width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        className: ''
      });

      L.marker([coords.lat, coords.lng], { icon }).addTo(map)
        .bindPopup(`<b>${clientName}</b><br/>${address}`)
        .openPopup();

      setTimeout(() => map.invalidateSize(), 100);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coords, open]);

  const openGoogleMaps = () => {
    if (locationUrl) {
      window.open(locationUrl, '_blank');
    } else if (coords) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
    }
  };

  const openWaze = () => {
    if (coords) {
      window.open(`https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-2">{address}</div>

        <div className="w-full h-[350px] rounded-lg overflow-hidden border bg-muted relative" data-testid="map-container">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10 p-4 text-center">
              <div>
                <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          )}
          <div ref={mapRef} className="w-full h-full" />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={openGoogleMaps} className="flex-1" data-testid="button-google-maps">
            <Navigation className="h-4 w-4 mr-2" />
            Google Maps
          </Button>
          {coords && (
            <Button variant="outline" onClick={openWaze} className="flex-1" data-testid="button-waze">
              <ExternalLink className="h-4 w-4 mr-2" />
              Waze
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
