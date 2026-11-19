import { lazy, Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import Globe from 'globe.gl';
import { Box, Loader2, MapPin, Search, X } from 'lucide-react';
import { eucharisticMiracles } from '../../data/eucharisticMiracles';
import { useJourney } from '../../utils/journeyStore';
import { formatKm, nearestMiracles, normalize, searchMiracles, searchPlaces } from '../../utils/miracleSearch';
import MiracleCard from '../MiracleCard';
import PlacePhotos from './PlacePhotos';

// A vista 3D de rua (MapLibre) só é baixada quando alguém aproxima até o fim ou pede "Ver em 3D".
const MiracleSite3D = lazy(() => import('./MiracleSite3D'));

/* ============================================================
   Globo 3D dos milagres eucarísticos.
   Baseado no globo neon do projeto "Desafio de mapas"
   (github.com/ErnandesSemH/Desafio-de-mapas): mesmo pintor de
   texturas e mesmo jeito de afinar as bordas no zoom, com as cores
   trocadas do azul para o dourado do Oratio.
   Ao aproximar até o fim (ou pelo botão "Ver em 3D"), abre a vista
   de rua com os prédios em blocos (MiracleSite3D). Sombras e busca
   por CEP do projeto original não entram.
   ============================================================ */

const TEXTURE_DIR = '/globo/';
const FIRST_TEXTURE = `${TEXTURE_DIR}globo-2048x1024-n0.webp`; // leve (200 KB): aparece primeiro

// Bordas que afinam com o zoom: cada nível vale a partir da altitude "alt" (menor = mais perto).
const LEVELS = [
  { alt: Infinity, file: 'globo-4096x2048-n0.webp' },
  { alt: 1.55, file: 'globo-4096x2048-n1.webp' },
  { alt: 1.15, file: 'globo-4096x2048-n2.webp' },
  { alt: 0.8, file: 'globo-4096x2048-n3.webp' },
  { alt: 0.58, file: 'globo-4096x2048-n4.webp' },
];
const levelFor = (alt) => LEVELS.reduce((n, l, i) => (alt < l.alt ? i : n), 0);

const COLORS = {
  ocean: '#0d0904',
  brightness: '#b4b4b4', // o mesmo BRILHO_GLOBO do projeto original
  neon: '#e0a93f',
  gold: '255,210,122', // anel do milagre escolhido
  place: '255,250,240', // anel do lugar buscado (branco quente, para não confundir com um milagre)
};

const MAX_DPR = 1.5; // telas 2x/3x desenhariam 4 a 9 vezes mais pixels
const RESUME_ROTATION_MS = 7000;
const PLACE_WAIT_MS = 450; // espera depois da última tecla antes de procurar lugares
const FLIGHT_MS = 1400; // duração do voo da câmera até um milagre ou lugar
const MIN_ALTITUDE = 0.4; // o zoom máximo do globo (minDistance 140)
const HINT_3D_ALTITUDE = 0.75; // abaixo disto aparece o botão "Ver em 3D aqui"
const WHEEL_TICKS_TO_3D = 3; // na altitude mínima, mais estes giros da roda abrem a vista 3D

/** Lê uma textura pronta e a envia à GPU sem travar (mesma técnica do projeto original). */
async function loadTexture(url, model, renderer) {
  const blob = await fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Textura ${url}: ${r.status}`);
    return r.blob();
  });
  let image;
  if (typeof createImageBitmap === 'function') {
    image = await createImageBitmap(blob, { imageOrientation: 'flipY' });
  } else {
    image = new Image();
    image.src = URL.createObjectURL(blob);
    await image.decode();
  }
  const texture = new model.constructor(image);
  texture.colorSpace = model.colorSpace;
  texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  texture.needsUpdate = true;
  // ImageBitmap já vem invertido; o WebGL ignora flipY para ele.
  if (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap) texture.flipY = false;
  renderer.initTexture(texture);
  return texture;
}

/** O alfinete de um milagre no globo (um botão de verdade: dá para clicar e focar). */
function createMarker(m, onPick) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'globe-marker';
  el.setAttribute('aria-label', `${m.name}, ${m.place}, ${m.country}`);
  el.title = `${m.place} · ${m.yearLabel}`;
  el.innerHTML = '<span class="globe-marker-dot"></span>';
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    onPick(m);
  });
  // Arrastar o globo começando em cima do alfinete continua girando o globo.
  el.addEventListener('pointerdown', (e) => e.stopPropagation(), { passive: true });
  return el;
}

export default function MiracleGlobe({ onClose, initialId = null }) {
  const { miracles: visited } = useJourney();
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const markersRef = useRef(new Map()); // id do milagre -> elemento do alfinete
  const inputRef = useRef(null);
  const resumeTimer = useRef(null);
  const updateLevelRef = useRef(() => {}); // troca o nível das bordas (definida na criação do globo)

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState(initialId);
  const selectedIdRef = useRef(initialId);
  selectedIdRef.current = selectedId;
  const [place, setPlace] = useState(null); // { label, coords } escolhido na busca
  const [site3d, setSite3d] = useState(null); // { coords, label, subtitle } aberto na vista 3D
  const [closeEnough, setCloseEnough] = useState(false); // câmera perto o bastante para oferecer o 3D

  const [query, setQuery] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [places, setPlaces] = useState([]);
  const [placeStatus, setPlaceStatus] = useState('idle'); // idle | loading | error
  const chosenText = useRef(''); // texto posto no campo ao escolher um resultado (não é uma busca nova)

  const listId = useId();
  const selected = eucharisticMiracles.find((m) => m.id === selectedId) ?? null;

  /* ---------- Câmera ---------- */

  const pauseRotation = useCallback((resumeLater = true) => {
    const world = worldRef.current;
    if (!world) return;
    world.controls().autoRotate = false;
    clearTimeout(resumeTimer.current);
    if (resumeLater) {
      resumeTimer.current = setTimeout(() => {
        if (worldRef.current) worldRef.current.controls().autoRotate = true;
      }, RESUME_ROTATION_MS);
    }
  }, []);

  const flyTo = useCallback(
    ([lat, lng], altitude) => {
      const world = worldRef.current;
      if (!world) return;
      pauseRotation(false);
      const current = world.pointOfView().altitude;
      world.pointOfView({ lat, lng, altitude: altitude ?? Math.min(current, 1.4) }, FLIGHT_MS);
      // O voo não passa pelos controles, então o onZoom não avisa: confere o nível ao chegar.
      setTimeout(() => {
        updateLevelRef.current();
        if (worldRef.current) setCloseEnough(worldRef.current.pointOfView().altitude < HINT_3D_ALTITUDE);
      }, FLIGHT_MS + 50);
    },
    [pauseRotation]
  );

  const pickMiracle = useCallback(
    (m) => {
      setSelectedId(m.id);
      flyTo(m.coords);
    },
    [flyTo]
  );

  /* ---------- Vista 3D ---------- */

  const open3D = useCallback((target) => {
    worldRef.current?.pauseAnimation(); // o globo fica parado por baixo (economiza GPU)
    setSite3d(target);
  }, []);

  const close3D = useCallback(() => {
    setSite3d(null);
    worldRef.current?.resumeAnimation();
  }, []);

  const miracle3D = (m) => ({ id: m.id, coords: m.coords, label: m.place, subtitle: m.name });

  /**
   * O que abrir no 3D a partir do zoom no globo: o milagre aberto no painel; senão o milagre mais
   * perto do centro da câmera. (O centro em si costuma cair no mar ou no campo, onde não há prédios.)
   */
  const open3DAtCenter = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    const { lat, lng } = world.pointOfView();
    const m =
      eucharisticMiracles.find((x) => x.id === selectedIdRef.current) ??
      nearestMiracles(eucharisticMiracles, [lat, lng], 1)[0].miracle;
    setSelectedId(m.id);
    open3D(miracle3D(m));
  }, [open3D]);
  const open3DAtCenterRef = useRef(open3DAtCenter);
  open3DAtCenterRef.current = open3DAtCenter;

  // Os alfinetes são criados uma vez só; usam a versão mais nova de pickMiracle por esta referência.
  const pickRef = useRef(pickMiracle);
  pickRef.current = pickMiracle;

  /* ---------- Criação do globo ---------- */

  useEffect(() => {
    const stage = stageRef.current;
    let disposed = false;
    const textures = new Map(); // nível -> Promise<textura>
    let wantedLevel = -1;
    let firstTexture = null; // a textura leve do começo (sai da memória na primeira troca)
    let world;

    try {
      world = new Globe(stage, { animateIn: true })
        .width(stage.clientWidth)
        .height(stage.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor(COLORS.neon)
        .atmosphereAltitude(0.26)
        .showGraticules(false)
        .globeImageUrl(FIRST_TEXTURE);
    } catch (err) {
      console.warn('[globo] WebGL indisponível.', err);
      setFailed(true);
      return undefined;
    }
    worldRef.current = world;

    const renderer = world.renderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
    world.postProcessingComposer?.()?.setPixelRatio?.(Math.min(window.devicePixelRatio || 1, MAX_DPR));

    const mat = world.globeMaterial();
    mat.color.set(COLORS.ocean); // enquanto a textura não chega
    mat.shininess = 6;

    // Controles: arrastar gira, roda/pinça só aproxima, giro lento que pausa ao mexer.
    const controls = world.controls();
    controls.autoRotate = !initialId;
    controls.autoRotateSpeed = 0.4;
    controls.enablePan = false;
    controls.minDistance = 140; // altitude 0.4
    controls.maxDistance = 600;
    controls.addEventListener('start', () => pauseRotation(true));

    const narrow = stage.clientWidth < 640;
    const start = eucharisticMiracles.find((m) => m.id === initialId);
    world.pointOfView(
      start
        ? { lat: start.coords[0], lng: start.coords[1], altitude: 1.4 }
        : { lat: 30, lng: 5, altitude: narrow ? 3 : 2.3 }
    );

    /* Troca de nível das bordas conforme o zoom (só troca depois que a imagem nova está pronta: não pisca). */
    const updateLevel = () => {
      const n = levelFor(world.pointOfView().altitude);
      if (n === wantedLevel || !mat.map) return;
      wantedLevel = n;
      if (!textures.has(n)) {
        textures.set(n, loadTexture(TEXTURE_DIR + LEVELS[n].file, mat.map, renderer));
      }
      textures
        .get(n)
        .then((tex) => {
          if (disposed || wantedLevel !== n) return;
          mat.map = tex;
          mat.needsUpdate = true;
          if (firstTexture) {
            firstTexture.dispose();
            firstTexture = null;
          }
          // Guarda só o nível atual e os vizinhos (cada textura 4096 ocupa ~85 MB na placa de vídeo).
          for (const [i, p] of textures) {
            if (Math.abs(i - n) > 1) {
              textures.delete(i);
              p.then((t) => t.dispose()).catch(() => {});
            }
          }
        })
        .catch((err) => {
          textures.delete(n);
          wantedLevel = -1;
          console.warn('[globo] Não consegui carregar o nível', n, err);
        });
    };

    world.onGlobeReady(() => {
      if (disposed) return;
      // Com a textura no lugar, o globe.gl zera a cor; uma cor cinza clara escurece um pouco a imagem.
      mat.color = new mat.emissive.constructor(COLORS.brightness);
      firstTexture = mat.map;
      setReady(true);
      updateLevel(); // troca a textura leve pela de 4096 do nível atual
    });
    world.onZoom((pov) => {
      updateLevel();
      setCloseEnough(pov.altitude < HINT_3D_ALTITUDE);
    });

    // Na altitude mínima, continuar girando a roda para "dentro" entra na vista 3D.
    let wheelTicks = 0;
    const onWheel = (e) => {
      if (e.deltaY >= 0 || world.pointOfView().altitude > MIN_ALTITUDE + 0.02) {
        wheelTicks = 0;
        return;
      }
      wheelTicks += 1;
      if (wheelTicks >= WHEEL_TICKS_TO_3D) {
        wheelTicks = 0;
        open3DAtCenterRef.current();
      }
    };
    stage.addEventListener('wheel', onWheel, { passive: true });
    updateLevelRef.current = () => !disposed && updateLevel();

    /* Alfinetes dos milagres */
    const markers = markersRef.current;
    markers.clear();
    world
      .htmlElementsData(eucharisticMiracles)
      .htmlLat((m) => m.coords[0])
      .htmlLng((m) => m.coords[1])
      .htmlAltitude(0.012)
      .htmlTransitionDuration(0)
      .htmlElement((m) => {
        const el = createMarker(m, (picked) => pickRef.current(picked));
        markers.set(m.id, el);
        return el;
      })
      // Alfinete atrás do globo: some e sai da ordem do Tab.
      .htmlElementVisibilityModifier((el, visible) => {
        el.classList.toggle('is-behind', !visible);
        el.tabIndex = visible ? 0 : -1;
      });

    world
      .ringColor((d) => (t) => `rgba(${d.rgb},${1 - t})`)
      .ringMaxRadius((d) => d.max)
      .ringPropagationSpeed(2)
      .ringRepeatPeriod(1400)
      .pointColor((d) => d.color)
      .pointAltitude(0.01)
      .pointRadius(0.25);

    /* Tamanho acompanha a janela */
    const resize = new ResizeObserver(() => {
      if (!disposed) world.width(stage.clientWidth).height(stage.clientHeight);
    });
    resize.observe(stage);

    // Aba escondida: o globo para de desenhar (economiza bateria).
    const onVisibility = () => (document.hidden ? world.pauseAnimation() : world.resumeAnimation());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      disposed = true;
      clearTimeout(resumeTimer.current);
      resize.disconnect();
      stage.removeEventListener('wheel', onWheel);
      document.removeEventListener('visibilitychange', onVisibility);
      for (const p of textures.values()) p.then((t) => t.dispose()).catch(() => {});
      try {
        world._destructor();
        renderer.dispose();
        renderer.forceContextLoss(); // libera o contexto WebGL (o navegador limita quantos podem existir)
      } catch {
        /* nada a fazer */
      }
      stage.replaceChildren();
      worldRef.current = null;
    };
    // O globo é criado uma vez por abertura; initialId só vale para a câmera inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Estado dos alfinetes e anéis ---------- */

  useEffect(() => {
    for (const [id, el] of markersRef.current) {
      el.classList.toggle('is-visited', visited.includes(id));
      el.classList.toggle('is-selected', id === selectedId);
      el.setAttribute('aria-pressed', String(id === selectedId));
    }
  }, [visited, selectedId, ready]);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;
    const rings = [];
    if (selected) rings.push({ lat: selected.coords[0], lng: selected.coords[1], rgb: COLORS.gold, max: 3 });
    if (place) rings.push({ lat: place.coords[0], lng: place.coords[1], rgb: COLORS.place, max: 4 });
    world.ringsData(rings);
    world.pointsData(place ? [{ lat: place.coords[0], lng: place.coords[1], color: '#fffaf0' }] : []);
  }, [selected, place, ready]);

  /* ---------- Busca ---------- */

  const miracleResults = useMemo(() => searchMiracles(eucharisticMiracles, query), [query]);

  // Lugares: só depois de uma pausa na digitação, cancelando a consulta anterior.
  useEffect(() => {
    const q = normalize(query);
    if (q.length < 3 || query === chosenText.current) {
      setPlaces([]);
      setPlaceStatus('idle');
      return undefined;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setPlaceStatus('loading');
      searchPlaces(query, controller.signal)
        .then((found) => {
          setPlaces(found);
          setPlaceStatus('idle');
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.warn('[globo] Busca de lugares falhou.', err);
          setPlaces([]);
          setPlaceStatus('error');
        });
    }, PLACE_WAIT_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const options = useMemo(
    () => [
      ...miracleResults.map((m) => ({ type: 'miracle', key: `m-${m.id}`, miracle: m })),
      ...places.map((p) => ({ type: 'place', key: `p-${p.id}`, place: p })),
    ],
    [miracleResults, places]
  );

  useEffect(() => setActive(-1), [query]);

  const choose = (option) => {
    if (!option) return;
    setListOpen(false);
    if (option.type === 'miracle') {
      setPlace(null);
      chosenText.current = option.miracle.name;
      setQuery(option.miracle.name);
      pickMiracle(option.miracle);
    } else {
      setSelectedId(null);
      setPlace(option.place);
      chosenText.current = option.place.label;
      setQuery(option.place.label);
      flyTo(option.place.coords, 1.6);
    }
  };

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setListOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(options[active] ?? options[0]);
    }
  };

  /* ---------- Teclado e rolagem da página ---------- */

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Esc fecha uma coisa de cada vez: a lista, depois o painel, depois o globo.
  const closeStep = useRef(null);
  closeStep.current = () => {
    if (site3d) close3D();
    else if (listOpen && query) setListOpen(false);
    else if (selectedId || place) {
      setSelectedId(null);
      setPlace(null);
      pauseRotation(true);
    } else onClose();
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeStep.current();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const nearby = useMemo(() => (place ? nearestMiracles(eucharisticMiracles, place.coords) : []), [place]);
  const showList = listOpen && normalize(query).length > 0 && query !== chosenText.current;
  const activeKey = options[active]?.key;

  /* ---------- Tela ---------- */

  return (
    <div className={`globe-overlay ${site3d ? 'is-3d' : ''}`} role="dialog" aria-modal="true" aria-label="Globo dos milagres eucarísticos">
      <div className="globe-stage" ref={stageRef} />

      {!ready && !failed && (
        <div className="globe-loading" role="status">
          <Loader2 size={28} className="globe-spin" aria-hidden="true" />
          Preparando o globo…
        </div>
      )}
      {failed && (
        <div className="globe-loading" role="alert">
          Este aparelho não conseguiu abrir o globo 3D. Os milagres continuam na lista da página.
        </div>
      )}

      <header className="globe-top">
        <div className="globe-search" role="search">
          <Search size={16} aria-hidden="true" className="globe-search-icon" />
          <input
            ref={inputRef}
            type="search"
            className="globe-search-input"
            placeholder="Buscar milagre, cidade ou país"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setListOpen(true);
            }}
            onFocus={() => setListOpen(true)}
            onKeyDown={onInputKeyDown}
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeKey ? `${listId}-${activeKey}` : undefined}
            aria-label="Buscar milagre ou lugar no globo"
            autoComplete="off"
            enterKeyHint="search"
          />
          {query && (
            <button
              type="button"
              className="globe-search-clear"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Limpar a busca"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}

          {showList && (
            <ul className="globe-results" id={listId} role="listbox" aria-label="Resultados">
              {miracleResults.length > 0 && (
                <li role="presentation" className="globe-results-group">
                  Milagres
                </li>
              )}
              {options.map((o, i) => {
                const first = o.type === 'place' && (i === 0 || options[i - 1].type !== 'place');
                return [
                  first && (
                    <li key="places-title" role="presentation" className="globe-results-group">
                      Lugares
                    </li>
                  ),
                  <li
                    key={o.key}
                    id={`${listId}-${o.key}`}
                    role="option"
                    aria-selected={i === active}
                    className={`globe-result ${i === active ? 'is-active' : ''}`}
                    onPointerDown={(e) => e.preventDefault()} // não tira o foco do campo
                    onClick={() => choose(o)}
                  >
                    {o.type === 'miracle' ? (
                      <>
                        <span className="globe-result-dot" aria-hidden="true" />
                        <span>
                          <strong>{o.miracle.name}</strong>
                          <small>
                            {o.miracle.place} · {o.miracle.country} · {o.miracle.yearLabel}
                          </small>
                        </span>
                      </>
                    ) : (
                      <>
                        <MapPin size={14} aria-hidden="true" />
                        <span>
                          <strong>{o.place.label}</strong>
                          <small>Ver os milagres mais perto</small>
                        </span>
                      </>
                    )}
                  </li>,
                ];
              })}
              {placeStatus === 'loading' && (
                <li role="presentation" className="globe-results-note">
                  Procurando lugares…
                </li>
              )}
              {placeStatus === 'error' && (
                <li role="presentation" className="globe-results-note">
                  A busca de lugares não respondeu agora. Os milagres continuam aparecendo.
                </li>
              )}
              {options.length === 0 && placeStatus === 'idle' && (
                <li role="presentation" className="globe-results-note">
                  {normalize(query).length < 3 ? 'Nenhum milagre com esse nome.' : 'Nada encontrado.'}
                </li>
              )}
            </ul>
          )}
        </div>

        <button type="button" className="globe-close" onClick={onClose} aria-label="Fechar o globo">
          <X size={20} aria-hidden="true" />
        </button>
      </header>

      {(selected || place) && (
        <aside className="globe-panel" aria-label={selected ? selected.name : `Milagres perto de ${place.label}`}>
          <button
            type="button"
            className="globe-panel-close"
            onClick={() => {
              setSelectedId(null);
              setPlace(null);
              pauseRotation(true);
            }}
            aria-label="Fechar o painel"
          >
            <X size={16} aria-hidden="true" />
          </button>

          {selected ? (
            <>
              {place && (
                <button type="button" className="globe-panel-back" onClick={() => setSelectedId(null)}>
                  ← Perto de {place.label.split(',')[0]}
                </button>
              )}
              <MiracleCard key={selected.id} miracle={selected} visited={visited} anchor={false} />
              <button
                type="button"
                className="globe-3d-button"
                onClick={() => open3D(miracle3D(selected))}
              >
                <Box size={16} aria-hidden="true" />
                Ver o lugar em 3D
              </button>
              <PlacePhotos key={`fotos-${selected.id}`} coords={selected.coords} />
            </>
          ) : (
            <>
              <p className="globe-panel-eyebrow">Milagres mais perto de</p>
              <h3 className="globe-panel-title">{place.label}</h3>
              <ol className="globe-nearby">
                {nearby.map(({ miracle: m, km }) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => pickMiracle(m)}>
                      <span>
                        <strong>{m.name}</strong>
                        <small>
                          {m.place} · {m.country}
                        </small>
                      </span>
                      <span className="globe-nearby-km">{formatKm(km)}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <button
                type="button"
                className="globe-3d-button"
                onClick={() => open3D({ coords: place.coords, label: place.label.split(',')[0], subtitle: place.label })}
              >
                <Box size={16} aria-hidden="true" />
                Ver este lugar em 3D
              </button>
            </>
          )}
        </aside>
      )}

      {closeEnough && !site3d && (
        <button type="button" className="globe-3d-chip" onClick={open3DAtCenter}>
          <Box size={16} aria-hidden="true" />
          Ver em 3D aqui
          <small>ou continue aproximando</small>
        </button>
      )}

      {site3d && (
        <Suspense
          fallback={
            <div className="site3d">
              <div className="globe-loading" role="status">
                <Loader2 size={28} className="globe-spin" aria-hidden="true" />
                Preparando a vista 3D…
              </div>
            </div>
          }
        >
          <MiracleSite3D
            coords={site3d.coords}
            label={site3d.label}
            subtitle={site3d.subtitle}
            zoom={site3d.zoom}
            miracles={eucharisticMiracles}
            currentId={site3d.id ?? null}
            onPickMiracle={(m) => {
              setSelectedId(m.id);
              setPlace(null);
              setSite3d(miracle3D(m));
            }}
            onBack={close3D}
          />
        </Suspense>
      )}

      <p className="globe-credit">
        Globo: projeto <a href="https://github.com/ErnandesSemH/Desafio-de-mapas" target="_blank" rel="noopener noreferrer">Desafio de mapas</a>
        {' · '}Mapa: Natural Earth · Busca de lugares: Photon, ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
        {' · '}Fotos: Wikimedia Commons
      </p>
    </div>
  );
}
