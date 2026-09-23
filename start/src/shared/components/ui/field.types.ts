import type { ComponentProps } from "react"
import type { VariantProps } from "class-variance-authority"

import type { fieldVariants } from "./field.variants"

export type FieldProps = ComponentProps<"div"> & VariantProps<typeof fieldVariants>

export type FieldLegendProps = ComponentProps<"legend"> & {
    variant?: "legend" | "label"
}

export type FieldErrorProps = ComponentProps<"div"> & {
    errors?: Array<{ message?: string } | undefined>
}
