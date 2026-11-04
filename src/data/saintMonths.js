import { saints } from './saints';

export const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

// Cor do vidro de cada mês na rosácea, como os vitrais das catedrais.
export const GLASS = ['#2F5DA8', '#B23A2E', '#D9A21B', '#3F8C5A', '#7A3E9E', '#C8402A', '#2F7F9E', '#B8860B', '#9E2F5D', '#4F6FB5', '#6B8E23', '#A0522D'];

export const saintsOf = (m) => saints.filter((s) => s.feast.startsWith(m));

/** Meses com todos os santos guardados (os vitrais acesos da rosácea). */
export const completeMonths = (collected) => MONTHS.filter((m) => saintsOf(m).every((s) => collected.includes(s.slug)));
