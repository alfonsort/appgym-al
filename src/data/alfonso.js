const lift = (name, sets, reps, accessory = false) => ({
  name, sets, reps, rest: accessory ? '45–75 s' : '90–120 s',
  notes: 'Deja 1–2 repeticiones en reserva. Mantén buena técnica y evita el fallo.',
  referenceUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(name + ' técnica')}`,
})
const step = (name, reps, notes, sets = '1', rest = 'Continuo') => ({ name, sets, reps, rest, notes, referenceUrl: '' })
const strength = (title, exercises) => ({
  title, focus: 'Calentamiento de 5–8 min. Completa las series con control, dejando 1–2 repeticiones en reserva.',
  duration: 'Según descansos', intensity: 'Sin fallo habitual', exercises,
  finisher: { type: 'Pautas', title: 'Fuerza con control', details: 'Grandes: 90–120 s de descanso. Accesorios: 45–75 s. No hay cardio obligatorio al terminar.' },
})
export const runningInitial = {
  title: 'Running — Fase inicial', focus: 'Carrera cómoda durante las primeras 2–3 semanas.', duration: '48–58 min', intensity: 'Cómoda y controlada',
  exercises: [
    step('Calentamiento', '8 min', 'Caminata rápida + trote suave.'),
    step('Carrera continua cómoda', '30–35 min', 'Mantén un ritmo cómodo y sostenible.'),
    step('Aumenta un poco el ritmo', '5 min', 'Algo más rápido, pero controlado.'),
    step('Vuelta a la calma', '5–10 min', 'Trote o caminata + estiramiento.'),
  ],
  finisher: { type: 'Progresión', title: 'Después de 2–3 semanas', details: 'Alterna semana A: carrera continua de 40–45 min; semana B: 5 × 3 min rápidos + 2 min suaves.' },
}
export const hyroxBase = {
  title: 'HYROX — Base inicial', focus: '4 rondas en orden. Primeras semanas sin simulación completa.', duration: 'Según ritmo y descansos', intensity: '7–8/10',
  exercises: [step('Calentamiento', '8 min', 'Prepara el cuerpo antes del circuito.'),
    ...[['Running', '500 m'], ['SkiErg o remo', '500 m'], ['Farmer carry', '40 m'], ['Burpee broad jumps', '10'], ['Walking lunges', '20 pasos'], ['Wall balls', '15']].map(([name, reps]) => step(name, reps, 'Completa esta estación en cada una de las 4 rondas.', '4 rondas', 'Dentro del circuito'))],
  finisher: { type: 'Entre rondas', title: 'Descanso de 60–90 s si hace falta', details: 'Esfuerzo objetivo 7–8/10. Este jueves puede ajustarse por semana sin modificar los demás días.' },
}
export const alfonsoRoutine = {
  lunes: strength('Full Body — Fuerza base', [lift('Sentadilla o prensa', '3', '6–8'), lift('Press de banca', '3', '6–8'), lift('Remo con barra o máquina', '3', '8–10'), lift('Peso muerto rumano', '3', '8–10'), lift('Jalón al pecho', '3', '8–10'), lift('Elevaciones laterales', '2', '12–15', true), lift('Plancha', '3', '30–45 s', true)]),
  martes: runningInitial,
  miercoles: strength('Full Body — Equilibrado', [lift('Bulgarian split squat', '3', '8 por pierna'), lift('Press inclinado con mancuernas', '3', '8–10'), lift('Remo sentado en cable', '3', '8–12'), lift('Curl femoral', '3', '10–12', true), lift('Press militar con mancuernas', '3', '8–10'), lift('Face pull', '2', '12–15', true), lift('Elevaciones de rodillas o crunch en cable', '3', '10–15', true)]),
  jueves: hyroxBase,
  viernes: strength('Full Body — Moderado', [lift('Prensa o goblet squat', '2–3', '10'), lift('Press de pecho con mancuernas', '3', '8–10'), lift('Dominadas o jalón al pecho', '3', '8–10'), lift('Remo con pecho apoyado', '3', '8–10'), lift('Elevaciones laterales', '3', '12–15', true), lift('Curl de bíceps', '2', '10–12', true), lift('Tríceps en polea', '2', '10–12', true), lift('Core', '2–3', 'Según ejercicio', true)]),
}
export function runningForWeek(week, initialWeeks) {
  if (week <= initialWeeks) return runningInitial
  const continuous = (week - initialWeeks - 1) % 2 === 0
  return { ...runningInitial,
    title: continuous ? 'Running — Semana A · Continua' : 'Running — Semana B · Intervalos',
    focus: 'Alternancia semanal después de la fase inicial.', duration: continuous ? '53–63 min' : '38–43 min',
    exercises: [runningInitial.exercises[0], continuous
      ? step('Carrera continua cómoda', '40–45 min', 'Ritmo cómodo y sostenible.')
      : step('Intervalos', '3 min rápidos + 2 min suaves', 'Repite la secuencia 5 veces; ritmo rápido controlado.', '5'), runningInitial.exercises[3]],
  }
}
