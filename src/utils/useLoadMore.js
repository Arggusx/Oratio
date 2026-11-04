import { useState } from 'react';

/**
 * Mostra uma lista longa aos poucos. Com busca ou filtro ativo (showAll),
 * todos os resultados aparecem de uma vez.
 *
 *   const { listed, remaining, showMore } = useLoadMore(items, 6, { showAll: isFiltering });
 */
export function useLoadMore(items, pageSize, { showAll = false } = {}) {
  const [visible, setVisible] = useState(pageSize);
  const listed = showAll ? items : items.slice(0, visible);
  return {
    listed,
    remaining: items.length - listed.length,
    showMore: () => setVisible((v) => v + pageSize),
  };
}
