import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', ...props }, ref) => {
        const variants = {
            primary: "bg-tennis-green text-white hover:bg-tennis-green/90 shadow-lg shadow-tennis-green/20",
            secondary: "bg-tennis-clay text-white hover:bg-tennis-clay/90 shadow-lg shadow-tennis-clay/20",
            outline: "border border-tennis-white/20 hover:bg-white/10 text-tennis-white",
            ghost: "hover:bg-white/10 text-tennis-white",
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tennis-green disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
                    variants[variant],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
