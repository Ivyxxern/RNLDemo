import { useState } from "react"
import ToastMessage from "../../components/ToastMessage/ToastMessage"
import { useModal } from "../../hooks/useModal"
import { useToastMessage } from "../../hooks/useToastMessage"
import AddUserFormModal from "./Components/AddUserFormModal"
import UserList from "./Components/UserList"

const UserMainPage = () => {
  const [userListRefresh, setUserListRefresh] = useState(0)
  const { isOpen, openModal, closeModal } = useModal(false)
  const {
    message: toastMessage,
    isVisible: toastVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false)

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isSuccess={toastVisible}
        onClose={closeToastMessage}
      />
      <AddUserFormModal
        isOpen={isOpen}
        onClose={closeModal}
        onUserAdded={(message) => {
          showToastMessage(message)
          closeModal()
          setUserListRefresh((n) => n + 1)
        }}
      />
      <UserList onAddUser={openModal}
        refreshTrigger={userListRefresh} />
    </>
  )
}

export default UserMainPage