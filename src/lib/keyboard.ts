export const PAGE_SEARCH_ID = 'page-search';

export function isLayerOpen(): boolean {
  return document.querySelector('[role="dialog"], [role="alertdialog"], [role="menu"]') !== null;
}
