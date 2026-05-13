import type { FC } from "react"
import { Link, useNavigate } from "react-router-dom"

interface BackButtonProps {
  label: string
  path?: string
  newClassName?: string
  className?: string
}


const BackButton: FC<BackButtonProps> = ({
  label,
  path,
  newClassName,
  className,
}) => {
  const navigate = useNavigate()

  const resolvedTo = path ?? "/genders"

  const handleBack = () => {
    // Fallback behavior if we render the button variant.
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate("/genders")
  }

  const baseClass =
    newClassName ??
    `px-4 py-3 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-700
       text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className ?? ""}`

  return (
    <>
      {/* If a path is provided, prefer Link for guaranteed navigation */}
      {path ? (
        <Link to={resolvedTo} className={baseClass}>
          {label}
        </Link>
      ) : (
        <button type="button" onClick={handleBack} className={baseClass}>
          {label}
        </button>
      )}
    </>
  )
}

export default BackButton