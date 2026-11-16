import { normalizeText } from '@/lib/text';

type HighlightProps = {
  text: string;
  query: string;
};

export function Highlight({ text, query }: HighlightProps) {
  const search = normalizeText(query.trim());
  const start = search === '' ? -1 : normalizeText(text).indexOf(search);
  if (start === -1) return text;

  const end = start + search.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-2xs bg-lead/35 px-px text-inherit">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}
