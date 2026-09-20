import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  Repeat2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Trophy,
  UserRound,
  Zap,
} from 'lucide-react'
import { getTodayWorkoutId, lilyRecommendations, routines, users, weekdays } from './data/routines'

import { runningForWeek } from './data/alfonso'
import { STORAGE_KEY, defaultCycle, normalizeCycle, cycleStatus } from './data/cycle'
import CyclePanel, { HyroxEditor } from './CyclePanel'

const statIcons = {
  duration: Clock3,
  intensity: Zap,
  exercises: Dumbbell,
}

function App() {
  const [selectedUser, setSelectedUser] = useState('alfonso')
  const [selectedDay, setSelectedDay] = useState(getTodayWorkoutId)

  const [storageError, setStorageError] = useState(false)
  const [cycle, setCycle] = useState(() => {
    try { return normalizeCycle(JSON.parse(localStorage.getItem(STORAGE_KEY))) }
    catch { return defaultCycle() }
  })
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle)); setStorageError(false) }
    catch { setStorageError(true) }
  }, [cycle])
  const status = cycleStatus(cycle, now)
  const week = Math.min(status.week, cycle.weeks)
  const isAlfonso = selectedUser === 'alfonso'
  const profile = users[selectedUser]
  let workout = routines[selectedUser][selectedDay]
  if (isAlfonso && selectedDay === 'martes') workout = runningForWeek(week, cycle.initialWeeks)
  if (isAlfonso && selectedDay === 'jueves' && cycle.hyrox[week]) workout = {
    ...workout, title: `HYROX — Semana ${week}`, focus: 'Sesión ajustada para este jueves.',
    duration: 'Según sesión', intensity: 'Según sesión', exercises: [],
    finisher: { type: 'Sesión de la semana', title: 'Tu jueves', details: cycle.hyrox[week] },
  }
  const completedCount = weekdays.filter(day => cycle.completed[`${week}-${day.id}`]).length
  const completionKey = `${week}-${selectedDay}`
  const activeDay = weekdays.find((day) => day.id === selectedDay)

  const weeklyStats = useMemo(() => {
    const entries = Object.values(routines[selectedUser])
    const exerciseCount = entries.reduce((total, day) => total + day.exercises.length, 0)

    return {
      days: entries.length,
      exercises: exerciseCount,
      finishers: entries.length,
    }
  }, [selectedUser])

  return (
    <main className="min-h-screen overflow-hidden px-4 pb-10 pt-5 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 lg:gap-7">
        <Hero
          profile={profile}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          weeklyStats={weeklyStats}
        />

        {isAlfonso && <CyclePanel cycle={cycle} status={status} save={setCycle} storageError={storageError} />}
        <section className="grid gap-5">
          <div className="flex min-w-0 flex-col gap-5">
            <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            {isAlfonso && <>
              <p className="text-sm leading-6 text-slate-300">{[0, 6].includes(now.getDay()) ? 'Fin de semana: sin rutina obligatoria. Puedes consultar los días.' : `Hoy: ${weekdays.find(day => day.id === getTodayWorkoutId(now)).full}.`} · Pesas: lun, mié y vie · Running: mar · HYROX: jue</p>
              <p className="text-sm text-slate-300">Semana {week}: {completedCount}/5 sesiones completadas{status.ended ? ' · Última semana del bloque' : ''}</p>
              {selectedDay === 'jueves' && <HyroxEditor key={`${cycle.start}-${week}`} week={week} value={cycle.hyrox[week]} onSave={value => setCycle(previous => ({ ...previous, hyrox: { ...previous.hyrox, [week]: value } }))} />}
              <button className="small-button w-fit" disabled={status.pending || status.ended} aria-pressed={!!cycle.completed[completionKey]} onClick={() => setCycle(previous => ({ ...previous, completed: { ...previous.completed, [completionKey]: !previous.completed[completionKey] } }))}>
                {cycle.completed[completionKey] ? '✓ Sesión completada · desmarcar' : `Marcar ${activeDay.full.toLowerCase()} como completado`}
              </button>
            </>}
            <WorkoutCard workout={workout} day={activeDay} profile={profile} selectedUser={selectedUser} />
          </div>
        </section>
      </div>
    </main>
  )
}

function Hero({ profile, selectedUser, setSelectedUser, weeklyStats }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-coal/75 p-5 shadow-glow sm:p-7 lg:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(71,245,155,0.16),transparent_30%,rgba(79,140,255,0.14)_68%,transparent)]" />

      <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="min-w-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            <Sparkles size={15} className="text-volt" />
            AppGym A&L
          </div>
          <h1 className="text-balance text-2xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            Entrena fuerte. Ajusta inteligente.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Rutinas locales para Alfonso y Lily, con fuerza, cardio y modificaciones listas para usar desde el celular.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <HeroMetric icon={CalendarDays} label="Días" value={weeklyStats.days} />
            <HeroMetric icon={Dumbbell} label={selectedUser === 'alfonso' ? "Cardio" : "Ejercicios"} value={selectedUser === 'alfonso' ? 2 : weeklyStats.exercises} />
            <HeroMetric icon={Flame} label={selectedUser === 'alfonso' ? "Pesas" : "Finishers"} value={selectedUser === 'alfonso' ? 3 : weeklyStats.finishers} />
          </div>
        </div>

        <div className="premium-border rounded-lg p-3 shadow-card">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Perfil activo</p>
              <p className="mt-1 text-lg font-bold text-white">{profile.name}</p>
            </div>
            <div className={`rounded-lg bg-gradient-to-br ${profile.accent} p-3 text-coal`}>
              <UserRound size={24} strokeWidth={2.4} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {Object.values(users).map((user) => {
              const isActive = selectedUser === user.id
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUser(user.id)}
                  aria-pressed={isActive}
                  className={`rounded-lg border p-4 text-left transition ${
                    isActive
                      ? 'border-volt/60 bg-volt/15 text-white shadow-[0_12px_40px_rgba(71,245,155,0.12)]'
                      : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]'
                  }`}
                >
                  <span className="block text-base font-extrabold">{user.name}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">{user.tagline}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroMetric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3">
      <Icon size={18} className="mb-2 text-volt" />
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
    </div>
  )
}

