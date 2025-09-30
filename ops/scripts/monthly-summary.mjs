import fs from 'node:fs'
import path from 'node:path'
import dayjs from 'dayjs'

const csvPath = 'data/tracker.csv'
const monthArg = process.argv[process.argv.indexOf('--month')+1] || dayjs().format('YYYY-MM')

let produced = 0
try {
  const csv = fs.readFileSync(csvPath, 'utf-8').trim()
  const lines = csv.split(/\r?\n/).slice(1)
  for (const line of lines) {
    const [produced_at] = line.split(',')
    if (!produced_at) continue
    if (produced_at.startsWith(monthArg)) produced++
  }
} catch {}

console.log(`Monthly summary for ${monthArg}: produced=${produced}`)
