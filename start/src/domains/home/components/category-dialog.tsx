import { Field, Form, reset, useForm } from '@formisch/react'
import { useEffect } from 'react'
import type { Id } from '../../../../convex/_generated/dataModel'

import { Button } from '@/shared/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { categoryFormSchema } from '../schemas/category-form'

type CategoryDialogMode = 'edit' | 'delete'

type CategoryDialogProps = {
    open: boolean
    mode: CategoryDialogMode
    categoryId: Id<'habitCategories'>
    categoryName: string
    isSubmitting: boolean
    errorMessage?: string
    onOpenChange: (open: boolean) => void
    onRename: (categoryId: Id<'habitCategories'>, name: string) => void
    onDelete: (categoryId: Id<'habitCategories'>) => void
}

export function CategoryDialog({
    open,
    mode,
    categoryId,
    categoryName,
    isSubmitting,
    errorMessage,
    onOpenChange,
    onRename,
    onDelete,
}: CategoryDialogProps) {
    const form = useForm({
        schema: categoryFormSchema,
        initialInput: { name: categoryName },
        validate: 'change',
        revalidate: 'change',
    })

    useEffect(() => {
        reset(form, { initialInput: { name: categoryName } })
    }, [categoryName, form])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="category-dialog">
                {mode === 'edit' ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Renommer la catégorie</DialogTitle>
                            <DialogDescription>Choisis un nom court pour retrouver tes habitudes facilement.</DialogDescription>
                        </DialogHeader>
                        <Form
                            of={form}
                            className="category-dialog-form"
                            onSubmit={(output) => onRename(categoryId, output.name)}
                        >
                            <Field of={form} path={['name']}>
                                {(field) => (
                                    <div className="category-dialog-field">
                                        <label htmlFor="category-name">Nom</label>
                                        <Input
                                            {...field.props}
                                            id="category-name"
                                            value={field.input ?? ''}
                                            autoFocus
                                            aria-invalid={field.errors ? true : undefined}
                                        />
                                        {field.errors?.[0] && <p className="category-dialog-error" role="alert">{field.errors[0]}</p>}
                                    </div>
                                )}
                            </Field>
                            {errorMessage && <p className="category-dialog-error" role="alert">{errorMessage}</p>}
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                                <Button type="submit" disabled={isSubmitting || !form.isValid}>Enregistrer</Button>
                            </DialogFooter>
                        </Form>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Supprimer « {categoryName} » ?</DialogTitle>
                            <DialogDescription>
                                Les habitudes de cette catégorie seront déplacées dans « Sans catégorie ». Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        {errorMessage && <p className="category-dialog-error" role="alert">{errorMessage}</p>}
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                            <Button type="button" variant="destructive" disabled={isSubmitting} onClick={() => onDelete(categoryId)}>Supprimer</Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
