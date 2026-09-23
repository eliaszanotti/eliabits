import { Field as FormField, Form, reset, useForm } from '@formisch/react'
import { useState } from 'react'

import { Button } from '@/shared/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Separator } from '@/shared/components/ui/separator'
import { demoFormSchema } from '../schemas/demo-form'

export function HomePage() {
    const [clicks, setClicks] = useState(0)
    const [submittedEmail, setSubmittedEmail] = useState('')
    const form = useForm({
        schema: demoFormSchema,
        initialInput: { email: '' },
    })

    function resetDemo() {
        reset(form)
        setSubmittedEmail('')
    }

    return (
        <main className="space-y-10">
            <header className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">eliabits / composants</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    On teste les composants.
                </h1>
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                    Quelques composants shadcn/ui, avec le thème installé et une validation de formulaire à essayer.
                </p>
            </header>

            <section aria-labelledby="buttons-title" className="space-y-5">
                <div className="space-y-1">
                    <h2 id="buttons-title" className="text-lg font-semibold">Boutons</h2>
                    <p className="text-sm text-muted-foreground">
                        Variantes principale, secondaire, contour et désactivée.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button onClick={() => setClicks((count) => count + 1)}>Tester le clic</Button>
                    <Button variant="secondary" onClick={() => setClicks(0)}>Remettre à zéro</Button>
                    <Button variant="outline" onClick={() => document.getElementById('demo-email')?.focus()}>
                        Aller au formulaire
                    </Button>
                    <Button disabled>Indisponible</Button>
                </div>
                <p role="status" className="text-sm text-muted-foreground">
                    {clicks} clic{clicks > 1 ? 's' : ''} enregistré{clicks > 1 ? 's' : ''}.
                </p>
            </section>

            <Separator />

            <section aria-labelledby="form-title" className="space-y-5">
                <div className="space-y-1">
                    <h2 id="form-title" className="text-lg font-semibold">Un formulaire à essayer</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Valide le champ vide pour voir l’erreur, puis essaie une adresse e-mail.
                        Ce test reste dans ton navigateur.
                    </p>
                </div>
                <Form
                    of={form}
                    onSubmit={(values) => setSubmittedEmail(values.email)}
                    onInput={() => setSubmittedEmail('')}
                    className="space-y-5"
                >
                    <FormField of={form} path={['email']}>
                        {(field) => (
                            <Field data-invalid={field.errors !== null}>
                                <FieldLabel htmlFor="demo-email">Adresse e-mail</FieldLabel>
                                <Input
                                    {...field.props}
                                    id="demo-email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="toi@exemple.fr"
                                    value={field.input ?? ''}
                                    aria-invalid={field.errors !== null}
                                    aria-describedby="demo-email-description"
                                    aria-errormessage={field.errors ? 'demo-email-error' : undefined}
                                />
                                <FieldDescription id="demo-email-description">
                                    Aucun e-mail ne sera envoyé.
                                </FieldDescription>
                                <FieldError
                                    id="demo-email-error"
                                    errors={field.errors?.map((message) => ({ message }))}
                                />
                            </Field>
                        )}
                    </FormField>
                    <div className="flex flex-wrap gap-3">
                        <Button type="submit" disabled={form.isSubmitting}>Valider le formulaire</Button>
                        <Button type="button" variant="ghost" onClick={resetDemo}>Effacer</Button>
                    </div>
                    <p role="status" className="min-h-5 text-sm font-medium">
                        {submittedEmail ? `Validation réussie pour ${submittedEmail}.` : ''}
                    </p>
                </Form>
            </section>
        </main>
    )
}
