import type { FC } from "react"
import Spinner from "../Spinner/Spinner"

interface SubmitButtonProps {
  label: string
  newClassName?: string
  className?: string
  loading?: boolean
  loadingLabel?: string
}

const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  newClassName,
  className,
  loading = false,
  loadingLabel = "Loading...",
}) => {
  const defaultClassName = `px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className ?? ""}`

  return (
    <button
      type="submit"
      className={newClassName ?? defaultClassName}
      disabled={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner size="xs" />
          {loadingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  )
}

export default SubmitButton