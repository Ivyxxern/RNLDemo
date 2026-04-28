import type { FC } from "react"

interface ModalCloseButtonProps {
  onClose: () => void
}

const ModalCloseButton: FC<ModalCloseButtonProps> = ({ onClose }) => {
  return (
    <button
      type="button"
      onClick={onClose}
      className="absolute right-4 top-4 z-999 flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-full bg-white text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:h-11 sm:w-11"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.47 6.47a.75.75 0 0 1 1.06 0L12 10.94l4.47-4.47a.75.75 0 1 1 1.06 1.06L13.06 12l4.47 4.47a.75.75 0 1 1-1.06 1.06L12 13.06l-4.47 4.47a.75.75 0 1 1-1.06-1.06L10.94 12 6.47 7.53a.75.75 0 0 1 0-1.06Z"
          fill="currentColor"
        />
      </svg>
    </button>
  )
}

export default ModalCloseButton