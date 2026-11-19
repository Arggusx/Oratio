import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ArrowLeft, Box, Square } from 'lucide-react';
import PlacePhotos from './PlacePhotos';

/* ============================================================
   Vista 3D de um lugar: ruas e prédios em blocos, em dourado.
   Mesmo caminho do projeto "Desafio de mapas": MapLibre GL com os
   tiles abertos do OpenFreeMap (esquema OpenMapTiles), estilo
   próprio, sem textos nem ícones. O globe.gl não aguenta nível de
   rua, por isso a vista é outro mapa por cima do globo.
   ============================================================ */

const TILES = 'https://tiles.openfreemap.org/planet'; // TileJSON (a atribuição vem junto e o MapLibre mostra)

const VIEW = { zoom: 17, pitch: 60, bearing: -20, maxZoom: 19.5, maxPitch: 75 };

// Paleta dourada: chão bronze escuro, ruas mais escuras ainda, prédios do âmbar ao dourado claro.
// As ruas ficam mais claras que o chão (âmbar apagado) para aparecerem bem no fundo escuro.
const P = {
  ground: '#1a1209',
  water: '#060403',
  green: '#241a0c',
  roadMain: '#9a7231',
  roadMid: '#7d5c25',
  roadMinor: '#5f461c',
  roadService: '#4a3616',
  buildingLow: '#a8752a',
  buildingMid: '#d6a24a',
  buildingHigh: '#f4d07f',
  neon: '#ffe6a8',
  glow: '#e0a93f',
};

function buildStyle() {
  const width = (a, b, c) => ['interpolate', ['exponential', 1.5], ['zoom'], 10, a, 15, b, 20, c];
  const road = (id, classes, color, w) => ({
    id,
    type: 'line',
    source: 'omt',
    'source-layer': 'transportation',
    filter: ['all', ['in', ['get', 'class'], ['literal', classes]], ['!=', ['get', 'brunnel'], 'tunnel']],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': color, 'line-width': width(...w) },
  });
  const height = ['max', 4, ['to-number', ['coalesce', ['get', 'render_height'], 8], 8]];

  return {
    version: 8,
    name: 'oratio-milagres-3d',
    sources: { omt: { type: 'vector', url: TILES } },
    layers: [
      { id: 'fundo', type: 'background', paint: { 'background-color': P.ground } },
      {
        id: 'mata',
        type: 'fill',
        source: 'omt',
        'source-layer': 'landcover',
        filter: ['in', ['get', 'class'], ['literal', ['wood', 'grass', 'wetland']]],
        paint: { 'fill-color': P.green, 'fill-opacity': 0.85 },
      },
      { id: 'parque', type: 'fill', source: 'omt', 'source-layer': 'park', paint: { 'fill-color': P.green } },
      { id: 'agua', type: 'fill', source: 'omt', 'source-layer': 'water', paint: { 'fill-color': P.water } },
      {
        id: 'rio',
        type: 'line',
        source: 'omt',
        'source-layer': 'waterway',
        paint: { 'line-color': P.water, 'line-width': width(0.5, 2, 12) },
      },
      road('rua-servico', ['service', 'track'], P.roadService, [0.2, 2, 16]),
      road('rua-menor', ['minor', 'path'], P.roadMinor, [0.3, 3.5, 28]),
      road('rua-media', ['secondary', 'tertiary'], P.roadMid, [0.6, 5, 40]),
      road('rua-principal', ['motorway', 'trunk', 'primary'], P.roadMain, [1, 7, 60]),
      {
        id: 'pais',
        type: 'line',
        source: 'omt',
        'source-layer': 'boundary',
        filter: ['all', ['<=', ['to-number', ['get', 'admin_level'], 99], 2], ['==', ['get', 'maritime'], 0]],
        paint: { 'line-color': P.neon, 'line-width': 1.2 },
      },
      {
        id: 'predios',
        type: 'fill-extrusion',
        source: 'omt',
        'source-layer': 'building',
        minzoom: 14,
        filter: ['!=', ['get', 'hide_3d'], true],
        paint: {
          'fill-extrusion-color': ['interpolate', ['linear'], height, 0, P.buildingLow, 30, P.buildingMid, 120, P.buildingHigh],
          'fill-extrusion-height': height,
          'fill-extrusion-base': ['to-number', ['coalesce', ['get', 'render_min_height'], 0], 0],
          'fill-extrusion-opacity': 0.95,
          'fill-extrusion-vertical-gradient': true,
        },
      },
    ],
  };
}

function markerElement(kind) {
  const el = document.createElement('div');
  el.className = `site3d-marker is-${kind}`;
  el.innerHTML = '<span class="site3d-marker-pulse"></span><span class="site3d-marker-dot"></span>';
  return el;
}

/** Alfinete de um milagre no mapa 3D (botão: leva até ele). */
function miracleMarkerElement(m, onPick) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'site3d-miracle';
  el.title = `${m.place} · ${m.name}`;
  el.setAttribute('aria-label', `Ir até ${m.name}, em ${m.place}`);
  el.innerHTML = '<span class="site3d-marker-pulse"></span><span class="site3d-marker-dot"></span>';
  el.addEventListener('click', () => {
    onPick(m);
  });
  return el;
}

