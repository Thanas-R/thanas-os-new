import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, Pin, Bookmark, BookOpen, Route, MapPin, Clock, X, Navigation, Plus, Minus } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';

const TOKEN = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) || '';
const DEFAULT_CENTER: [number, number] = [77.5435, 12.9945]; // Basaveshwarnagar area, Bengaluru

interface Suggestion {
  id: string;
  name: string;
  place: string;
  center: [number, number];
}

interface MapboxFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
}

const RECENT_KEY = 'thanasos-maps-recent';

const loadRecent = (): Suggestion[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveRecent = (list: Suggestion[]) =>
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));

export const MapsApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [recent, setRecent] = useState<Suggestion[]>(loadRecent);
  const [activePin, setActivePin] = useState<Suggestion | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [userLoc] = useState<[number, number] | null>(DEFAULT_CENTER);

  // Init map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !TOKEN) return;

    mapboxgl.accessToken = TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: DEFAULT_CENTER,
      zoom: 11,
      attributionControl: false,
      logoPosition: 'top-left',
    });

    mapRef.current = map;

    const resize = () => {
      requestAnimationFrame(() => {
        map.resize();
      });
    };

    map.on('load', () => {
      resize();
      setTimeout(resize, 50);
      setTimeout(resize, 200);
      setTimeout(resize, 500);
    });

    const el = mapContainer.current;
    let ro: ResizeObserver | null = null;

    if (el && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => resize());
      ro.observe(el);
    }

    window.addEventListener('resize', resize);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', resize);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Search (debounced)
  useEffect(() => {
    if (!query.trim() || !TOKEN) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${TOKEN}&autocomplete=true&limit=6${userLoc ? `&proximity=${userLoc.join(',')}` : ''}`;
        const r = await fetch(url);
        const j = await r.json();
        const features = Array.isArray(j.features) ? (j.features as MapboxFeature[]) : [];

        setSuggestions(
          features.map((f) => ({
            id: f.id,
            name: f.text,
            place: f.place_name,
            center: f.center,
          }))
        );
      } catch {
        // ignore
      }
    }, 250);

    return () => clearTimeout(t);
  }, [query, userLoc]);

  const selectSuggestion = useCallback(
    (s: Suggestion) => {
      if (!mapRef.current) return;

      setActivePin(s);
      setQuery(s.name);
      setSuggestions([]);

      mapRef.current.flyTo({ center: s.center, zoom: 14, essential: true });

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker({ color: '#fa2d48' })
        .setLngLat(s.center)
        .setPopup(new mapboxgl.Popup({ offset: 24 }).setText(s.place))
        .addTo(mapRef.current);

      const next = [s, ...recent.filter((r) => r.id !== s.id)];
      setRecent(next);
      saveRecent(next);
    },
    [recent]
  );

  const directions = useCallback(async () => {
    if (!activePin || !userLoc || !mapRef.current || !TOKEN) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLoc[0]},${userLoc[1]};${activePin.center[0]},${activePin.center[1]}?geometries=geojson&access_token=${TOKEN}`;
    const r = await fetch(url);
    const j = await r.json();
    const route = j.routes?.[0];
    if (!route) return;

    setRouteInfo({ distance: route.distance, duration: route.duration });

    const map = mapRef.current;
    if (map.getLayer('route-line')) map.removeLayer('route-line');
    if (map.getSource('route-src')) map.removeSource('route-src');

    map.addSource('route-src', {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: route.geometry },
    });

    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route-src',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#2f7df7', 'line-width': 5, 'line-opacity': 0.9 },
    });

    const coords = route.geometry.coordinates as [number, number][];
    const b = coords.reduce((bb, c) => bb.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]));
    map.fitBounds(b, { padding: { top: 80, left: 380, right: 60, bottom: 80 } });
  }, [activePin, userLoc]);

  const sidebarBg = dark ? 'rgba(28,28,30,0.75)' : 'rgba(245,245,247,0.75)';
  const text = dark ? '#f5f5f7' : '#1c1c1e';
  const sub = dark ? '#a8a8ad' : '#6b7280';
  const itemHover = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  return (
    <div
      className="absolute inset-0 w-full h-full relative overflow-hidden min-w-0 min-h-0"
      style={{ background: dark ? '#1c1c1e' : '#e8eef3' }}
    >
      {!TOKEN && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-8 text-center"
          style={{ color: text, background: dark ? '#111' : '#f5f5f7' }}
        >
          <div className="max-w-md">
            <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: '#fa2d48' }} />
            <h2 className="text-lg font-semibold mb-2">Add your Mapbox token</h2>
            <p className="text-sm opacity-70">
              Set the env var <code className="px-1.5 py-0.5 rounded bg-black/20">VITE_MAPBOX_TOKEN</code> in Vercel and redeploy.
            </p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={mapContainer}
          className="absolute inset-0"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* Floating frosted pill */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 8,
          left: 7,
          width: 100,
          height: 28,
          borderRadius: 999,
          background: dark ? 'rgba(22,27,34,0.78)' : 'rgba(255,255,255,0.78)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          backdropFilter: 'blur(18px) saturate(180%)',
          WebkitBackdropFilter: 'blur(18px) saturate(180%)',
          zIndex: 5,
        }}
      />

      {/* Sidebar */}
      <div
        className="absolute left-3 w-[320px] max-h-[calc(100%-72px)] rounded-2xl flex flex-col overflow-hidden"
        style={{
          top: 56,
          background: sidebarBg,
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
          color: text,
          paddingTop: 10,
        }}
      >
        <div className="px-3 pb-2">
          <div
            className="flex items-center gap-2 px-3 h-9 rounded-lg"
            style={{ background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.85)' }}
          >
            <Search className="w-4 h-4 opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Maps"
              className="bg-transparent flex-1 text-[13px] outline-none"
              style={{ color: text }}
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setSuggestions([]);
                }}
              >
                <X className="w-3.5 h-3.5 opacity-60" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-auto thin-scrollbar px-2 pb-3">
          {suggestions.length > 0 && (
            <div className="mb-2">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectSuggestion(s)}
                  className="w-full text-left px-3 py-2 rounded-lg flex items-start gap-2"
                  onMouseEnter={(e) => (e.currentTarget.style.background = itemHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-medium truncate">{s.name}</div>
                    <div className="text-[11px] truncate" style={{ color: sub }}>
                      {s.place}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {suggestions.length === 0 && (
            <>
              <div className="text-[10.5px] uppercase tracking-wider mt-2 mb-1 px-3" style={{ color: sub }}>
                Places
              </div>
              <SidebarItem icon={<Pin className="w-4 h-4" />} label="Pinned" hover={itemHover} text={text} />
              <SidebarItem icon={<Bookmark className="w-4 h-4" />} label="Saved Places" hover={itemHover} text={text} />
              <SidebarItem icon={<BookOpen className="w-4 h-4" />} label="Guides" hover={itemHover} text={text} />
              <SidebarItem icon={<Route className="w-4 h-4" />} label="Routes" hover={itemHover} text={text} />
              <SidebarItem icon={<MapPin className="w-4 h-4" />} label="Visited Places" hover={itemHover} text={text} />
              <SidebarItem icon={<Clock className="w-4 h-4" />} label="Recently Added" hover={itemHover} text={text} />

              <div className="text-[10.5px] uppercase tracking-wider mt-3 mb-1 px-3" style={{ color: sub }}>
                Recents
              </div>
              {recent.length === 0 ? (
                <div className="px-3 py-2 text-[12px]" style={{ color: sub }}>
                  No recent searches.
                </div>
              ) : (
                recent.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => selectSuggestion(s)}
                    className="w-full text-left px-3 py-2 rounded-lg flex items-start gap-2"
                    onMouseEnter={(e) => (e.currentTarget.style.background = itemHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Clock className="w-3.5 h-3.5 mt-0.5 opacity-70" />
                    <div className="min-w-0">
                      <div className="text-[13px] truncate">{s.name}</div>
                      <div className="text-[11px] truncate" style={{ color: sub }}>
                        {s.place}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {/* Right zoom + locate controls */}
      <div className="absolute top-14 right-3 flex flex-col gap-2 z-10">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-9 h-9 rounded-lg flex items-center justify-center shadow"
          style={{
            background: sidebarBg,
            backdropFilter: 'blur(20px)',
            color: text,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-9 h-9 rounded-lg flex items-center justify-center shadow"
          style={{
            background: sidebarBg,
            backdropFilter: 'blur(20px)',
            color: text,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => userLoc && mapRef.current?.flyTo({ center: userLoc, zoom: 14 })}
          className="w-9 h-9 rounded-lg flex items-center justify-center shadow"
          style={{
            background: sidebarBg,
            backdropFilter: 'blur(20px)',
            color: text,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <Navigation className="w-4 h-4" />
        </button>
      </div>

      {/* Active pin info */}
      {activePin && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-md w-[92%] rounded-2xl p-3 flex items-center gap-3"
          style={{
            background: sidebarBg,
            backdropFilter: 'blur(28px) saturate(180%)',
            color: text,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate">{activePin.name}</div>
            <div className="text-[11px] truncate" style={{ color: sub }}>
              {routeInfo
                ? `${(routeInfo.distance / 1000).toFixed(1)} km · ${Math.round(routeInfo.duration / 60)} min drive`
                : activePin.place}
            </div>
          </div>
          <button
            onClick={directions}
            disabled={!userLoc}
            className="px-3 h-8 rounded-lg text-[12.5px] font-medium text-white disabled:opacity-50"
            style={{ background: '#2f7df7' }}
          >
            Directions
          </button>
          <button
            onClick={() => {
              setActivePin(null);
              setRouteInfo(null);
              markerRef.current?.remove();
              markerRef.current = null;
              const m = mapRef.current;
              if (m && m.getLayer('route-line')) {
                m.removeLayer('route-line');
                m.removeSource('route-src');
              }
            }}
          >
            <X className="w-4 h-4 opacity-78" />
          </button>
        </div>
      )}
    </div>
  );
};

const SidebarItem = ({
  icon,
  label,
  hover,
  text,
}: {
  icon: React.ReactNode;
  label: string;
  hover: string;
  text: string;
}) => (
  <button
    className="w-full text-left px-3 py-1.5 rounded-lg flex items-center gap-3"
    onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
  >
    <span style={{ color: text }}>{icon}</span>
    <span className="text-[13px]">{label}</span>
  </button>
);
