export const STORAGE_KEY = 'appgym:alfonso:cycle:v1'
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function dayNumber(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return NaN
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toISOString().slice(0, 10) === value ? date.getTime() / 86400000 : NaN
}
export function defaultCycle(now = new Date()) {
  const monday = new Date(now)
  const day = now.getDay()
  monday.setDate(now.getDate() + (day === 0 ? 1 : day === 6 ? 2 : 1 - day))
  return { start: dateKey(monday), weeks: 4, initialWeeks: 3, hyrox: {}, completed: {} }
}
export function normalizeCycle(value, now = new Date()) {
  const fallback = defaultCycle(now)
  if (!value || !Number.isFinite(dayNumber(value.start))) return fallback
  return { start: value.start, weeks: [4, 6, 8, 12].includes(value.weeks) ? value.weeks : 4,
    initialWeeks: value.initialWeeks === 2 ? 2 : 3,
    hyrox: Object.fromEntries(Object.entries(value.hyrox || {}).filter(([k, v]) => /^\d+$/.test(k) && typeof v === 'string')),
    completed: Object.fromEntries(Object.entries(value.completed || {}).filter(([k, v]) => /^\d+-(lunes|martes|miercoles|jueves|viernes)$/.test(k) && v === true)),
  }
}
export function cycleStatus(cycle, now = new Date()) {
  const elapsed = dayNumber(dateKey(now)) - dayNumber(cycle.start)
  const week = Math.max(1, Math.floor(elapsed / 7) + 1)
  const remaining = Math.max(0, cycle.weeks - week + 1)
  const pending = elapsed < 0
  return { week, remaining, pending, ended: remaining === 0,
    message: pending ? `Tu bloque empieza el ${cycle.start.split('-').reverse().join('/')}` : remaining === 0 ? 'Bloque terminado: revisa tu rutina antes de iniciar otro.' : remaining === 1 ? 'Esta es tu última semana con esta rutina' : `Te quedan ${remaining} semanas con esta rutina (incluida esta)`,
    running: week <= cycle.initialWeeks ? (week === cycle.initialWeeks ? 'Última semana de running inicial. La próxima toca semana A: 40–45 min continuos.' : `Running inicial: quedan ${cycle.initialWeeks - week + 1} semanas, incluida esta. Después alternarás A/B.`) : `Running: semana ${(week - cycle.initialWeeks - 1) % 2 === 0 ? 'A · continua 40–45 min' : 'B · 5 × 3 min rápidos + 2 min suaves'}.`,
  }
}
