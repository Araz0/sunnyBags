/**
 * Size diagrams in src/assets/dimensions:
 *   category-<cat>.svg            → every bag in that category
 *   category-<cat>-bag-<id>.svg   → one specific bag (wins over the category file)
 * Drop a new file in the folder and it is picked up automatically.
 */
const files = import.meta.glob('../assets/dimensions/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byKey: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const m = path.match(/category-(\d+)(?:-bag-(\d+))?\.svg$/)
  if (m) byKey[m[2] ? `bag-${m[2]}` : `cat-${m[1]}`] = url
}

export const dimensionImage = (bag: { id: number; category_id: number }): string | undefined =>
  byKey[`bag-${bag.id}`] ?? byKey[`cat-${bag.category_id}`]

/** Background colour baked into the diagrams, used to pad them on post canvases. */
export const DIMENSION_BG = '#eeeeee'
