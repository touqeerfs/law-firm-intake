export const contactKeys = {
  all: ['contacts'] as const,
  list: () => [...contactKeys.all, 'list'] as const,
  activities: () => [...contactKeys.all, 'activities'] as const,
  detail: (id: string) => [...contactKeys.all, 'detail', id] as const,
};
