import { CalendarDays, Check, ChevronLeft, ChevronRight, Plus, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Id } from '../../../../convex/_generated/dataModel'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Separator } from '@/shared/components/ui/separator'
import { useCreateHabit, useToggleHabitCompletion } from '../../habits/mutations/use-habit-mutations'
import { useCompletions } from '../../habits/queries/use-completions'
import { useHabits } from '../../habits/queries/use-habits'

function dateKey(date: Date) { return date.toISOString().slice(0, 10) }
function todayKey() { return dateKey(new Date()) }
function formatLongDate(date: Date) { return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date) }
function formatInputDate(date: Date) { return dateKey(date) }
function shiftDate(date: Date, amount: number) { const next = new Date(date); next.setDate(next.getDate() + amount); return next }

export function HomePage() {
    const [selectedDate, setSelectedDate] = useState(() => new Date())
    const [newHabit, setNewHabit] = useState('')
    const selectedKey = useMemo(() => dateKey(selectedDate), [selectedDate])
    const habitsQuery = useHabits()
    const completionsQuery = useCompletions(selectedKey)
    const createHabit = useCreateHabit()
    const toggleCompletion = useToggleHabitCompletion()
    const habits = habitsQuery.data ?? []
    const completions = new Set((completionsQuery.data ?? []).map((completion) => completion.habitId))
    const completedCount = habits.filter((habit) => completions.has(habit._id)).length
    const isToday = selectedKey === todayKey()

    function toggleHabit(habitId: Id<'habits'>) {
        toggleCompletion.mutate({ habitId, date: selectedKey })
    }

    function changeDate(value: string) {
        const next = new Date(`${value}T12:00:00`)
        if (!Number.isNaN(next.getTime())) setSelectedDate(next)
    }

    function addHabit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const name = newHabit.trim()
        if (!name) return
        createHabit.mutate({ name })
        setNewHabit('')
    }

    return (
        <main className="tracker-shell">
            <header className="tracker-header">
                <div className="brand-mark" aria-hidden="true"><Sparkles size={18} /></div>
                <div><p className="eyebrow">eliabits</p><h1>Mes habitudes</h1></div>
            </header>

            <section className="day-toolbar" aria-label="Sélecteur de jour">
                <Button variant="outline" size="icon" aria-label="Jour précédent" onClick={() => setSelectedDate((date) => shiftDate(date, -1))}><ChevronLeft /></Button>
                <label className="date-picker">
                    <CalendarDays size={17} aria-hidden="true" />
                    <span>{isToday ? 'Aujourd’hui' : formatLongDate(selectedDate)}</span>
                    <Input type="date" value={formatInputDate(selectedDate)} onChange={(event) => changeDate(event.target.value)} aria-label="Choisir un jour" />
                </label>
                <Button variant="outline" size="icon" aria-label="Jour suivant" onClick={() => setSelectedDate((date) => shiftDate(date, 1))}><ChevronRight /></Button>
            </section>

            <section className="day-summary" aria-label="Résumé du jour">
                <div><p className="eyebrow">{isToday ? 'Aujourd’hui' : formatLongDate(selectedDate)}</p><p className="summary-text">Un petit geste, répété souvent.</p></div>
                <p className="today-progress"><strong>{completedCount}</strong><span>/ {habits.length} réalisées</span></p>
            </section>

            <section className="habit-list" aria-label={`Habitudes du ${formatLongDate(selectedDate)}`}>
                <div className="habit-list-heading"><span>Habitude</span><span>Réalisée</span></div>
                {habitsQuery.isPending && <p className="habit-state">Chargement des habitudes…</p>}
                {habitsQuery.isError && <p className="habit-state">Impossible de charger tes habitudes. Vérifie que tu es connecté.</p>}
                {!habitsQuery.isPending && !habitsQuery.isError && habits.length === 0 && <p className="habit-state">Aucune habitude pour le moment. Ajoute-en une ci-dessous.</p>}
                {habits.map((habit) => {
                    const checked = completions.has(habit._id)
                    return <div className="habit-item" key={habit._id}><span>{habit.name}</span><Button variant={checked ? 'default' : 'outline'} size="icon" aria-label={`${habit.name} : ${checked ? 'réalisée' : 'non réalisée'}`} aria-pressed={checked} onClick={() => toggleHabit(habit._id)}>{checked && <Check />}</Button></div>
                })}
                <Separator />
                <form className="add-habit" onSubmit={addHabit}><Input value={newHabit} onChange={(event) => setNewHabit(event.target.value)} placeholder="Ajouter une habitude…" aria-label="Nom de la nouvelle habitude" /><Button type="submit" variant="ghost"><Plus /> Ajouter</Button></form>
            </section>

            <p className="tracker-hint">Choisis un jour pour consulter ou modifier tes habitudes.</p>
        </main>
    )
}
