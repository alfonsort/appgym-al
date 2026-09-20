import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cycleStatus, defaultCycle, normalizeCycle } from '../src/data/cycle.js'
import { runningForWeek, alfonsoRoutine, hyroxBase } from '../src/data/alfonso.js'
import { routines, users, lilyRecommendations } from '../src/data/routines.js'
const cycle = { ...defaultCycle(new Date(2026, 8, 21)), start: '2026-09-21' }
test('weekly boundaries, inclusive remaining time and end without automatic reset', () => {
  assert.equal(cycleStatus(cycle, new Date(2026, 8, 20)).pending, true)
  assert.equal(cycleStatus(cycle, new Date(2026, 8, 27, 23, 59)).week, 1)
  assert.equal(cycleStatus(cycle, new Date(2026, 8, 28)).week, 2)
  assert.equal(cycleStatus(cycle, new Date(2026, 9, 5)).remaining, 2)
  assert.match(cycleStatus(cycle, new Date(2026, 9, 12)).message, /última semana/)
  assert.equal(cycleStatus(cycle, new Date(2026, 9, 19)).ended, true)
  assert.equal(cycleStatus(cycle, new Date(2028, 9, 19)).remaining, 0)
})
test('running switches after either 2 or 3 weeks and alternates A/B', () => {
  for (const initial of [2, 3]) {
    assert.match(runningForWeek(initial, initial).title, /inicial/)
    assert.equal(runningForWeek(initial + 1, initial).exercises[1].reps, '40–45 min')
    assert.equal(runningForWeek(initial + 2, initial).exercises[1].sets, '5')
    assert.match(runningForWeek(initial + 3, initial).title, /Semana A/)
  }
})
test('persisted cycle round trip and malformed data fallback', () => {
  const saved = { ...cycle, hyrox: { 1: 'Sesión diferente' }, completed: { '1-lunes': true } }
  assert.deepEqual(normalizeCycle(JSON.parse(JSON.stringify(saved))), saved)
  assert.equal(normalizeCycle({start:'2026-02-31'}).weeks, 4)
  assert.equal(normalizeCycle({...cycle, weeks: -5}).weeks, 4)
  assert.equal(defaultCycle(new Date(2026, 8, 20)).start, '2026-09-21')
})
test('Alfonso matches requested structure and key prescriptions', () => {
  assert.deepEqual(Object.keys(alfonsoRoutine), ['lunes','martes','miercoles','jueves','viernes'])
  assert.deepEqual(['lunes','miercoles','viernes'].map(day => alfonsoRoutine[day].exercises.length), [7,7,8])
  assert.equal(alfonsoRoutine.lunes.exercises[0].sets, '3')
  assert.equal(alfonsoRoutine.lunes.exercises[0].reps, '6–8')
  assert.equal(alfonsoRoutine.miercoles.exercises[0].reps, '8 por pierna')
  assert.equal(alfonsoRoutine.viernes.exercises[7].sets, '2–3')
  assert.deepEqual(hyroxBase.exercises.slice(1).map(e => e.reps), ['500 m','500 m','40 m','10','20 pasos','15'])
  assert.ok(hyroxBase.exercises.slice(1).every(e => e.sets === '4 rondas'))
})
test('Lily routines, recommendations and profile are identical to original public version', async () => {
  const original = execFileSync('git', ['show', 'db3ad2b:src/data/routines.js'], {encoding:'utf8'})
  const before = await import(`data:text/javascript;base64,${Buffer.from(original).toString('base64')}`)
  assert.deepEqual(routines.lily, before.routines.lily)
  assert.deepEqual(users.lily, before.users.lily)
  assert.deepEqual(lilyRecommendations, before.lilyRecommendations)
})
