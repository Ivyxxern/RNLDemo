import type { FC } from "react"
import Spinner from "../Spinner/Spinner"

interface SubmitButtonProps {
  label: string
  newClassName?: string
  className?: string
  loading?: boolean
  loadingLabel?: string
  /** Light spinner for green/primary buttons */
  spinnerOnPrimary?: boolean
}

const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  newClassName,
  className,
  loading = false,
  loadingLabel = "Loading...",
  spinnerOnPrimary = false,
}) => {
  const defaultClassName = `px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium cursor-pointer rounded-lg 
  shadow-lg disabled:opacity-50 disabled:cursor-not-allowed  ${className ?? ""}`

  return (
    <button
      type="submit"
      className={newClassName ?? defaultClassName}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner
            size="xs"
            className={
              spinnerOnPrimary ? "text-white/30 fill-white" : undefined
            }
          />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  )
}

export default SubmitButton