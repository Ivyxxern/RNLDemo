import { useEffect } from "react"
import DeleteGenderForm from "./components/DeleteGenderForm"

const DeleteGenderPage = () => {
  useEffect(() => {
    document.title = 'Delete Gender Page'
  }, [])

  return (
    <>
      <DeleteGenderForm />
    </>
  )
}

export default DeleteGenderPage