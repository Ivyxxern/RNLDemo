import type { FC } from "react"
import { useNavigate } from "react-router-dom"

interface BackButtonProps {
  label: string 
  path?: string 
  newClassName?: string 
  className?: string
}


const BackButton: FC<BackButtonProps>= ({
  label, 
  path,
  newClassName, 
  className,
}) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }

    navigate(path ?? "/genders")
  }

  return (
    <>
    <button
      type="button"
      onClick={handleBack}
      className={`${newClassName ? newClassName 
        : `px-4 py-3 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-700
       text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className}`
        }`}
      >
        {label}
      </button>
    </>
  )
}

export default BackButton