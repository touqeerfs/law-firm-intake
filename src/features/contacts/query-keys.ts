export const contactKeys = {
  all: ['contacts'] as const,
  list: () => [...contactKeys.all, 'list'] as const,
};
