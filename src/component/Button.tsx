import clsx from 'clsx'
import { ButtonHTMLAttributes, ComponentType, forwardRef } from 'react'
import { Spinner } from './Spinner'
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: any) {
  return (
    <button
      className={clsx(
        'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
        'bg-zinc-600 font-semibold text-zinc-100 hover:bg-zinc-400 active:bg-zinc-800 active:text-zinc-100/70',
        className
      )}
      {...props}
    />
  )
}

const SpinnerButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    Icon?: ComponentType<{ className?: string }>
    isSpinning?: boolean
  }
>(({ children, Icon = null, isSpinning = false, ...props }, ref) => (
  <Button {...props} ref={ref} disabled={isSpinning || props.disabled}>
    {isSpinning ? (
      <Spinner className={`w-5 h-5`} />
    ) : (
      Icon && <Icon className={`w-5 h-5`} />
    )}
    {children}
  </Button>
))

SpinnerButton.displayName = "SpinnerButton"

export {SpinnerButton}