import { CalendarDays, Check, ChevronLeft, ChevronRight, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import type { Id } from '../../../../convex/_generated/dataModel'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card } from '@/shared/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Separator } from '@/shared/components/ui/separator'
import { Spinner } from '@/shared/components/ui/spinner'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip'
import { CategoryManagerSkeleton, HomeHabitListSkeleton } from './home-loading-skeletons'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useCategories } from '../../habits/queries/use-categories'
import { useCreateCategory, useCreateHabit, useDeleteCategory, useRenameCategory, useSetHabitCategory, useToggleHabitCompletion } from '../../habits/mutations/use-habit-mutations'
import { useCompletions } from '../../habits/queries/use-completions'
import { useHabits } from '../../habits/queries/use-habits'
import { CategoryDialog } from './category-dialog'

function dateKey(date: Date) { return date.toISOString().slice(0, 10) }
function todayKey() { return dateKey(new Date()) }
function formatLongDate(date: Date) { return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date) }
function formatInputDate(date: Date) { return dateKey(date) }
function shiftDate(date: Date, amount: number) { const next = new Date(date); next.setDate(next.getDate() + amount); return next }

type CategoryDialogState = {
    mode: 'edit' | 'delete'
    categoryId: Id<'habitCategories'>
    categoryName: string
} | null

