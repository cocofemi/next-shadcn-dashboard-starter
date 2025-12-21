export function createSlug(text: string) {
  if (!text) return '';

  let slug = decodeURIComponent(text);

  return slug
    .toLowerCase()
    .normalize('NFKD') // removes accents (e.g. é → e)
    .replace(/[\u0300-\u036f]/g, '') // strips diacritic marks
    .replace(/[^a-z0-9\s-]/g, '') // remove anything not letter/number/space/hyphen
    .trim() // remove surrounding spaces
    .replace(/\s+/g, '-') // spaces → hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}
