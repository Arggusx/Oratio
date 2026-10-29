// Recompensas por concluir algo (nunca pela quantidade de oração):
// - cada ilha das trilhas dá um carimbo no Passaporte do Peregrino e uma moldura para o medalhão da Jornada;
// - cada mês de santos guardados acende uma parte da rosácea (ver components/journey/SaintCollection.jsx).

export const islandRewards = {
  'missa-7-dias': {
    stamp: { title: 'Peregrino da Missa', motto: 'Ide em paz', icon: 'calice' },
    frame: { id: 'missa', name: 'Moldura do Altar', color: '#C8963E', accent: '#F2D58A', motif: 'cruzes' },
  },
  'dogmas-de-maria': {
    stamp: { title: 'Filho de Maria', motto: 'Cheia de graça', icon: 'lua' },
    frame: { id: 'maria', name: 'Coroa de Doze Estrelas', color: '#4F7BB5', accent: '#F7E3A6', motif: 'estrelas' },
  },
  'sete-sacramentos': {
    stamp: { title: 'Vida em graça', motto: 'Sete sinais de Cristo', icon: 'hostia' },
    frame: { id: 'sacramentos', name: 'Moldura dos Sete Sinais', color: '#5E8C63', accent: '#CDE4C2', motif: 'sete' },
  },
  biblia: {
    stamp: { title: 'Ouvinte da Palavra', motto: 'Lâmpada para os meus pés', icon: 'biblia' },
    frame: { id: 'biblia', name: 'Moldura da Palavra', color: '#8C6A3F', accent: '#E8D3AE', motif: 'alfa' },
  },
  santos: {
    stamp: { title: 'Amigo dos santos', motto: 'Rogai por nós', icon: 'lirio' },
    frame: { id: 'santos', name: 'Auréola dos Santos', color: '#7A5A9E', accent: '#F2D58A', motif: 'raios' },
  },
  simbolos: {
    stamp: { title: 'Leitor de sinais', motto: 'Ichthys', icon: 'pomba' },
    frame: { id: 'simbolos', name: 'Moldura do Peixe', color: '#3F8C8A', accent: '#BFE3DF', motif: 'peixes' },
  },
};

// Moldura de quem ainda não concluiu nenhuma ilha.
export const DEFAULT_FRAME = { id: 'simples', name: 'Moldura simples', color: '#B9A47E', accent: '#EFE6D2', motif: 'nenhum' };

export const allFrames = [DEFAULT_FRAME, ...Object.values(islandRewards).map((r) => r.frame)];
