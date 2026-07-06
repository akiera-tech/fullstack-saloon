#!/usr/bin/env node
// akie-check.mjs - the Akie Code Standard, inherited with this project.
// Zero dependencies. Run: npm run akie:check
// Exits 1 if any Standard rule fails; also runs `tsc --noEmit` when a
// tsconfig and a local TypeScript install are present.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { execSync } from 'node:child_process'

const SRC = new Set(['.ts', '.tsx', '.js', '.jsx'])
const SKIP = new Set(['node_modules', '.next', '.git', 'dist', 'build'])
const SELF = new Set(['akie-check.mjs', 'QUALITY.md'])  // the gate, not the product
const files = []
;(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p)
    else if (st.size < 300000 && !SELF.has(name)) files.push(p)
  }
})('.')

const findings = []
let anyCount = 0
const anyFiles = []
let deadHref = 0
for (const f of files) {
  const ext = extname(f)
  let src
  try { src = readFileSync(f, 'utf8') } catch { continue }
  const isCode = SRC.has(ext)
  if (isCode && /^\s*(?:console\.(?:log|debug)\(|debugger\b)/m.test(src))
    findings.push(`console.log/debugger leftover: ${f}`)
  if (/lorem ipsum/i.test(src))
    findings.push(`lorem-ipsum placeholder: ${f}`)
  if (isCode && /\b(?:TODO|FIXME|HACK)\b/.test(src))
    findings.push(`TODO/FIXME/HACK left in shipped code: ${f}`)
  if (ext === '.ts' || ext === '.tsx') {
    const n = (src.match(/(?::\s*any\b|\bas any\b|<any>)/g) || []).length
    if (n) { anyCount += n; anyFiles.push(f) }
  }
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(src))
    findings.push(`<img> without alt: ${f}`)
  deadHref += (src.match(/href=["']#["']/g) || []).length
}
if (anyCount > 3)
  findings.push(`\`any\` typings: ${anyCount} occurrences (e.g. ${anyFiles[0]})`)
if (deadHref > 4)
  findings.push(`${deadHref} dead href="#" links`)

if (existsSync('tsconfig.json')) {
  try {
    execSync('npx --no-install tsc --noEmit', { stdio: 'pipe' })
    console.log('tsc: clean')
  } catch (e) {
    const out = String(e.stdout || '') + String(e.stderr || '')
    if (/could not determine|not found|ENOENT/i.test(out))
      console.log('tsc: skipped (run npm install first)')
    else {
      console.log('tsc: errors\n' + out.split('\n').slice(0, 12).join('\n'))
      findings.push('tsc --noEmit reported errors')
    }
  }
}

if (findings.length === 0) {
  console.log('Akie Code Standard: clean.')
  process.exit(0)
}
console.log(`Akie Code Standard: ${findings.length} finding(s)`)
for (const f of findings) console.log(' - ' + f)
process.exit(1)
