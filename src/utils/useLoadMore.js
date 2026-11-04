import { useState } from 'react';

/**
 * Mostra uma lista longa aos poucos. Com busca ou filtro ativo (showAll),
 * todos os resultados aparecem de uma vez. "minVisible" garante que os primeiros N itens
 * já comecem à vista (ex.: um item aberto por um link, que precisa aparecer).
 *
 *   const { listed, remaining, showMore } = useLoadMore(items, 6, { showAll: isFiltering });
 */
export function useLoadMore(items, pageSize, { showAll = false, minVisible = 0 } = {}) {
  const [visible, setVisible] = useState(() => Math.max(pageSize, Math.ceil(minVisible / pageSize) * pageSize));
  const listed = showAll ? items : items.slice(0, visible);
  return {
    listed,
    remaining: items.length - listed.length,
    showMore: () => setVisible((v) => v + pageSize),
  };
}