/** coords: [lat, lng] do lugar; label: nome mostrado no topo. */
export default function MiracleSite3D({
  coords,
  label,
  subtitle,
  zoom = VIEW.zoom,
  miracles = [],
  currentId = null,
  onPickMiracle,
  onBack,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const siteMarker = useRef(null); // ponto do lugar aberto quando não é um milagre
  const miracleMarkers = useRef(new Map()); // id -> elemento
  const pickRef = useRef(onPickMiracle);
  pickRef.current = onPickMiracle;
  const firstView = useRef({ coords, zoom }); // o mapa nasce aqui; depois só voa
  const [lat, lng] = coords;
  const [failed, setFailed] = useState(false);
  const [is3D, setIs3D] = useState(true);
  const is3DRef = useRef(true);
  is3DRef.current = is3D;

  useEffect(() => {
    let map;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: buildStyle(),
        center: [firstView.current.coords[1], firstView.current.coords[0]],
        zoom: firstView.current.zoom - 2, // começa um pouco longe e aproxima: dá a sensação de "descer" do globo
        pitch: 30,
        bearing: 0,
        maxZoom: VIEW.maxZoom,
        maxPitch: VIEW.maxPitch,
        attributionControl: { compact: true },
        // O tile pode demorar no 1º acesso; sem isto a página fica toda cinza enquanto isso.
        fadeDuration: 150,
      });
    } catch (err) {
      console.warn('[3d] WebGL indisponível.', err);
      setFailed(true);
      return undefined;
    }
    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');

    // Todos os milagres ficam no mapa: afastando, aparecem os outros; tocar num leva até ele.
    miracleMarkers.current.clear();
    for (const m of miracles) {
      const el = miracleMarkerElement(m, (picked) => pickRef.current?.(picked));
      miracleMarkers.current.set(m.id, el);
      new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([m.coords[1], m.coords[0]]).addTo(map);
    }

    map.once('load', () => {
      map.easeTo({ zoom: firstView.current.zoom, pitch: VIEW.pitch, bearing: VIEW.bearing, duration: 2200 });
    });
    map.on('error', (e) => console.warn('[3d] Erro do mapa.', e?.error ?? e));

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // O mapa é criado uma vez; trocar de lugar só move a câmera (efeito abaixo).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trocou o lugar (outro milagre escolhido): voa até ele, sem recriar o mapa.
  const lastCoords = useRef(coords);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const [prevLat, prevLng] = lastCoords.current;
    if (prevLat !== lat || prevLng !== lng) {
      lastCoords.current = [lat, lng];
      map.flyTo({ center: [lng, lat], zoom, pitch: is3DRef.current ? VIEW.pitch : 0, essential: true, duration: 2500 });
    }
    // Lugar que não é milagre (busca ou centro do globo): ganha um ponto próprio.
    siteMarker.current?.remove();
    siteMarker.current = currentId
      ? null
      : new maplibregl.Marker({ element: markerElement('site'), anchor: 'center' }).setLngLat([lng, lat]).addTo(map);
  }, [lat, lng, zoom, currentId]);

  // O milagre aberto ganha o destaque (pulso e tamanho maior).
  useEffect(() => {
    for (const [id, el] of miracleMarkers.current) el.classList.toggle('is-current', id === currentId);
  }, [currentId]);

  const toggle3D = () => {
    const map = mapRef.current;
    if (!map) return;
    const next = !is3D;
    setIs3D(next);
    map.setLayoutProperty('predios', 'visibility', next ? 'visible' : 'none');
    map.easeTo(next ? { pitch: VIEW.pitch, bearing: VIEW.bearing } : { pitch: 0, bearing: 0 }, { duration: 700 });
  };

  return (
    <div className="site3d" role="region" aria-label={`Vista 3D: ${label}`}>
      <div className="site3d-map" ref={containerRef} />

      {failed && (
        <div className="globe-loading" role="alert">
          Este aparelho não conseguiu abrir a vista 3D.
        </div>
      )}

      <header className="site3d-top">
        <button type="button" className="site3d-back" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar ao globo
        </button>
        <div className="site3d-title">
          <strong>{label}</strong>
          {subtitle && <small>{subtitle}</small>}
        </div>
        <button
          type="button"
          className="site3d-mode"
          onClick={toggle3D}
          aria-pressed={is3D}
          title={is3D ? 'Ver de cima, sem prédios' : 'Ver os prédios em 3D'}
        >
          {is3D ? <Square size={16} aria-hidden="true" /> : <Box size={16} aria-hidden="true" />}
          {is3D ? '2D' : '3D'}
        </button>
      </header>

      <aside className="globe-panel site3d-panel" aria-label="Fotos e Street View">
        <PlacePhotos coords={coords} title="Fotos do lugar" />
      </aside>
    </div>
  );
}