export function HomePage() {
    const [selectedDate, setSelectedDate] = useState(() => new Date())
    const [newHabit, setNewHabit] = useState('')
    const [categoryId, setCategoryId] = useState<Id<'habitCategories'> | ''>('')
    const [newCategory, setNewCategory] = useState('')
    const [categoryDialog, setCategoryDialog] = useState<CategoryDialogState>(null)
    const [addHabitCategory, setAddHabitCategory] = useState<{ id: Id<'habitCategories'> | 'uncategorized'; name: string } | null>(null)
    const categoriesQuery = useCategories()
    const createCategory = useCreateCategory()
    const renameCategory = useRenameCategory()
    const deleteCategory = useDeleteCategory()
    const setHabitCategory = useSetHabitCategory()
    const categories = categoriesQuery.data ?? []
    const selectedKey = useMemo(() => dateKey(selectedDate), [selectedDate])
    const habitsQuery = useHabits()
    const completionsQuery = useCompletions(selectedKey)
    const createHabit = useCreateHabit()
    const toggleCompletion = useToggleHabitCompletion()
    const habits = habitsQuery.data ?? []
    const completions = new Set((completionsQuery.data ?? []).map((completion) => completion.habitId))
    const completedCount = habits.filter((habit) => completions.has(habit._id)).length
    const groups = [
        ...categories.map((category) => ({
            id: category._id,
            name: category.name,
            habits: habits.filter((habit) => habit.categoryId === category._id),
        })),
        { id: 'uncategorized', name: 'Sans catégorie', habits: habits.filter((habit) => !habit.categoryId) },
    ]
    const dataError = habitsQuery.isError || categoriesQuery.isError || completionsQuery.isError
    const mutationError = createHabit.isError || createCategory.isError || renameCategory.isError || deleteCategory.isError || setHabitCategory.isError || toggleCompletion.isError
    const isHabitDataLoading = habitsQuery.isPending || categoriesQuery.isPending
    const isProgressLoading = isHabitDataLoading || completionsQuery.isPending || toggleCompletion.isPending
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
        createHabit.mutate({ name, categoryId: categoryId || undefined }, {
            onSuccess: () => setNewHabit(''),
        })
    }

    function openAddHabitDialog(category: { id: Id<'habitCategories'> | 'uncategorized'; name: string }) {
        createHabit.reset()
        setNewHabit('')
        setAddHabitCategory(category)
    }

    function addHabitToCategory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const name = newHabit.trim()
        if (!name || !addHabitCategory) return
        createHabit.mutate(
            { name, categoryId: addHabitCategory.id === 'uncategorized' ? undefined : addHabitCategory.id },
            { onSuccess: () => { setNewHabit(''); setAddHabitCategory(null) } },
        )
    }

    function addCategory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const name = newCategory.trim()
        if (!name) return
        createCategory.mutate({ name }, { onSuccess: (id) => { setNewCategory(''); setCategoryId(id) } })
    }

    function openCategoryDialog(mode: 'edit' | 'delete', categoryIdToOpen: Id<'habitCategories'>, categoryName: string) {
        setCategoryDialog({ mode, categoryId: categoryIdToOpen, categoryName })
    }

    function closeCategoryDialog() {
        setCategoryDialog(null)
    }

    function renameCategoryFromDialog(categoryIdToRename: Id<'habitCategories'>, name: string) {
        renameCategory.mutate({ categoryId: categoryIdToRename, name }, { onSuccess: closeCategoryDialog })
    }

    function deleteCategoryFromDialog(categoryIdToDelete: Id<'habitCategories'>) {
        deleteCategory.mutate({ categoryId: categoryIdToDelete }, { onSuccess: closeCategoryDialog })
    }

    return (
        <main className="tracker-shell">
            <header className="tracker-header">
                <div className="brand-lockup">
                    <div className="brand-mark" aria-hidden="true"><Sparkles size={18} /></div>
                    <div><p className="eyebrow">eliabits</p><h1>Mes habitudes</h1></div>
                </div>
            </header>

            <div className="tracker-grid">
                <div className="tracker-main">
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
                <p className="today-progress" aria-live="polite">
                    {isProgressLoading ? (
                        <Spinner className="progress-spinner" aria-label="Chargement de la progression" />
                    ) : (
                        <strong>{completedCount}</strong>
                    )}
                    <span>{isProgressLoading ? 'Progression en cours…' : `/ ${habits.length} réalisées`}</span>
                </p>
            </section>

            <section className="habit-list" aria-busy={isHabitDataLoading} aria-label={`Habitudes du ${formatLongDate(selectedDate)}`}>
                {isHabitDataLoading && <HomeHabitListSkeleton />}
                {dataError && <p className="habit-state error-state" role="alert">Impossible de charger tes habitudes pour le moment. Réessaie dans un instant.</p>}
                {!isHabitDataLoading && !dataError && groups.map((group, groupIndex) => (
                    <Fragment key={group.id}>
                    <section className="category-row" aria-label={group.name}>
                        <div className="category-heading">
                            <div className="category-heading-label">
                                <h2>{group.name}</h2>
                                <span>{group.habits.filter((habit) => completions.has(habit._id)).length} / {group.habits.length}</span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="category-add-button"
                                aria-label={`Ajouter une habitude dans ${group.name}`}
                                onClick={() => openAddHabitDialog({ id: group.id as Id<'habitCategories'> | 'uncategorized', name: group.name })}
                            >
                                <Plus />
                            </Button>
                        </div>
                        <div className="category-habits">
                            {group.habits.length === 0 && <p className="category-empty">Aucune habitude dans cette catégorie.</p>}
                            {group.habits.map((habit) => {
                                const checked = completions.has(habit._id)
                                return (
                                    <Card key={habit._id} className="habit-card" data-completed={checked}>
                                        <button
                                            type="button"
                                            className="habit-card-toggle"
                                            aria-pressed={checked}
                                            aria-label={habit.name}
                                            disabled={toggleCompletion.isPending || completionsQuery.isPending || completionsQuery.isError}
                                            onClick={() => toggleHabit(habit._id)}
                                        >
                                            <span className="habit-check" aria-hidden="true">{checked && <Check size={16} />}</span>
                                            <Tooltip>
                                                <TooltipTrigger render={<span className="habit-card-name" />}>
                                                    {habit.name}
                                                </TooltipTrigger>
                                                <TooltipContent>{habit.name}</TooltipContent>
                                            </Tooltip>
                                            <span className="habit-card-status">{checked ? 'Faite' : 'À faire'}</span>
                                        </button>
                                        <Select
                                            value={habit.categoryId ?? 'none'}
                                            onValueChange={(value) => setHabitCategory.mutate({ habitId: habit._id, categoryId: value && value !== 'none' ? value as Id<'habitCategories'> : undefined })}
                                            disabled={setHabitCategory.isPending}
                                        >
                                            <SelectTrigger className="category-select habit-category-select" aria-label={`Catégorie de ${habit.name}`}>
                                                <SelectValue>{categories.find((category) => category._id === habit.categoryId)?.name ?? 'Sans catégorie'}</SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Sans catégorie</SelectItem>
                                                {categories.map((category) => <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </Card>
                                )
                            })}
                        </div>
                    </section>
                    {groupIndex < groups.length - 1 && <Separator className="category-separator" />}
                    </Fragment>
                ))}
                {mutationError && <p className="habit-state error-state" role="alert">La modification n’a pas été enregistrée. Réessaie dans un instant.</p>}
                <div className="habit-forms">
                    <form className="add-habit" onSubmit={addHabit}>
                        <Input value={newHabit} onChange={(event) => setNewHabit(event.target.value)} placeholder="Ajouter une habitude…" aria-label="Nom de la nouvelle habitude" />
                        <Select
                            value={categoryId || 'none'}
                            onValueChange={(value) => setCategoryId(value && value !== 'none' ? value as Id<'habitCategories'> : '')}
                            disabled={categoriesQuery.isPending || categoriesQuery.isError}
                        >
                            <SelectTrigger className="category-select" aria-label="Catégorie de la nouvelle habitude">
                                <SelectValue>{categories.find((category) => category._id === categoryId)?.name ?? 'Sans catégorie'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Sans catégorie</SelectItem>
                                {categories.map((category) => <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button type="submit" variant="outline" disabled={!newHabit.trim() || createHabit.isPending || categoriesQuery.isPending || categoriesQuery.isError}><Plus /> Ajouter</Button>
                    </form>
                </div>
            </section>

            <Dialog open={addHabitCategory !== null} onOpenChange={(open) => { if (!open) setAddHabitCategory(null) }}>
                <DialogContent>
                    <DialogHeader>
                        <p className="eyebrow">Nouvelle habitude</p>
                        <DialogTitle>Ajouter dans « {addHabitCategory?.name} »</DialogTitle>
                        <DialogDescription>Donne un nom à cette habitude pour la retrouver dans ta routine.</DialogDescription>
                    </DialogHeader>
                    <form className="add-habit-dialog-form" onSubmit={addHabitToCategory}>
                        <Input
                            value={newHabit}
                            onChange={(event) => setNewHabit(event.target.value)}
                            placeholder="Ex. Lire 10 minutes"
                            aria-label="Nom de la nouvelle habitude"
                            autoFocus
                            disabled={createHabit.isPending}
                        />
                        {createHabit.isError && <p className="dialog-error" role="alert">Impossible d’ajouter cette habitude. Réessaie.</p>}
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setAddHabitCategory(null)} disabled={createHabit.isPending}>Annuler</Button>
                            <Button type="submit" disabled={!newHabit.trim() || createHabit.isPending}>
                                <Plus />
                                {createHabit.isPending ? 'Ajout…' : 'Ajouter'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
                </div>

                {isHabitDataLoading ? <CategoryManagerSkeleton /> : <Card className="category-manager-card">
                    <div className="category-manager-header">
                        <div>
                            <p className="eyebrow">Organisation</p>
                            <h2>Catégories</h2>
                        </div>
                        <span className="category-manager-count">{categories.length}</span>
                    </div>
                    <p className="category-manager-description">Range tes habitudes pour retrouver ton rythme plus facilement.</p>
                    <form className="category-create-form" onSubmit={addCategory}>
                        <Input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Ex. Bien-être" aria-label="Nom de la nouvelle catégorie" />
                        <Button type="submit" size="icon" aria-label="Créer la catégorie" disabled={!newCategory.trim() || createCategory.isPending}><Plus /></Button>
                    </form>
                    <Separator className="category-manager-separator" />
                    <div className="category-manager-list" aria-label="Liste des catégories">
                        {categories.length === 0 && <p className="category-manager-empty">Aucune catégorie créée.</p>}
                        {categories.map((category) => {
                            const categoryHabitCount = habits.filter((habit) => habit.categoryId === category._id).length
                            return (
                                <div className="category-manager-row" key={category._id}>
                                    <div className="category-manager-name"><span className="category-dot" aria-hidden="true" /><span>{category.name}</span><small>{categoryHabitCount}</small></div>
                                    <div className="category-manager-actions">
                                        <Button type="button" variant="ghost" size="icon" aria-label={`Renommer ${category.name}`} onClick={() => openCategoryDialog('edit', category._id, category.name)}><Pencil /></Button>
                                        <Button type="button" variant="ghost" size="icon" aria-label={`Supprimer ${category.name}`} onClick={() => openCategoryDialog('delete', category._id, category.name)}><Trash2 /></Button>
                                    </div>
                                </div>
                            )
                        })}
                        <Separator className="category-manager-separator" />
                        <div className="category-manager-row"><div className="category-manager-name"><span className="category-dot muted" aria-hidden="true" /><span>Sans catégorie</span><small>{habits.filter((habit) => !habit.categoryId).length}</small></div><span className="category-manager-note">par défaut</span></div>
                    </div>
                </Card>}
                {categoryDialog && (
                    <CategoryDialog
                        key={`${categoryDialog.mode}-${categoryDialog.categoryId}`}
                        open
                        mode={categoryDialog.mode}
                        categoryId={categoryDialog.categoryId}
                        categoryName={categoryDialog.categoryName}
                        isSubmitting={categoryDialog.mode === 'edit' ? renameCategory.isPending : deleteCategory.isPending}
                        errorMessage={categoryDialog.mode === 'edit' && renameCategory.isError
                            ? 'Le nom n’a pas pu être modifié. Réessaie.'
                            : categoryDialog.mode === 'delete' && deleteCategory.isError
                                ? 'La catégorie n’a pas pu être supprimée. Réessaie.'
                                : undefined}
                        onOpenChange={(open) => { if (!open) closeCategoryDialog() }}
                        onRename={renameCategoryFromDialog}
                        onDelete={deleteCategoryFromDialog}
                    />
                )}
            </div>

        </main>
    )
}
