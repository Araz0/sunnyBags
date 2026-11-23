/**
 * Remove fabric/material claims (cotton, canvas, linen, Baumwolle …) from bag
 * descriptions while keeping colours, patterns and details. Denim/jeans are
 * kept — they're visibly what the upcycled bags are made of.
 */

const EN_MAT = String.raw`(?:wax-cotton|cotton-linen|linen-cotton|silk-blend|cotton|woolen|wool|linen|canvas|satin|silk|nylon|leather)`
// Words after a material that mean it was used as a noun → swap in "fabric"
const EN_NOUN_CONTEXT = String.raw`(?=\s+(?:with|on|featuring|and|in|below|above|across|along|at|to|from|under|over|accented|finished|forming|detailed|trimmed|highlighted|showcasing|for|that|separated|framing|frame|adorned|printed)\b|\s*[,.;)—–]|$)`

const en = (s: string) =>
  s
    .replace(/\bwax-cotton\b/gi, 'wax print')
    .replace(/\b(?:silk|cotton|wool|linen)-blend\s+/gi, '')
    .replace(new RegExp(String.raw`\b${EN_MAT}\s+(?:blend|fabric)\b`, 'gi'), 'fabric')
    // "Olive-linen shoulder bag" → "Olive shoulder bag"
    .replace(new RegExp(String.raw`(\w)-${EN_MAT}\s+`, 'gi'), '$1 ')
    // material as a prefix: "satin-teardrop", "cotton-webbing", "natural-canvas"
    .replace(/\b(natural)-canvas\b/gi, '$1')
    .replace(new RegExp(String.raw`\b${EN_MAT}-(?=\w)`, 'gi'), '')
    // "in red cotton with …" → "in red fabric with …"
    .replace(new RegExp(String.raw`\b${EN_MAT}${EN_NOUN_CONTEXT}`, 'gi'), 'fabric')
    // "cotton pouch" → "pouch"
    .replace(new RegExp(String.raw`\b${EN_MAT}\s+`, 'gi'), '')
    .replace(/\bfabric fabric\b/gi, 'fabric')
    .replace(/\bprint print\b/gi, 'print')

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
const L = String.raw`\p{L}`

const de = (s: string) =>
  s
    // whole phrases: "aus Baumwolle", "auf Baumwolle", "aus Seidenmischung"
    .replace(/\s+(?:aus|auf)\s+(?:Baumwolle|Wolle|Leinen|Canvas|Satin|Seidenmischung)(?=[\s,.;]|$)/gu, '')
    // blends: "aus weicher Leinen-Baumwoll-Mischung" → "aus weicher Stoffmischung"
    .replace(new RegExp(String.raw`[${L}-]*(?:Baumwoll|Woll)-?[Mm]ischung`, 'gu'), 'Stoffmischung')
    // feminine nouns with an adjective in front (dative): "bedruckter Baumwolle" → "bedrucktem Stoff"
    .replace(new RegExp(String.raw`(${L}+)er\s+(?:Web)?(?:Baumwolle|baumwolle|Wolle)\b`, 'gu'), '$1em Stoff')
    .replace(/\bWachsdruck-Baumwolle\b/gu, 'Wachsdruck')
    .replace(/\b(?:Web)?(?:Baumwolle|baumwolle|Wolle)\b/gu, 'Stoff')
    // compound nouns: Baumwolltasche → Tasche, Canvastasche → Tasche, Lederpaspeln → Paspeln
    .replace(new RegExp(String.raw`\b(?:Baumwoll|Canvas|Leinen|Leder|Satin|Seiden)-?([a-zäöüß]{2,})`, 'gu'), (_, rest: string) => cap(rest))
    .replace(new RegExp(String.raw`\b(?:Baumwoll|Canvas|Leinen|Leder|Satin)-([A-ZÄÖÜ]${L}+)`, 'gu'), '$1')
    // masculine/neuter Canvas/Leinen/Satin → Stoff (same adjective endings)
    .replace(/\b(?:Canvas|Leinen|Satin)\b/gu, 'Stoff')

const tidy = (s: string) =>
  s
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;])/g, '$1')
    .replace(/^\s*([a-zäöü])/, (m) => m.toUpperCase())
    .trim()

/** Hand-fixed results where the rules can't get the grammar right. */
const OVERRIDES: Record<string, string> = {
  'de:134': 'Dunkelbrauner Rand über einem Körper in tiefem Olivgrün und Schwarz mit geometrischem Blockdruck, als kleine offene Tasche',
  'de:136':
    'Schwarze gewebte Tasche, dicht bestickt mit leuchtend bunten Schlaufen in abstrakten geometrischen Mustern, mit kleinen Quastenknoten an den Ecken und einem dicken geflochtenen Riemen in Bordeaux, Olivgrün und Creme',
}

export const stripMaterials = (text: string, lang: 'en' | 'de', bagId?: number) =>
  (bagId != null && OVERRIDES[`${lang}:${bagId}`]) || tidy(lang === 'de' ? de(text) : en(text))