function DaySelector({ selectedDay, setSelectedDay }) {
  return (
    <section className="premium-border rounded-lg p-3">
      <div className="grid grid-cols-5 gap-2">
        {weekdays.map((day) => {
          const isActive = selectedDay === day.id
          return (
            <button
              key={day.id}
              type="button"
              onClick={() => setSelectedDay(day.id)}
              className={`min-h-16 rounded-lg border px-2 py-3 text-center transition ${
                isActive
                  ? 'border-volt/70 bg-volt text-coal shadow-[0_16px_35px_rgba(71,245,155,0.2)]'
                  : 'border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.075]'
              }`}
              aria-pressed={isActive}
            >
              <span className="block text-sm font-black">{day.label}</span>
              <span className={`mt-1 block text-[10px] font-bold uppercase ${isActive ? 'text-coal/70' : 'text-slate-400'}`}>
                {new Date().getDay() > 0 && new Date().getDay() < 6 && day.id === getTodayWorkoutId() ? 'Hoy' : ''}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function WorkoutCard({ workout, day, profile, selectedUser }) {
  return (
    <section className="premium-border overflow-hidden rounded-lg shadow-card">
      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-volt">
              <CalendarDays size={16} />
              {day.full}
            </p>
            <h2 className="text-balance text-3xl font-black text-white sm:text-4xl">{workout.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">{workout.focus}</p>
          </div>
          <div className={`inline-flex w-fit items-center gap-2 rounded-lg bg-gradient-to-br ${profile.accent} px-4 py-3 text-sm font-black text-coal`}>
            <Trophy size={18} />
            {profile.name}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <WorkoutStat id="duration" label="Duración" value={workout.duration} />
          <WorkoutStat id="intensity" label="Intensidad" value={workout.intensity} />
          <WorkoutStat id="exercises" label={workout.exercises.length ? "Ejercicios" : "Formato"} value={workout.exercises.length || "Personalizado"} />
        </div>
      </div>

      {selectedUser === 'lily' && (
        <div className="mx-5 mt-5 rounded-lg border border-gold/25 bg-gold/10 p-4 text-sm leading-6 text-gold sm:mx-6">
          <div className="mb-1 flex items-center gap-2 font-extrabold text-gold">
            <ShieldCheck size={18} />
            Recomendaciones para Lily
          </div>
          <ul className="mt-2 grid gap-2 text-slate-200">
            {lilyRecommendations.map((recommendation) => (
              <li key={recommendation} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-3 p-5 sm:p-6">
        {workout.exercises.map((exercise, index) => (
          <ExerciseCard key={`${exercise.name}-${index}`} exercise={exercise} index={index} />
        ))}
      </div>

      <div className="border-t border-white/10 bg-white/[0.035] p-5 sm:p-6">
        <div className="flex items-start gap-4 rounded-lg border border-electric/25 bg-electric/10 p-4">
          <div className="rounded-lg bg-electric/20 p-3 text-electric">
            <HeartPulse size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-electric">{workout.finisher.type}</p>
            <h3 className="mt-1 text-xl font-black text-white">{workout.finisher.title}</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-300">{workout.finisher.details}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkoutStat({ id, label, value }) {
  const Icon = statIcons[id]

  return (
    <div className="rounded-lg border border-white/10 bg-coal/45 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">
        <Icon size={17} className="text-volt" />
        <span className="text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  )
}

function ExerciseCard({ exercise, index }) {
  return (
    <article className="rounded-lg border border-white/10 bg-coal/45 p-4 transition hover:border-white/20 hover:bg-white/[0.055]">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-volt/15 text-sm font-black text-volt">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h3 className="text-lg font-black leading-tight text-white">{exercise.name}</h3>
            {exercise.referenceUrl && (
              <a
                href={exercise.referenceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-volt/40 hover:text-volt"
              >
                Ver ejercicio
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <MiniStat icon={Repeat2} label="Series" value={exercise.sets} />
            <MiniStat icon={Activity} label="Reps" value={exercise.reps} />
            <MiniStat icon={TimerReset} label="Descanso" value={exercise.rest} />
          </div>

          <p className="mt-4 border-l-2 border-volt/50 pl-3 text-sm leading-6 text-slate-300">{exercise.notes}</p>
        </div>
      </div>
    </article>
  )
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="min-w-0 rounded-lg bg-white/[0.045] p-2 sm:p-3">
      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
        <Icon size={14} className="hidden shrink-0 sm:block" />
        <span className="text-[9px] font-black uppercase sm:text-[10px] sm:tracking-[0.12em]">{label}</span>
      </div>
      <p className="text-sm font-extrabold text-white">{value}</p>
    </div>
  )
}

export default App
