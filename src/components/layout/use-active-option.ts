import { useEffect, useId, useState, type KeyboardEvent } from 'react';

export function useActiveOption(optionCount: number) {
  const listId = useId();
  const [selected, setSelected] = useState(0);

  const activeIndex = Math.min(selected, optionCount - 1);
  const optionId = (index: number) => `${listId}-option-${index}`;
  const activeId = optionId(activeIndex);

  useEffect(() => {
    document.getElementById(activeId)?.scrollIntoView({ block: 'nearest' });
  }, [activeId]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setSelected((activeIndex + step + optionCount) % optionCount);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      document.getElementById(activeId)?.click();
    }
  }

  const optionProps = (index: number) => ({
    id: optionId(index),
    selected: index === activeIndex,
    onHover: () => setSelected(index),
  });

  return {
    listId,
    activeId,
    optionProps,
    handleKeyDown,
    resetActiveOption: () => setSelected(0),
  };
}
