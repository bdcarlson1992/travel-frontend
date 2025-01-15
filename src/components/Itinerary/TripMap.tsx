import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
  name: string;
  coordinates: [number, number];
  type?: string;
}

interface TripMapProps {
  locations: Location[];
}

export const TripMap = ({ locations }: TripMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !locations.length) return;

    const map = L.map(mapRef.current).setView(locations[0].coordinates, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markers = locations.map(loc => 
      L.marker(loc.coordinates)
        .bindPopup(`
          <div class="text-center">
            <h4 class="font-semibold">${loc.name}</h4>
            ${loc.type ? `<p class="text-sm text-gray-600">${loc.type}</p>` : ''}
          </div>
        `)
        .addTo(map)
    );

    const bounds = L.featureGroup(markers).getBounds();
    map.fitBounds(bounds.pad(0.1));

    return () => {
      map.remove();
    };
  }, [locations]);

  return <div ref={mapRef} className="h-[400px] rounded-xl shadow-lg" />;
};