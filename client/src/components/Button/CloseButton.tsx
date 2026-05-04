import type { FC } from "react"

interface CloseButtonProps {
  label: string
  onClose: () => void
  newClassName?: string
  className?: string
}

const CloseButton: FC<CloseButtonProps> = ({
  label,
  onClose,
  newClassName,
  className,
}) => {
  return (
    <>
      <button
        type="button"
        className={`${
          newClassName
            ? newClassName
            : `px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 text-sm font-medium cursor-pointer rounded-lg border border-gray-300/80 ${className ?? ""}`
        }`}
        onClick={onClose}
      >
        {label}
      </button>
    </>
  )
}

export default CloseButton