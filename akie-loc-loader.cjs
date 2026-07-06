/**
 * akie-loc-loader — dev-only webpack loader that stamps every host JSX
 * element with data-akie-loc="<relPath>:<astStart>" so the visual editor
 * resolves DOM clicks to source deterministically (the bridge's fast path,
 * score 100) instead of heuristic scoring.
 *
 * Contract: the DISK source never carries anchors; only the webpack-served
 * dev runtime does. Offsets are computed on CRLF-normalized source — the
 * same normalization the editor's parser applies — and every recorded start
 * is the ORIGINAL offset: hits are spliced from the end backwards so earlier
 * positions stay valid.
 *
 * Components (capitalized names) are skipped: an unknown prop on a component
 * never reaches the DOM, so stamping it buys nothing.
 */
const { parse } = require('@babel/parser')

module.exports = function akieLocLoader(source) {
  const root = (this.rootContext || '').replace(/\\/g, '/')
  let rel = (this.resourcePath || '').replace(/\\/g, '/')
  if (root && rel.startsWith(root)) rel = rel.slice(root.length)
  rel = rel.replace(/^\//, '')

  let src = source.includes('\r\n') ? source.replace(/\r\n/g, '\n') : source
  let ast
  try {
    ast = parse(src, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
      errorRecovery: true,
    })
  } catch {
    return source
  }

  const hits = []
  const walk = (n) => {
    if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) { for (const c of n) walk(c); return }
    if (
      n.type === 'JSXOpeningElement' &&
      n.name && n.name.type === 'JSXIdentifier' &&
      /^[a-z]/.test(n.name.name) &&
      typeof n.start === 'number' && typeof n.name.end === 'number'
    ) {
      hits.push({ at: n.name.end, start: n.start })
    }
    for (const k of Object.keys(n)) {
      if (k === 'loc' || k === 'leadingComments' || k === 'trailingComments') continue
      const v = n[k]
      if (v && typeof v === 'object') walk(v)
    }
  }
  walk(ast.program)

  hits.sort((a, b) => b.at - a.at)
  for (const h of hits) {
    src = src.slice(0, h.at) + ' data-akie-loc="' + rel + ':' + h.start + '"' + src.slice(h.at)
  }
  return src
}
