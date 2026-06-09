import {cp, mkdir, readdir, rm} from 'node:fs/promises'
import {join} from 'node:path'

const root = process.cwd()
const output = join(root, 'public')
const studioOutput = join(root, 'studio', 'dist')
const siteFiles = [
  'index.html',
  'cms.css',
  'cms.js',
  'Logo-radio-panama.png',
  'divino-alexandre.jpg',
  'manifest.json',
  'og-image.jpg',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
]

await rm(output, {recursive: true, force: true})
await mkdir(output, {recursive: true})

for (const file of siteFiles) {
  await cp(join(root, file), join(output, file))
}

await cp(studioOutput, join(output, 'admin'), {recursive: true})

console.log('Site build ready:', await readdir(output))
