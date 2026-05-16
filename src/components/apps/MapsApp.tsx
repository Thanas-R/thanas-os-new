import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Search, Pin, Bookmark, BookOpen, Route as RouteIcon, MapPin, Clock, X, Navigation, Plus, Minus, Car, PersonStanding, Bike, Bus } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';

const TOKEN = (import.meta.env.VITE_MAPBOX_TOKEN as string | undefined) || '';
// Pavitra Paradise, Basaveshwarnagar, Bengaluru
const DEFAULT_CENTER: [number, number] = [77.5387, 12.9928];

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
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; steps: number } | null>(null);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const [userLoc] = useState<[number, number] | null>(DEFAULT_CENTER);
  const [mapReady, setMapReady] = useState(false);

  // Init map — wait for the container to settle (window open animation)
  // before creating the Mapbox instance so it boots at the final size.
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !TOKEN) return;

    mapboxgl.accessToken = TOKEN;
    const el = mapContainer.current;
    let map: mapboxgl.Map | null = null;
    let ro: ResizeObserver | null = null;
    let stableTimer: number | null = null;
    let lastW = 0;
    let lastH = 0;

    const initMap = () => {
      if (mapRef.current || !mapContainer.current) return;
      map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: DEFAULT_CENTER,
        zoom: 11,
        attributionControl: false,
        logoPosition: 'top-left',
        fadeDuration: 0,
      });
      mapRef.current = map;

      const resize = () => map?.resize();
      map.once('idle', () => setMapReady(true));

      // Current-location pin (Apple-style blue dot with pulsing halo)
      const userEl = document.createElement('div');
      userEl.style.cssText = 'position:relative;width:18px;height:18px;';
      userEl.innerHTML = `
        <span style="position:absolute;inset:-10px;border-radius:9999px;background:rgba(47,125,247,0.22);animation:ml-pulse 2s ease-out infinite;"></span>
        <span style="position:absolute;inset:0;border-radius:9999px;background:#2f7df7;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.35);"></span>`;
      if (!document.getElementById('ml-pulse-kf')) {
        const st = document.createElement('style');
        st.id = 'ml-pulse-kf';
        st.textContent = '@keyframes ml-pulse{0%{transform:scale(0.6);opacity:.7}100%{transform:scale(1.6);opacity:0}}';
        document.head.appendChild(st);
      }
      new mapboxgl.Marker({ element: userEl, anchor: 'center' }).setLngLat(DEFAULT_CENTER).addTo(map);

      if (typeof ResizeObserver !== 'undefined') {
        ro?.disconnect();
        ro = new ResizeObserver(() => requestAnimationFrame(resize));
        ro.observe(el);
      }
      window.addEventListener('resize', resize);
    };

    // Poll container size until it stops changing for ~100ms, then init.
    const waitForStableSize = () => {
      const r = el.getBoundingClientRect();
      if (r.width === lastW && r.height === lastH && r.width > 0 && r.height > 0) {
        initMap();
        return;
      }
      lastW = r.width;
      lastH = r.height;
      stableTimer = window.setTimeout(waitForStableSize, 80);
    };
    waitForStableSize();

    return () => {
      if (stableTimer) clearTimeout(stableTimer);
      ro?.disconnect();
      window.removeEventListener('resize', () => map?.resize());
      map?.remove();
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
      setRouteInfo(null);

      mapRef.current.flyTo({ center: s.center, zoom: 14, essential: true });

      if (markerRef.current) markerRef.current.remove();

      // Apple-style teardrop pin
      const pinEl = document.createElement('div');
      pinEl.style.cssText = 'width:30px;height:38px;transform:translateY(-4px);filter:drop-shadow(0 3px 4px rgba(0,0,0,0.35));';
      pinEl.innerHTML = `
        <svg viewBox="0 0 30 38" width="30" height="38" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 1C7.82 1 2 6.82 2 14c0 9.5 13 23 13 23s13-13.5 13-23C28 6.82 22.18 1 15 1z" fill="#fa2d48" stroke="#fff" stroke-width="2"/>
          <circle cx="15" cy="14" r="4.5" fill="#fff"/>
        </svg>`;

      markerRef.current = new mapboxgl.Marker({ element: pinEl, anchor: 'bottom' })
        .setLngLat(s.center)
        .setPopup(new mapboxgl.Popup({ offset: 34, closeButton: false }).setText(s.place))
        .addTo(mapRef.current);

      const next = [s, ...recent.filter((r) => r.id !== s.id)];
      setRecent(next);
      saveRecent(next);
    },
    [recent]
  );

  const directions = useCallback(async () => {
    if (!activePin || !userLoc || !mapRef.current || !TOKEN) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${userLoc[0]},${userLoc[1]};${activePin.center[0]},${activePin.center[1]}?geometries=geojson&steps=true&access_token=${TOKEN}`;
    const r = await fetch(url);
    const j = await r.json();
    const route = j.routes?.[0];
    if (!route) return;

    const steps = route.legs?.[0]?.steps?.length ?? 0;
    setRouteInfo({ distance: route.distance, duration: route.duration, steps });

    const map = mapRef.current;
    if (map.getLayer('route-line')) map.removeLayer('route-line');
    if (map.getLayer('route-casing')) map.removeLayer('route-casing');
    if (map.getSource('route-src')) map.removeSource('route-src');

    map.addSource('route-src', {
      type: 'geojson',
      data: { type: 'Feature', properties: {}, geometry: route.geometry },
    });

    // White casing under the blue line — Apple Maps style
    map.addLayer({
      id: 'route-casing',
      type: 'line',
      source: 'route-src',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#ffffff', 'line-width': 9, 'line-opacity': 0.95 },
    });
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route-src',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#2f7df7', 'line-width': 5.5, 'line-opacity': 1 },
    });

    const coords = route.geometry.coordinates as [number, number][];
    const b = coords.reduce((bb, c) => bb.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]));
    map.fitBounds(b, { padding: { top: 80, left: 380, right: 60, bottom: 160 } });
  }, [activePin, userLoc, travelMode]);

  const sidebarBg = dark ? 'rgba(28,28,30,0.75)' : 'rgba(245,245,247,0.75)';
  const text = dark ? '#f5f5f7' : '#1c1c1e';
  const sub = dark ? '#a8a8ad' : '#6b7280';
  const itemHover = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

  return (
    <div
      className="maps-app-container absolute inset-0 overflow-hidden"
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
            opacity: mapReady ? 1 : 0,
            transition: 'opacity 180ms ease-out',
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
              <SidebarItem icon={<RouteIcon className="w-4 h-4" />} label="Routes" hover={itemHover} text={text} />
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

      {/* Active pin info / directions card — Apple Maps style */}
      {activePin && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[440px] w-[92%] rounded-2xl p-3"
          style={{
            background: sidebarBg,
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            color: text,
            border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#fa2d48' }}>
              <MapPin className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-semibold truncate">{activePin.name}</div>
              <div className="text-[11px] truncate" style={{ color: sub }}>{activePin.place}</div>
            </div>
            <button
              onClick={() => {
                setActivePin(null);
                setRouteInfo(null);
                markerRef.current?.remove();
                markerRef.current = null;
                const m = mapRef.current;
                if (m && m.getLayer('route-line')) { m.removeLayer('route-line'); m.removeSource('route-src'); }
                if (m && m.getLayer('route-casing')) m.removeLayer('route-casing');
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)' }}
            >
              <X className="w-3.5 h-3.5 opacity-75" />
            </button>
          </div>

          {/* Travel-mode segmented control */}
          <div className="mt-3 flex items-center gap-1 p-1 rounded-xl" style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
            {([
              { id: 'driving' as const, icon: <Car className="w-3.5 h-3.5" />, label: 'Drive' },
              { id: 'walking' as const, icon: <PersonStanding className="w-3.5 h-3.5" />, label: 'Walk' },
              { id: 'cycling' as const, icon: <Bike className="w-3.5 h-3.5" />, label: 'Cycle' },
              { id: 'transit' as const, icon: <Bus className="w-3.5 h-3.5 opacity-40" />, label: 'Transit' },
            ]).map((m) => {
              const active = travelMode === m.id;
              const disabled = m.id === 'transit';
              return (
                <button
                  key={m.id}
                  disabled={disabled}
                  onClick={() => !disabled && setTravelMode(m.id as 'driving' | 'walking' | 'cycling')}
                  className="flex-1 h-7 rounded-lg flex items-center justify-center gap-1.5 text-[11.5px] font-medium disabled:opacity-40"
                  style={{
                    background: active ? (dark ? 'rgba(255,255,255,0.18)' : '#fff') : 'transparent',
                    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.12)' : undefined,
                    color: active ? text : sub,
                  }}
                >
                  {m.icon}<span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 min-w-0">
              {routeInfo ? (
                <div className="leading-tight">
                  <div className="text-[15px] font-semibold" style={{ color: '#2f7df7' }}>
                    {Math.max(1, Math.round(routeInfo.duration / 60))} min
                  </div>
                  <div className="text-[11px]" style={{ color: sub }}>
                    {(routeInfo.distance / 1000).toFixed(1)} km · {routeInfo.steps} step{routeInfo.steps === 1 ? '' : 's'} · via fastest route
                  </div>
                </div>
              ) : (
                <div className="text-[11.5px]" style={{ color: sub }}>Get turn-by-turn directions from your location.</div>
              )}
            </div>
            <button
              onClick={directions}
              disabled={!userLoc}
              className="px-4 h-9 rounded-full text-[12.5px] font-semibold text-white disabled:opacity-50 flex items-center gap-1.5"
              style={{ background: '#2f7df7' }}
            >
              <RouteIcon className="w-3.5 h-3.5" /> {routeInfo ? 'Go' : 'Directions'}
            </button>
          </div>
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
