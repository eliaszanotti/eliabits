import type { ButtonProps } from "./button.types"
import { buttonVariants } from "./button.variants"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cn } from "cn"


function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonProps) {
    return (
        <ButtonPrimitive
            data-slot="button"
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button }
