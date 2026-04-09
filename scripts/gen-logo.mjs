import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svgPath = join(__dirname, '../public/logo.svg')
const outPath = join(__dirname, '../public/logo.png')

const svg = readFileSync(svgPath)

await sharp(svg)
  .resize(400, 472)   // 4x scale of 100x118 viewBox
  .png()
  .toFile(outPath)

console.log('✓ public/logo.png generated (400×472)')
