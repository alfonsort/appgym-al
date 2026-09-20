import { useState } from 'react'

export default function CyclePanel({ cycle, status, save, storageError }) {
  const [editing, setEditing] = useState(false)
  return <section className="premium-border rounded-lg p-4 sm:p-5" aria-label="Bloque de Alfonso">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="font-bold text-volt">{status.pending ? 'Bloque preparado' : status.ended ? 'Bloque completado' : `Semana ${status.week} de ${cycle.weeks}`} · Alfonso</p>
      <button className="small-button" onClick={() => setEditing(!editing)} aria-expanded={editing}>Ajustar bloque</button>
    </div>
    <p className="mt-2 text-lg font-bold" role="status">{status.message}</p>
    <progress className="mt-3 h-2 w-full accent-volt" value={status.pending ? 0 : Math.min(status.week, cycle.weeks)} max={cycle.weeks} aria-label="Semana del bloque" />
    {!status.ended && <p className="mt-2 text-sm leading-6 text-slate-300">{status.running}</p>}
    <p className="mt-2 text-xs leading-5 text-slate-400">Guardado en este navegador. Los avisos aparecen al abrir la app.</p>
    {storageError && <p role="alert" className="mt-2 text-sm text-gold">No se pudo guardar en este navegador. Los cambios solo durarán mientras la app esté abierta.</p>}
    {editing && <form className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3" onSubmit={event => {
      event.preventDefault()
      const data = new FormData(event.currentTarget)
      const start = data.get('start')
      save({ ...cycle, start, weeks: Number(data.get('weeks')), initialWeeks: Number(data.get('initialWeeks')), ...(start !== cycle.start ? { completed: {}, hyrox: {} } : {}) })
      setEditing(false)
    }}>
      <label className="field-label">Fecha de inicio<input name="start" type="date" required defaultValue={cycle.start} /></label>
      <label className="field-label">Duración del bloque<select name="weeks" defaultValue={cycle.weeks}>{[4, 6, 8, 12].map(n => <option key={n} value={n}>{n} semanas</option>)}</select></label>
      <label className="field-label">Running inicial<select name="initialWeeks" defaultValue={cycle.initialWeeks}><option value="2">2 semanas</option><option value="3">3 semanas</option></select></label>
      <p className="text-xs leading-5 text-slate-400 sm:col-span-3">Cada semana dura 7 días desde la fecha de inicio. Cambiar la fecha inicia otro bloque y limpia sus marcas y ajustes de jueves.</p>
      <button className="small-button" type="submit">Guardar bloque</button>
    </form>}
  </section>
}

export function HyroxEditor({ value, week, onSave }) {
  const [editing, setEditing] = useState(false)
  return <section className="premium-border rounded-lg p-4">
    <button className="small-button" onClick={() => setEditing(!editing)} aria-expanded={editing}>Ajustar jueves · semana {week}</button>
    <p className="mt-2 text-xs leading-5 text-slate-400">Solo cambia este jueves. Sin ajuste, se mantiene la base de 4 rondas.</p>
    {editing && <form className="mt-3 grid gap-3" onSubmit={event => {
      event.preventDefault(); onSave(new FormData(event.currentTarget).get('session').trim()); setEditing(false)
    }}>
      <label className="field-label">Sesión completa de este jueves<textarea name="session" rows="6" maxLength="4000" defaultValue={value || ''} placeholder="Escribe calentamiento, estaciones, rondas y descansos…" /></label>
      <p className="text-xs text-slate-400">Deja el texto vacío y guarda para recuperar la base.</p>
      <button className="small-button" type="submit">Guardar jueves</button>
    </form>}
  </section>
}
