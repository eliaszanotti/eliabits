import * as v from 'valibot'

export const demoFormSchema = v.object({
    email: v.pipe(
        v.string(),
        v.nonEmpty('Saisis une adresse e-mail.'),
        v.email('Cette adresse e-mail ne semble pas valide.'),
    ),
})
