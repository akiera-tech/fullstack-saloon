
const fs = require('fs'), path = require('path')

function checkFile(filePath, rootDir) {
  let content
  try { content = fs.readFileSync(filePath, 'utf8') } catch(e) {
    return {ok: false, errors: ['Cannot read file: ' + e.message]}
  }

  const imports = [...content.matchAll(/from\s+['"]([.@\/][^'"]+)['"]/g)]
  const errors = []
  const resolved = []

  for (const [,imp] of imports) {
    if (!imp.startsWith('.') && !imp.startsWith('/')) continue  // skip bare modules

    const base = path.resolve(path.dirname(filePath), imp)
    const exts = ['.tsx','.ts','.jsx','.js','/index.tsx','/index.ts','/index.jsx','/index.js']
    const ok = exts.some(ext => {
      try { fs.accessSync(base + ext); return true } catch { return false }
    }) || (() => { try { fs.accessSync(base); return true } catch { return false } })()

    if (ok) {
      resolved.push(imp)
    } else {
      errors.push('Cannot resolve: ' + imp + ' (from ' + path.relative(rootDir, filePath) + ')')
    }
  }

  // Basic JSX syntax check: look for unclosed tags (heuristic)
  const openTags = (content.match(/<[A-Z][A-Za-z]+[^>]*[^\/]>/g) || []).length
  const closeTags = (content.match(/<\/[A-Z][A-Za-z]+>/g) || []).length
  // Note: this is a very rough heuristic, not a full parser

  return { ok: errors.length === 0, errors, resolved: resolved.length }
}

function checkDir(dir) {
  const allErrors = []
  function walk(d) {
    try {
      for (const entry of fs.readdirSync(d, {withFileTypes: true})) {
        const full = path.join(d, entry.name)
        if (entry.isDirectory()) {
          if (!['node_modules','.next','dist','.git'].includes(entry.name)) walk(full)
        } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
          const r = checkFile(full, dir)
          if (!r.ok) allErrors.push(...r.errors)
        }
      }
    } catch(e) {}
  }
  walk(dir)
  return { ok: allErrors.length === 0, errors: allErrors }
}

const target = process.argv[2]
const root = process.argv[3] || process.cwd()
const result = fs.statSync(target).isDirectory() ? checkDir(target) : checkFile(target, root)
console.log(JSON.stringify(result))
