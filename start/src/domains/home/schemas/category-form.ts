import * as v from 'valibot'

export const categoryFormSchema = v.object({
    name: v.pipe(
        v.string(),
        v.trim(),
        v.nonEmpty('Saisis un nom de catégorie.'),
        v.maxLength(40, 'Le nom doit contenir 40 caractères maximum.'),
    ),
})
