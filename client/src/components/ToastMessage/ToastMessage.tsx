import { useEffect, type FC } from "react"
import { createPortal } from "react-dom";

interface ToastMessageProps {
  message: string
  isSuccess: boolean
  onClose: () => void
}

const ToastMessage: FC<ToastMessageProps> = ({
  message,
  isSuccess,
  onClose,
}) => {
  const toastTheme = isSuccess
    ? "bg-green-100 text-black"
    : "bg-red-100 text-red-800";

  const iconTheme = isSuccess
    ? "text-green-600 bg-green-200"
    : "text-red-600 bg-red-200";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!message) return null;

  return createPortal(
    <div className={`fixed top-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 rounded-lg shadow-lg ${toastTheme}`}
      style={{ zIndex: 9999 }}
      role="alert">
      <div className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${iconTheme}`}>

        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
        </svg>
        <span className="sr-only">Check Icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
    </div>,
    document.body
  )
}

export default ToastMessage